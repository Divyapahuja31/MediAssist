import express from 'express';
import * as medicationController from './medication.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { createMedicationSchema, updateMedicationSchema } from './medication.validator.js';

const router = express.Router();

router.use(protect);

router.post('/', validate(createMedicationSchema), medicationController.create);
router.get('/', medicationController.list);
router.get('/:id', medicationController.get);
router.patch('/:id', validate(updateMedicationSchema), medicationController.update);
router.delete('/:id', medicationController.remove);

export default router;
