import { Request, Response, NextFunction } from 'express';
import studentService from '../services/studentService.js';

export const getStudentPerformanceAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;
    const analytics = await studentService.getPerformance(studentId as string);
    res.json(analytics);
  } catch (error) {
    next(error);
  }
};
