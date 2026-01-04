import { prisma } from '../config/prisma';
import {
  Task,
  Priority,
  CreateTaskData,
  UpdateTaskData,
  TaskWithProjects,
  PaginationOptions,
  PaginatedResponse,
  AppError
} from '../types';

export class TaskService {
  static async createTask(userId: number, data: CreateTaskData): Promise<TaskWithProjects> {
    const { projectIds, ...taskData } = data;

    const task = await prisma.task.create({
      data: {
        ...taskData,
        userId,
        scheduledDate: taskData.scheduledDate ? new Date(taskData.scheduledDate) : null,
        projects: projectIds ? {
          create: projectIds.map(projectId => ({
            projectId,
          })),
        } : undefined,
      },
      include: {
        projects: {
          include: {
            project: true,
          },
        },
      },
    });

    return this.formatTaskWithProjects(task);
  }

  static async getTasks(
    userId: number,
    options: PaginationOptions & { completed?: boolean | undefined; priority?: Priority | undefined; date?: string | undefined }
  ): Promise<PaginatedResponse<TaskWithProjects>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      completed,
      priority,
      date,
    } = options;

    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (completed !== undefined) {
      where.completed = completed;
    }

    if (priority) {
      where.priority = priority;
    }

    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      where.scheduledDate = {
        gte: targetDate,
        lt: nextDay,
      };
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          projects: {
            include: {
              project: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.task.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: tasks.map(this.formatTaskWithProjects),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  static async getTaskById(userId: number, taskId: number): Promise<TaskWithProjects> {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
      include: {
        projects: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    return this.formatTaskWithProjects(task);
  }

  static async updateTask(
    userId: number,
    taskId: number,
    data: UpdateTaskData
  ): Promise<TaskWithProjects> {
    const { projectIds, ...updateData } = data;

    // First check if task exists and belongs to user
    await this.getTaskById(userId, taskId);

    // Update task
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...updateData,
        scheduledDate: updateData.scheduledDate ? new Date(updateData.scheduledDate) : undefined,
        ...(projectIds && {
          projects: {
            deleteMany: {},
            create: projectIds.map(projectId => ({
              projectId,
            })),
          },
        }),
      },
      include: {
        projects: {
          include: {
            project: true,
          },
        },
      },
    });

    return this.formatTaskWithProjects(task);
  }

  static async deleteTask(userId: number, taskId: number): Promise<void> {
    // First check if task exists and belongs to user
    await this.getTaskById(userId, taskId);

    await prisma.task.delete({
      where: { id: taskId },
    });
  }

  static async toggleTaskCompletion(userId: number, taskId: number): Promise<TaskWithProjects> {
    const task = await this.getTaskById(userId, taskId);

    return this.updateTask(userId, taskId, {
      completed: !(task as any).completed,
    });
  }

  static async getTasksByDate(userId: number, date: string): Promise<TaskWithProjects[]> {
    const targetDate = new Date(date);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        scheduledDate: {
          gte: targetDate,
          lt: nextDay,
        },
      },
      include: {
        projects: {
          include: {
            project: true,
          },
        },
      },
      orderBy: {
        scheduledTime: 'asc',
      },
    });

    return tasks.map(this.formatTaskWithProjects);
  }

  private static formatTaskWithProjects(task: any): TaskWithProjects {
    return {
      ...task,
      projects: task.projects.map((tp: any) => tp.project),
    };
  }
}
