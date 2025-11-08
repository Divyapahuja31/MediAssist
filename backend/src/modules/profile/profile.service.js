import prisma from '../../config/db.js';

export const getProfile = async (userId) => {
    return await prisma.profile.findUnique({
        where: { userId },
    });
};

export const upsertProfile = async (userId, data) => {
    return await prisma.profile.upsert({
        where: { userId },
        update: data,
        create: {
            userId,
            ...data,
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
