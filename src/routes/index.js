import { Router } from 'express';
import authRoutes from './auth.routes.js';
import healthRoutes from './health.routes.js';

const router = Router();

router.use('/api/v1', healthRoutes);
router.use('/api/v1/auth', authRoutes);

export default router;
