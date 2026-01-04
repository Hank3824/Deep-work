import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/projectService';
import { AuthRequest, ApiResponse, CreateProjectData, UpdateProjectData } from '../types';

export class ProjectController {
  static async createProject(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data: CreateProjectData = req.body;

      const project = await ProjectService.createProject(userId, data);

      const response: ApiResponse<typeof project> = {
        success: true,
        data: project,
        message: 'Project created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getProjects(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      const projects = await ProjectService.getProjects(userId);

      const response: ApiResponse<typeof projects> = {
        success: true,
        data: projects,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      if (!id) {
        return next(new Error('Project ID is required'));
      }

      const projectId = parseInt(id);

      const project = await ProjectService.getProjectById(userId, projectId);

      const response: ApiResponse<typeof project> = {
        success: true,
        data: project,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateProject(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      if (!id) {
        return next(new Error('Project ID is required'));
      }

      const projectId = parseInt(id);
      const data: UpdateProjectData = req.body;

      const project = await ProjectService.updateProject(userId, projectId, data);

      const response: ApiResponse<typeof project> = {
        success: true,
        data: project,
        message: 'Project updated successfully',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProject(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      if (!id) {
        return next(new Error('Project ID is required'));
      }

      const projectId = parseInt(id);

      await ProjectService.deleteProject(userId, projectId);

      const response: ApiResponse = {
        success: true,
        message: 'Project deleted successfully',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      if (!id) {
        return next(new Error('Project ID is required'));
      }

      const projectId = parseInt(id);

      const stats = await ProjectService.getProjectStats(userId, projectId);

      const response: ApiResponse<typeof stats> = {
        success: true,
        data: stats,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
