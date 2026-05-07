import { Router } from 'express';
import {
  createAssignment, getAssignmentsByCourse,
  submitAssignment, gradeSubmission, getSubmissionsByAssignment
} from '../controllers/assignmentController';
import { authMiddleware } from '../middlewares/auth';
import { checkRole } from '../middlewares/rbac';

const router = Router();

router.use(authMiddleware);

// Assignments
router.post('/', checkRole(['LECTURER', 'ADMIN']), createAssignment);
router.get('/course/:courseId', getAssignmentsByCourse);

// Submissions
router.post('/submit', checkRole(['STUDENT']), submitAssignment);
router.get('/:assignmentId/submissions', checkRole(['LECTURER', 'ADMIN']), getSubmissionsByAssignment);

// Grading
router.patch('/grade/:submissionId', checkRole(['LECTURER', 'ADMIN']), gradeSubmission);

export default router;
