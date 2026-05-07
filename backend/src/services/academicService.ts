import prisma from '../config/prisma.js';

class AcademicService {
  async getCourses(filters: any) {
    return prisma.course.findMany({
      where: filters,
      include: {
        lecturer: { include: { user: true } },
        _count: { select: { materials: true, assignments: true } }
      }
    });
  }

  async createAssignment(data: any) {
    return prisma.assignment.create({
      data,
      include: { course: true }
    });
  }
}

export default new AcademicService();
