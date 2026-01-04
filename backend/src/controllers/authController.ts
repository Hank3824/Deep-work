import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { AuthRequest, ApiResponse, RegisterData, LoginData } from '../types';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: RegisterData = req.body;
      const user = await AuthService.register(data);

      const response: ApiResponse<{ user: typeof user }> = {
        success: true,
        data: { user },
        message: 'User registered successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: LoginData = req.body;
      const { user, tokens } = await AuthService.login(data);

      const response: ApiResponse<{ user: typeof user; tokens: typeof tokens }> = {
        success: true,
        data: { user, tokens },
        message: 'Login successful',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return next(new Error('Refresh token required'));
      }

      const tokens = await AuthService.refreshToken(refreshToken);

      const response: ApiResponse<typeof tokens> = {
        success: true,
        data: tokens,
        message: 'Token refreshed successfully',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.id) {
        return next(new Error('User not authenticated'));
      }

      const user = await AuthService.getUserById(req.user.id);

      if (!user) {
        return next(new Error('User not found'));
      }

      const response: ApiResponse<{ user: typeof user }> = {
        success: true,
        data: { user },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
