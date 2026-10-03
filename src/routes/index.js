import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import taskRoutes from './task.routes.js';

const router = Router();

router.use('/api/v1', healthRoutes);
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/tasks', taskRoutes);

export default router;
