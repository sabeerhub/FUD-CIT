import { Router } from 'express';
import {
  createCourse, getCourses,
  uploadMaterial, getMaterialsByCourse,
  createTimetableEntry, getTimetable
} from '../controllers/academicController';
import { authMiddleware } from '../middlewares/auth';
import { checkRole } from '../middlewares/rbac';

const router = Router();

router.use(authMiddleware);

// Courses
router.get('/courses', getCourses);
router.post('/courses', checkRole(['ADMIN']), createCourse);

// Materials
router.get('/courses/:courseId/materials', getMaterialsByCourse);
router.post('/materials', checkRole(['LECTURER', 'ADMIN']), uploadMaterial);

// Timetable
router.get('/timetable', getTimetable);
router.post('/timetable', checkRole(['ADMIN']), createTimetableEntry);

export default router;
