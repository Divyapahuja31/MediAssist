import express from 'express';
import * as profileController from './profile.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { updateProfileSchema } from './profile.validator.js';

const router = express.Router();

router.get('/me', protect, profileController.getMe);
router.post('/me', protect, validate(updateProfileSchema), profileController.updateMe);

router.get('/:userId/emergency', profileController.getEmergencyInfo);

export default router;
