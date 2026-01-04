import { prisma } from '../config/prisma';
import { Project, CreateProjectData, UpdateProjectData, AppError } from '../types';

export class ProjectService {
  static async createProject(userId: number, data: CreateProjectData): Promise<Project> {
    return prisma.project.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  static async getProjects(userId: number): Promise<Project[]> {
    return prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getProjectById(userId: number, projectId: number): Promise<Project> {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    return project;
  }

  static async updateProject(
    userId: number,
    projectId: number,
    data: UpdateProjectData
  ): Promise<Project> {
    // First check if project exists and belongs to user
    await this.getProjectById(userId, projectId);

    return prisma.project.update({
      where: { id: projectId },
      data,
    });
  }

  static async deleteProject(userId: number, projectId: number): Promise<void> {
    // First check if project exists and belongs to user
    await this.getProjectById(userId, projectId);

    await prisma.project.delete({
      where: { id: projectId },
    });
  }

  static async getProjectStats(userId: number, projectId: number): Promise<{
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
  }> {
    await this.getProjectById(userId, projectId);

    const [totalTasks, completedTasks] = await Promise.all([
      prisma.task.count({
        where: {
          userId,
          projects: {
            some: {
              projectId,
            },
          },
        },
      }),
      prisma.task.count({
        where: {
          userId,
          completed: true,
          projects: {
            some: {
              projectId,
            },
          },
        },
      }),
    ]);

    return {
      totalTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    };
  }
}
