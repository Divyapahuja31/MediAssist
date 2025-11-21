import express from 'express';
import * as profileController from './profile.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { updateProfileSchema } from './profile.validator.js';

const router = express.Router();

router.get('/me', protect, profileController.getMe);
router.post('/me', protect, validate(updateProfileSchema), profileController.updateMe);

router.get('/:userId/emergency', profileController.getEmergencyInfo);

router.post('/emergency-token', protect, profileController.createEmergencyToken);
router.get('/emergency-token', protect, profileController.getEmergencyToken);
router.delete('/emergency-token/:token', protect, profileController.revokeEmergencyToken);
router.get('/emergency/:token', profileController.getEmergencyInfoByToken);

export default router; 