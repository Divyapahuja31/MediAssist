import { Expo } from 'expo-server-sdk';
import logger from '../utils/logger.js';
import prisma from '../config/db.js';

const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

export const sendToTokens = async (pushTokens, title, body, data = {}) => {
    const messages = [];
    for (let pushToken of pushTokens) {
        if (!Expo.isExpoPushToken(pushToken)) {
            logger.warn(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }

        messages.push({
            to: pushToken,
            sound: 'default',
            title,
            body,
            data,
        });
    }

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (let chunk of chunks) {
        try {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        } catch (error) {
            logger.error('Error sending push notifications:', error);
        }
    }

    return tickets;
};

export const sendToUser = async (userId, title, body, data = {}) => {
    try {
        const devices = await prisma.device.findMany({
            where: { userId },
            select: { pushToken: true },
        });

        const tokens = devices.map((d) => d.pushToken);
        if (tokens.length === 0) return;

        return await sendToTokens(tokens, title, body, data);
    } catch (error) {
        logger.error(`Error sending push to user ${userId}:`, error);
    }
};

export const processReceipts = async (receiptIds) => {
    // Placeholder for receipt processing logic
    // In a real app, you'd check receipts and remove invalid tokens
    logger.info(`Processing ${receiptIds.length} receipts`);
};
