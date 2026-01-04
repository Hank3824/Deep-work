import { Request } from 'express';

// Database model types (matching Prisma schema)
export interface User {
  id: number;
  email: string;
  passwordHash: string;
  name?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: number;
  userId: number;
  title: string;
  description?: string;
  priority: Priority;
  completed: boolean;
  scheduledDate?: Date;
  scheduledTime?: string;
  duration?: number;
  category?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: number;
  userId: number;
  name: string;
  color?: string;
  description?: string;
  createdAt: Date;
}

export interface MoodEntry {
  id: number;
  userId: number;
  mood: string;
  emoji?: string;
  note?: string;
  date: Date;
  createdAt: Date;
}

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination types
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Task types
export type TaskPriority = Priority;

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: TaskPriority;
  scheduledDate?: string;
  scheduledTime?: string;
  duration?: number;
  category?: string;
  tags?: string[];
  projectIds?: number[];
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  completed?: boolean;
}

export interface TaskWithProjects extends Task {
  projects: Project[];
}

// Project types
export interface CreateProjectData {
  name: string;
  color?: string;
  description?: string;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

// Auth types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
}

// Mood types
export interface CreateMoodData {
  mood: string;
  emoji?: string;
  note?: string;
  date: string;
}

// Analytics types
export interface ProductivityStats {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  averageTasksPerDay: number;
}

export interface TimeStats {
  totalScheduledTime: number;
  totalCompletedTime: number;
  averageSessionLength: number;
}

export interface AnalyticsPeriod {
  startDate: string;
  endDate: string;
}

// Timeline types
export interface TimelineSlot {
  time: string;
  tasks: TaskWithProjects[];
}

export interface TimelineData {
  date: string;
  slots: TimelineSlot[];
}

// Error types
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}
