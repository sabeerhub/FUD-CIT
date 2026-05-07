import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

// Assignments
export const createAssignment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assignment = await prisma.assignment.create({ data: req.body });
    res.status(201).json(assignment);
  } catch (error) {
    next(error);
  }
};

export const getAssignmentsByCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const assignments = await prisma.assignment.findMany({
      where: { courseId: courseId as string },
      include: { submissions: true },
    });
    res.json(assignments);
  } catch (error) {
    next(error);
  }
};

// Submissions
export const submitAssignment = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { assignmentId, fileUrl, remarks } = req.body;

    // Get student profile
    const student = await prisma.student.findUnique({
      where: { userId: req.user.id }
    });

    if (!student) {
      return res.status(403).json({ message: 'Only students can submit assignments' });
    }

    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        studentId: student.id,
        fileUrl,
        remarks
      }
    });
    res.status(201).json(submission);
  } catch (error) {
    next(error);
  }
};

// Grading
export const gradeSubmission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { submissionId } = req.params;
    const { score, remarks } = req.body;

    const submission = await prisma.submission.update({
      where: { id: submissionId as string },
      data: { score, remarks }
    });
    res.json(submission);
  } catch (error) {
    next(error);
  }
};

export const getSubmissionsByAssignment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await prisma.submission.findMany({
      where: { assignmentId: assignmentId as string },
      include: { student: { include: { user: true } } }
    });
    res.json(submissions);
  } catch (error) {
    next(error);
  }
};
