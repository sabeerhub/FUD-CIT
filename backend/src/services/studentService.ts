import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma.js';

class StudentService {
  async getPerformance(studentId: string) {
    const [scores, attendance, submissions] = await Promise.all([
      prisma.testScore.findMany({ where: { studentId } }),
      prisma.attendance.findMany({ where: { studentId } }),
      prisma.submission.findMany({ where: { studentId } })
    ]);

    const avgScore = scores.length > 0 ? scores.reduce((acc, s) => acc + (s.score / s.maxScore), 0) / scores.length * 100 : 0;
    const attRate = attendance.length > 0 ? (attendance.filter(a => a.status === 'PRESENT').length / attendance.length) * 100 : 0;

    // Academic Productivity Formula
    const productivity = (avgScore * 0.6) + (attRate * 0.4);

    return {
      averageScore: avgScore.toFixed(1),
      attendanceRate: attRate.toFixed(1),
      totalSubmissions: submissions.length,
      productivityScore: productivity.toFixed(1)
    };
  }
}

export default new StudentService();
