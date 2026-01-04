import { Request, Response, NextFunction } from 'express';
import { MoodService } from '../services/moodService';
import { AuthRequest, ApiResponse, CreateMoodData } from '../types';

export class MoodController {
  static async createMoodEntry(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data: CreateMoodData = req.body;

      const moodEntry = await MoodService.createMoodEntry(userId, data);

      const response: ApiResponse<typeof moodEntry> = {
        success: true,
        data: moodEntry,
        message: 'Mood entry created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getMoodEntries(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      const entries = await MoodService.getMoodEntries(userId, limit);

      const response: ApiResponse<typeof entries> = {
        success: true,
        data: entries,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getMoodEntryByDate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { date } = req.params;

      if (!date) {
        return next(new Error('Date parameter is required'));
      }

      const entry = await MoodService.getMoodEntryByDate(userId, date);

      const response: ApiResponse<typeof entry> = {
        success: true,
        data: entry,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateMoodEntry(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { date } = req.params;

      if (!date) {
        return next(new Error('Date parameter is required'));
      }

      const data = req.body;

      const entry = await MoodService.updateMoodEntry(userId, date, data);

      const response: ApiResponse<typeof entry> = {
        success: true,
        data: entry,
        message: 'Mood entry updated successfully',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async deleteMoodEntry(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { date } = req.params;

      if (!date) {
        return next(new Error('Date parameter is required'));
      }

      await MoodService.deleteMoodEntry(userId, date);

      const response: ApiResponse = {
        success: true,
        message: 'Mood entry deleted successfully',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getMoodStreak(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      const streak = await MoodService.getMoodStreak(userId);

      const response: ApiResponse<{ streak: number }> = {
        success: true,
        data: { streak },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getMoodStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const period = req.query;

      const stats = await MoodService.getMoodStats(userId, period);

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
