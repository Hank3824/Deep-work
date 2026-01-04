import { Request, Response, NextFunction } from 'express';
import { TimelineService } from '../services/timelineService';
import { AuthRequest, ApiResponse } from '../types';

export class TimelineController {
  static async getTimeline(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { date } = req.params;

      if (!date) {
        return next(new Error('Date parameter is required'));
      }

      const timelineData = await TimelineService.getTimelineData(userId, date);

      const response: ApiResponse<typeof timelineData> = {
        success: true,
        data: timelineData,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async checkTimeConflicts(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { date, time, duration, excludeTaskId } = req.query;

      if (!date || !time || !duration) {
        return next(new Error('Date, time, and duration are required'));
      }

      const hasConflict = await TimelineService.checkTimeConflicts(
        userId,
        date as string,
        time as string,
        parseInt(duration as string),
        excludeTaskId ? parseInt(excludeTaskId as string) : undefined
      );

      const response: ApiResponse<{ hasConflict: boolean }> = {
        success: true,
        data: { hasConflict },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getAvailableSlots(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { date, duration } = req.query;

      if (!date || !duration) {
        return next(new Error('Date and duration are required'));
      }

      const slots = await TimelineService.getAvailableTimeSlots(
        userId,
        date as string,
        parseInt(duration as string)
      );

      const response: ApiResponse<typeof slots> = {
        success: true,
        data: slots,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
