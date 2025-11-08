import prisma from '../../config/db.js';
import { computeNextRunAt, computeNextAfter } from '../../utils/nextRun.helper.js';

export const create = async (userId, data) => {
    const medication = await prisma.medication.findUnique({
        where: { id: data.medicationId },
    });

    if (!medication || medication.userId !== userId) {
        const error = new Error('Medication not found');
        error.statusCode = 404;
        throw error;
    }

    const nextRunAt = computeNextRunAt(data);

    return await prisma.medicationSchedule.create({
        data: {
            userId,
            ...data,
            nextRunAt,
        },
    });
};

export const listByUser = async (userId, query) => {
    const where = { userId };
    if (query.active !== undefined) where.active = query.active === 'true';

    return await prisma.medicationSchedule.findMany({
        where,
        include: { medication: true },
        orderBy: { nextRunAt: 'asc' },
    });
};

export const getById = async (userId, id) => {
    const schedule = await prisma.medicationSchedule.findUnique({
        where: { id },
        include: { medication: true },
    });

    if (!schedule || schedule.userId !== userId) {
        const error = new Error('Schedule not found');
        error.statusCode = 404;
        throw error;
    }

    return schedule;
};

export const update = async (userId, id, data) => {
    const schedule = await getById(userId, id);

    let nextRunAt = schedule.nextRunAt;
    if (data.timeOfDay || data.frequency || data.startDate || data.daysOfWeek) {

        const mergedData = { ...schedule, ...data };
        nextRunAt = computeNextRunAt(mergedData);
    }

    return await prisma.medicationSchedule.update({
        where: { id },
        data: {
            ...data,
            nextRunAt,
        },
    });
};

export const remove = async (userId, id) => {
    await getById(userId, id); 
    return await prisma.medicationSchedule.delete({
        where: { id },
    });
};

export const markTaken = async (userId, id) => {
    const schedule = await getById(userId, id);
    const now = new Date();

    return await prisma.$transaction(async (tx) => {
        await tx.adherenceLog.create({
            data: {
                userId,
                scheduleId: id,
                medicationId: schedule.medicationId,
                eventType: 'TAKEN',
                takenAt: now,
            },
        });
        const nextRunAt = computeNextAfter(now, schedule);

        return await tx.medicationSchedule.update({
            where: { id },
            data: {
                lastSent: now,
                nextRunAt,
            },
        });
    });
};
