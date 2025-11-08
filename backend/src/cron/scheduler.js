import cron from 'node-cron';
import prisma from '../config/db.js';
import { sendToUser } from '../services/push.service.js';
import { computeNextAfter } from '../utils/nextRun.helper.js';
import logger from '../utils/logger.js';

const checkReminders = async () => {
    logger.info('Running reminder check...');
    const now = new Date();

    try {
        const dueSchedules = await prisma.medicationSchedule.findMany({
            where: {
                active: true,
                nextRunAt: {
                    lte: now,
                },
            },
            include: {
                medication: true,
            },
            take: 200, 
        });

        logger.info(`Found ${dueSchedules.length} due schedules`);

        for (const schedule of dueSchedules) {
            const { medication, userId } = schedule;

            await sendToUser(
                userId,
                `Time for your ${medication.name}`,
                `Take ${schedule.dosage} of ${medication.name}.`,
                { scheduleId: schedule.id }
            );

            await prisma.adherenceLog.create({
                data: {
                    scheduleId: schedule.id,
                    status: 'DELIVERED',
                    takenAt: new Date(),
                },
            });

            const nextRun = computeNextAfter(schedule.nextRunAt || now, schedule);

            await prisma.medicationSchedule.update({
                where: { id: schedule.id },
                data: {
                    lastSent: now,
                    nextRunAt: nextRun,
                },
            });
        }
    } catch (error) {
        logger.error('Scheduler Error:', error);
    }
};

export const startScheduler = () => {
    cron.schedule('* * * * *', checkReminders);
    logger.info('Scheduler started');
};
