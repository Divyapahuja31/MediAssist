import prisma from '../../config/db.js';

export const upsertDevice = async (data) => {
    const { userId, expoPushToken, platform } = data;
    return await prisma.device.upsert({
        where: { expoPushToken },
        update: {
            userId,
            platform,
            updatedAt: new Date(),
        },
        create: {
            userId,
            expoPushToken,
            platform,
        },
    });
};

export const listByUser = async (userId) => {
    return await prisma.device.findMany({
        where: { userId },
    });
};

export const deleteByToken = async (userId, expoPushToken) => {
    const device = await prisma.device.findUnique({
        where: { expoPushToken },
    });

    if (!device || device.userId !== userId) {
        const error = new Error('Device not found or access denied');
        error.statusCode = 404;
        throw error;
    }

    return await prisma.device.delete({
        where: { expoPushToken },
    });
};

export const deleteByTokenForce = async (expoPushToken) => {
    try {
        await prisma.device.delete({
            where: { expoPushToken },
        });
    } catch (error) {
        // Ignore error if token doesn't exist
    }
};
