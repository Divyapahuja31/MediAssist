import prisma from '../../config/db.js';

export const create = async (userId, data) => {
    return await prisma.medication.create({
        data: {
            userId,
            ...data,
        },
    });
};

export const listByUser = async (userId) => {
    return await prisma.medication.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
};

export const getById = async (userId, id) => {
    const medication = await prisma.medication.findUnique({
        where: { id },
    });

    if (!medication || medication.userId !== userId) {
        const error = new Error('Medication not found');
        error.statusCode = 404;
        throw error;
    }

    return medication;
};

export const update = async (userId, id, data) => {
    const medication = await prisma.medication.findUnique({
        where: { id },
    });

    if (!medication || medication.userId !== userId) {
        const error = new Error('Medication not found');
        error.statusCode = 404;
        throw error;
    }

    return await prisma.medication.update({
        where: { id },
        data,
    });
};

export const remove = async (userId, id) => {
    const medication = await prisma.medication.findUnique({
        where: { id },
    });

    if (!medication || medication.userId !== userId) {
        const error = new Error('Medication not found');
        error.statusCode = 404;
        throw error;
    }

    return await prisma.medication.delete({
        where: { id },
    });
};
