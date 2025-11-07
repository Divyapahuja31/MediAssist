import prisma from '../../config/db.js';

export const createLog = async (userId, data) => {
    return await prisma.adherenceLog.create({
        data: {
            userId,
            ...data,
            takenAt: new Date(),
        },
    });
};

export const listByUser = async (userId, query) => {
    const where = { userId };

    if (query.scheduleId) where.scheduleId = query.scheduleId;
    if (query.medicationId) where.medicationId = query.medicationId;

    return await prisma.adherenceLog.findMany({
        where,
        orderBy: { takenAt: 'desc' },
        take: 100,
    });
};
