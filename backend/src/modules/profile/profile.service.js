import prisma from '../../config/db.js';

export const getProfile = async (userId) => {
    return await prisma.profile.findUnique({
        where: { userId },
    });
};

export const upsertProfile = async (userId, data) => {
    const updateData = { ...data };
    if (updateData.dob) {
        updateData.dob = new Date(updateData.dob);
    }

    return await prisma.profile.upsert({
        where: { userId },
        update: updateData,
        create: {
            userId,
            ...updateData,
        },
    });
};

export const getEmergencyInfo = async (userId) => {
    const profile = await prisma.profile.findUnique({
        where: { userId },
        select: {
            name: true,
            bloodGroup: true,
            allergies: true,
            emergencyContacts: true,
            dob: true,
        },
    });

    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    return profile;
};

export const createEmergencyToken = async (userId) => {
    // Revoke existing tokens
    await prisma.emergencyToken.deleteMany({
        where: { userId },
    });

    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

    return await prisma.emergencyToken.create({
        data: {
            userId,
            token,
            expiresAt,
        },
    });
};

export const getEmergencyToken = async (userId) => {
    const tokenData = await prisma.emergencyToken.findFirst({
        where: { userId },
    });

    if (!tokenData) return null;

    if (new Date() > tokenData.expiresAt) {
        await prisma.emergencyToken.delete({ where: { id: tokenData.id } });
        return null;
    }

    return tokenData;
};

export const revokeEmergencyToken = async (userId, token) => {
    return await prisma.emergencyToken.deleteMany({
        where: { userId, token },
    });
};

export const getEmergencyInfoByToken = async (token) => {
    const tokenData = await prisma.emergencyToken.findUnique({
        where: { token },
        include: { user: { include: { profile: true } } },
    });

    if (!tokenData) {
        const error = new Error('Invalid or expired token');
        error.statusCode = 404;
        throw error;
    }

    if (new Date() > tokenData.expiresAt) {
        await prisma.emergencyToken.delete({ where: { id: tokenData.id } });
        const error = new Error('Token expired');
        error.statusCode = 404;
        throw error;
    }

    const profile = tokenData.user.profile;
    if (!profile) {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        throw error;
    }

    return {
        name: profile.name,
        bloodGroup: profile.bloodGroup,
        allergies: profile.allergies,
        emergencyContacts: profile.emergencyContacts,
        dob: profile.dob,
    };
};
