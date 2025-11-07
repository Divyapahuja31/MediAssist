import express from 'express';
import * as deviceController from './device.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { registerDeviceSchema } from './device.validator.js';

const router = express.Router();

router.use(protect);

router.post('/register', validate(registerDeviceSchema), deviceController.registerDevice);
router.get('/', deviceController.listDevices);
router.delete('/:expoPushToken', deviceController.deleteDevice);

export default router;
