import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../config/env.js';
import logger from '../utils/logger.js';

const s3Client = new S3Client({
    region: config.s3Region,
    credentials: {
        accessKeyId: config.s3AccessKeyId,
        secretAccessKey: config.s3SecretAccessKey,
    },
});

export const uploadFile = async (buffer, key, mimetype) => {
    try {
        const command = new PutObjectCommand({
            Bucket: config.s3BucketName,
            Key: key,
            Body: buffer,
            ContentType: mimetype,
        });

        await s3Client.send(command);
        return key;
    } catch (error) {
        logger.error('S3 Upload Error:', error);
        throw error;
    }
};

export const getSignedUrl = async (key, expiresIn = 3600) => {
    try {
        const command = new GetObjectCommand({
            Bucket: config.s3BucketName,
            Key: key,
        });
        return await awsGetSignedUrl(s3Client, command, { expiresIn });
    } catch (error) {
        logger.error('S3 Signed URL Error:', error);
        throw error;
    }
};

export const deleteFile = async (key) => {
    try {
        const command = new DeleteObjectCommand({
            Bucket: config.s3BucketName,
            Key: key,
        });
        await s3Client.send(command);
    } catch (error) {
        logger.error('S3 Delete Error:', error);
        throw error;
    }
};
