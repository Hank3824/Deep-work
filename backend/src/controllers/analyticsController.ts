import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analyticsService';
import { AuthRequest, ApiResponse, AnalyticsPeriod } from '../types';

export class AnalyticsController {
  static async getProductivityStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const period: AnalyticsPeriod = req.query as any;

      const stats = await AnalyticsService.getProductivityStats(userId, period);

      const response: ApiResponse<typeof stats> = {
        success: true,
        data: stats,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getTimeStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const period: AnalyticsPeriod = req.query as any;

      const stats = await AnalyticsService.getTimeStats(userId, period);

      const response: ApiResponse<typeof stats> = {
        success: true,
        data: stats,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getTaskCompletionTrend(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const period: AnalyticsPeriod = req.query as any;

      const trend = await AnalyticsService.getTaskCompletionTrend(userId, period);

      const response: ApiResponse<typeof trend> = {
        success: true,
        data: trend,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getPriorityDistribution(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const period: AnalyticsPeriod = req.query as any;

      const distribution = await AnalyticsService.getPriorityDistribution(userId, period);

      const response: ApiResponse<typeof distribution> = {
        success: true,
        data: distribution,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getMoodCorrelation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const period: AnalyticsPeriod = req.query as any;

      const correlation = await AnalyticsService.getMoodCorrelation(userId, period);

      const response: ApiResponse<typeof correlation> = {
        success: true,
        data: correlation,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
