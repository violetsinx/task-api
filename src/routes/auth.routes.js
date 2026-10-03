import { Router } from 'express';
import { registerController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validate(registerSchema), registerController);

export default router;
