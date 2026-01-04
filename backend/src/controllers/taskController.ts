import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/taskService';
import { AuthRequest, ApiResponse, CreateTaskData, UpdateTaskData, Priority } from '../types';

export class TaskController {
  static async createTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data: CreateTaskData = req.body;

      const task = await TaskService.createTask(userId, data);

      const response: ApiResponse<typeof task> = {
        success: true,
        data: task,
        message: 'Task created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getTasks(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const {
        page,
        limit,
        sortBy,
        sortOrder,
        completed,
        priority,
        date,
      } = req.query;

      const options = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
        completed: completed === 'true' ? true : completed === 'false' ? false : undefined,
        priority: priority === 'HIGH' || priority === 'MEDIUM' || priority === 'LOW' ? priority as Priority : undefined,
        date: date as string,
      };

      const result = await TaskService.getTasks(userId, options);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getTaskById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      if (!id) {
        return next(new Error('Task ID is required'));
      }

      const taskId = parseInt(id);

      const task = await TaskService.getTaskById(userId, taskId);

      const response: ApiResponse<typeof task> = {
        success: true,
        data: task,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      if (!id) {
        return next(new Error('Task ID is required'));
      }

      const taskId = parseInt(id);
      const data: UpdateTaskData = req.body;

      const task = await TaskService.updateTask(userId, taskId, data);

      const response: ApiResponse<typeof task> = {
        success: true,
        data: task,
        message: 'Task updated successfully',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      if (!id) {
        return next(new Error('Task ID is required'));
      }

      const taskId = parseInt(id);

      await TaskService.deleteTask(userId, taskId);

      const response: ApiResponse = {
        success: true,
        message: 'Task deleted successfully',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async toggleTaskCompletion(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      if (!id) {
        return next(new Error('Task ID is required'));
      }

      const taskId = parseInt(id);

      const task = await TaskService.toggleTaskCompletion(userId, taskId);

      const response: ApiResponse<typeof task> = {
        success: true,
        data: task,
        message: 'Task completion status updated',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getTasksByDate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { date } = req.params;

      if (!date) {
        return next(new Error('Date parameter is required'));
      }

      const tasks = await TaskService.getTasksByDate(userId, date);

      const response: ApiResponse<typeof tasks> = {
        success: true,
        data: tasks,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
