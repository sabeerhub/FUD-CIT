import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

// Courses
export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await prisma.course.create({ data: req.body });
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

export const getCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { level, semester } = req.query;
    const courses = await prisma.course.findMany({
      where: {
        ...(level && { level: level as string }),
        ...(semester && { semester: parseInt(semester as string) }),
      },
      include: { lecturer: { include: { user: true } } },
    });
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

// Course Materials
export const uploadMaterial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const material = await prisma.courseMaterial.create({ data: req.body });
    res.status(201).json(material);
  } catch (error) {
    next(error);
  }
};

export const getMaterialsByCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const materials = await prisma.courseMaterial.findMany({
      where: { courseId: courseId as string },
    });
    res.json(materials);
  } catch (error) {
    next(error);
  }
};

// Timetable
export const createTimetableEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const entry = await prisma.timetable.create({ data: req.body });
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
};

export const getTimetable = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { level } = req.query;
    const timetable = await prisma.timetable.findMany({
      where: {
        course: { level: level as string }
      },
      include: { course: true },
    });
    res.json(timetable);
  } catch (error) {
    next(error);
  }
};
