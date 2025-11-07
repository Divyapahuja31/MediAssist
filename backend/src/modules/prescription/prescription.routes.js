import express from 'express';
import * as prescriptionController from './prescription.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { uploadMiddleware } from '../../middlewares/upload.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/upload', uploadMiddleware('file'), prescriptionController.upload);
router.get('/', prescriptionController.list);
router.get('/:id/download', prescriptionController.download);

export default router;
