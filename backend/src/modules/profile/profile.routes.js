import express from 'express';
import * as profileController from './profile.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { updateProfileSchema } from './profile.validator.js';

const router = express.Router();

// Protected routes
router.get('/me', protect, profileController.getMe);
router.post('/me', protect, validate(updateProfileSchema), profileController.updateMe);

// Public route (for QR code scanning)
router.get('/:userId/emergency', profileController.getEmergencyInfo);

export default router;
