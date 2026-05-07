import { Router } from 'express';
import { getStudentPerformanceAnalytics } from '../controllers/analyticsController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.get('/student/:studentId', authMiddleware, getStudentPerformanceAnalytics);

export default router;
