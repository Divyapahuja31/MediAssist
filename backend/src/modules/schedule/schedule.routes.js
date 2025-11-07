import express from 'express';
import * as scheduleController from './schedule.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { createScheduleSchema, updateScheduleSchema } from './schedule.validator.js';

const router = express.Router();

router.use(protect);

router.post('/', validate(createScheduleSchema), scheduleController.create);
router.get('/', scheduleController.list);
router.get('/:id', scheduleController.get);
router.patch('/:id', validate(updateScheduleSchema), scheduleController.update);
router.delete('/:id', scheduleController.remove);
router.post('/:id/mark-taken', scheduleController.markTaken);

export default router;
