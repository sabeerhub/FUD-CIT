import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { loginSchema, registrationSchema } from '../utils/validation.js';

const router = Router();

router.post('/register', validateRequest(registrationSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.get('/me', authMiddleware, getMe);

export default router;
