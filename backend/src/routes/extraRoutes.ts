import { Router } from 'express';
import {
  markAttendance, getAttendanceByCourse,
  addTestScore, getScoresByStudent,
  createAnnouncement, getAnnouncements,
  getStudentPerformanceAnalytics,
  submitProject
} from '../controllers/extraController';
import { authMiddleware } from '../middlewares/auth';
import { checkRole } from '../middlewares/rbac';

const router = Router();

router.use(authMiddleware);

// Attendance
router.post('/attendance', checkRole(['LECTURER', 'ADMIN']), markAttendance);
router.get('/attendance/:courseId', getAttendanceByCourse);

// Test Scores
router.post('/scores', checkRole(['LECTURER', 'ADMIN']), addTestScore);
router.get('/scores/student/:studentId', getScoresByStudent);

// Announcements
router.post('/announcements', checkRole(['LECTURER', 'ADMIN']), createAnnouncement);
router.get('/announcements', getAnnouncements);

// Analytics
router.get('/analytics/student/:studentId', getStudentPerformanceAnalytics);

// Projects
router.post('/projects', checkRole(['STUDENT']), submitProject);

export default router;
