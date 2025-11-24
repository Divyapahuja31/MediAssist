import fs from 'fs/promises';
import path from 'path';
import { config } from '../config/env.js';
import logger from '../utils/logger.js';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');


(async () => {
    try {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
    } catch (err) {
        logger.error('Failed to create upload directory:', err);
    }
})();

export const uploadFile = async (buffer, key, mimetype) => {
    try {
        const filePath = path.join(UPLOAD_DIR, key);
        await fs.writeFile(filePath, buffer);
        return key;
    } catch (error) {
        logger.error('Local Upload Error:', error);
        throw error;
    }
};

export const getSignedUrl = async (key) => {
    return `http://localhost:${config.port}/uploads/${key}`;
};

export const deleteFile = async (key) => {
    try {
        const filePath = path.join(UPLOAD_DIR, key);
        await fs.unlink(filePath);
    } catch (error) {
        logger.error('Local Delete Error:', error);
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
};
