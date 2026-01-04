// API service for ScholarFlow frontend
const API_BASE_URL = 'http://localhost:8002/api';

// Types
import { User } from '../types';
export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  completed: boolean;
  scheduledDate?: string;
  scheduledTime?: string;
  duration?: number;
  category?: string;
  tags: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  scheduledDate?: string;
  scheduledTime?: string;
  duration?: number;
  category?: string;
  tags?: string[];
  projectIds?: number[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  completed?: boolean;
  scheduledDate?: string;
  scheduledTime?: string;
  duration?: number;
  category?: string;
  tags?: string[];
  projectIds?: number[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    name?: string;
    avatarUrl?: string;
  };
  accessToken: string;
  refreshToken: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Try to load token from localStorage
    this.token = localStorage.getItem('accessToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (this.token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${this.token}`,
      };
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} ${error}`);
    }

    return response.json();
  }

  // Authentication methods
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    this.token = response.accessToken;
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    this.token = response.accessToken;
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response;
  }

  async logout(): Promise<void> {
    this.token = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  async getCurrentUser(): Promise<{ user: User }> {
    return this.request('/auth/me');
  }

  // Task methods
  async getTasks(params?: {
    page?: number;
    limit?: number;
    completed?: boolean;
    priority?: string;
  }): Promise<{ tasks: Task[]; total: number; page: number; limit: number }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.completed !== undefined) queryParams.append('completed', params.completed.toString());
    if (params?.priority) queryParams.append('priority', params.priority);

    const queryString = queryParams.toString();
    const endpoint = `/tasks${queryString ? `?${queryString}` : ''}`;

    return this.request(endpoint);
  }

  async createTask(data: CreateTaskData): Promise<Task> {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: number, data: UpdateTaskData): Promise<Task> {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: number): Promise<void> {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleTaskCompletion(id: number): Promise<Task> {
    return this.request(`/tasks/${id}/complete`, {
      method: 'PATCH',
    });
  }

  async getTasksByDate(date: string): Promise<Task[]> {
    return this.request(`/tasks/calendar/${date}`);
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('accessToken', token);
  }
}

// Export singleton instance
export const apiService = new ApiService(API_BASE_URL);
export default apiService;
