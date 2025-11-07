import prisma from '../../config/db.js';
import * as storageService from '../../services/storage.service.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const create = async (userId, file, data) => {
    if (data.medicationId) {
        const medication = await prisma.medication.findUnique({
            where: { id: data.medicationId },
        });
        if (!medication || medication.userId !== userId) {
            const error = new Error('Medication not found');
            error.statusCode = 404;
            throw error;
        }
    }

    const key = `prescriptions/${userId}/${uuidv4()}${path.extname(file.originalname)}`;
    await storageService.uploadFile(file.buffer, key, file.mimetype);

    return await prisma.prescription.create({
        data: {
            userId,
            medicationId: data.medicationId,
            storageKey: key,
            filename: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
        },
    });
};

export const listByUser = async (userId) => {
    return await prisma.prescription.findMany({
        where: { userId },
        include: { medication: true },
        orderBy: { createdAt: 'desc' },
    });
};

export const getDownloadUrl = async (userId, id) => {
    const prescription = await prisma.prescription.findUnique({
        where: { id },
    });

    if (!prescription || prescription.userId !== userId) {
        const error = new Error('Prescription not found');
        error.statusCode = 404;
        throw error;
    }

    const url = await storageService.getSignedUrl(prescription.storageKey);
    return { url, filename: prescription.filename };
};
