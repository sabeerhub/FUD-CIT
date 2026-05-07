import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

// Attendance
export const markAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attendance = await prisma.attendance.create({ data: req.body });
    res.status(201).json(attendance);
  } catch (error) {
    next(error);
  }
};

export const getAttendanceByCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const attendance = await prisma.attendance.findMany({
      where: { courseId: courseId as string },
      include: { student: { include: { user: true } } }
    });
    res.json(attendance);
  } catch (error) {
    next(error);
  }
};

// Test Scores
export const addTestScore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const score = await prisma.testScore.create({ data: req.body });
    res.status(201).json(score);
  } catch (error) {
    next(error);
  }
};

export const getScoresByStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;
    const scores = await prisma.testScore.findMany({
      where: { studentId: studentId as string },
      include: { course: true }
    });
    res.json(scores);
  } catch (error) {
    next(error);
  }
};

// Announcements
export const createAnnouncement = async (req: any, res: Response, next: NextFunction) => {
  try {
    const lecturer = await prisma.lecturer.findUnique({ where: { userId: req.user.id } });
    if (!lecturer) return res.status(403).json({ message: 'Forbidden' });

    const announcement = await prisma.announcement.create({
      data: { ...req.body, lecturerId: lecturer.id }
    });
    res.status(201).json(announcement);
  } catch (error) {
    next(error);
  }
};

export const getAnnouncements = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { level } = req.query;
    const announcements = await prisma.announcement.findMany({
      where: {
        OR: [
          { targetLevel: null },
          { targetLevel: level as string }
        ]
      },
      include: { lecturer: { include: { user: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(announcements);
  } catch (error) {
    next(error);
  }
};

// Analytics (Simple implementation)
export const getStudentPerformanceAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;
    const sId = studentId as string;
    const scores = await prisma.testScore.findMany({ where: { studentId: sId } });
    const attendance = await prisma.attendance.findMany({ where: { studentId: sId } });
    const submissions = await prisma.submission.findMany({ where: { studentId: sId } });

    // Calculate averages, completion rates, etc.
    const averageScore = scores.length > 0 ? scores.reduce((acc: number, s: any) => acc + (s.score / s.maxScore), 0) / scores.length * 100 : 0;
    const attendanceRate = attendance.length > 0 ? (attendance.filter((a: any) => a.status === 'PRESENT').length / attendance.length) * 100 : 0;

    res.json({
      averageScore,
      attendanceRate,
      totalSubmissions: submissions.length,
      productivityScore: (averageScore + attendanceRate) / 2 // Mock productivity score
    });
  } catch (error) {
    next(error);
  }
};

// Projects
export const submitProject = async (req: any, res: Response, next: NextFunction) => {
  try {
    const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
    if (!student) return res.status(403).json({ message: 'Forbidden' });

    const project = await prisma.project.create({
      data: { ...req.body, studentId: student.id }
    });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};
