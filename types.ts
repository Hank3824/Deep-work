
export enum Priority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: Priority;
  completed: boolean;
  scheduledDate?: string;
  scheduledTime?: string; // e.g., "09:00"
  duration?: number; // in minutes
  category?: string;
  tags: string; // JSON string of tags array
  createdAt: string;
  updatedAt: string;
  // New fields for timeline scheduling
  isScheduled?: boolean; // 是否已安排到时间轴
  scheduledHour?: number; // 在时间轴上的小时位置 (0-23)
  scheduledDuration?: number; // 在时间轴上显示的持续时间（小时）
}

export interface User {
  id: number;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface MoodOption {
  emoji: string;
  label: string;
}

export const MOODS: MoodOption[] = [
  { emoji: '☀️', label: 'Energetic' },
  { emoji: '😊', label: 'Happy' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '🌧️', label: 'Low' },
];
