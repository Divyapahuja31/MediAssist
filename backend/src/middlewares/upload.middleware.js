import multer from 'multer';
import path from 'path';
import { fail } from '../utils/response.helper.js';

// Configure storage (memory storage for now, to process before upload)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only images and PDFs are allowed'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter,
});

export const uploadMiddleware = (fieldName) => {
    return (req, res, next) => {
        const uploader = upload.single(fieldName);

        uploader(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return fail(res, 400, `Upload error: ${err.message}`);
            } else if (err) {
                return fail(res, 400, err.message);
            }
            next();
        });
    };
};
