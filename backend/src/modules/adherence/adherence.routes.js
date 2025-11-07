import express from 'express';
import * as adherenceController from './adherence.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', adherenceController.create);
router.get('/', adherenceController.list);

export default router;
