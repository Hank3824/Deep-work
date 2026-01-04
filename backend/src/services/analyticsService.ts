import { prisma } from '../config/prisma';
import { ProductivityStats, TimeStats, AnalyticsPeriod, AppError } from '../types';

export class AnalyticsService {
  static async getProductivityStats(
    userId: number,
    period: AnalyticsPeriod
  ): Promise<ProductivityStats> {
    const { startDate, endDate } = this.parsePeriod(period);

    const [totalTasks, completedTasks] = await Promise.all([
      prisma.task.count({
        where: {
          userId,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      prisma.task.count({
        where: {
          userId,
          completed: true,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
    ]);

    const daysDiff = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const averageTasksPerDay = totalTasks / daysDiff;

    return {
      totalTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      averageTasksPerDay,
    };
  }

  static async getTimeStats(
    userId: number,
    period: AnalyticsPeriod
  ): Promise<TimeStats> {
    const { startDate, endDate } = this.parsePeriod(period);

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        scheduledDate: {
          gte: startDate,
          lte: endDate,
        },
        duration: {
          not: null,
        },
      },
      select: {
        duration: true,
        completed: true,
      },
    });

    const totalScheduledTime = tasks.reduce((sum: number, task: any) => sum + (task.duration || 0), 0);
    const completedTasks = tasks.filter((task: any) => task.completed);
    const totalCompletedTime = completedTasks.reduce((sum: number, task: any) => sum + (task.duration || 0), 0);

    const averageSessionLength = completedTasks.length > 0
      ? totalCompletedTime / completedTasks.length
      : 0;

    return {
      totalScheduledTime,
      totalCompletedTime,
      averageSessionLength,
    };
  }

  static async getTaskCompletionTrend(
    userId: number,
    period: AnalyticsPeriod
  ): Promise<Array<{ date: string; completed: number; total: number }>> {
    const { startDate, endDate } = this.parsePeriod(period);

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
        completed: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group by date
    const dailyStats = new Map<string, { completed: number; total: number }>();

    tasks.forEach((task: any) => {
      const date = task.createdAt.toISOString().split('T')[0];

      if (!dailyStats.has(date)) {
        dailyStats.set(date, { completed: 0, total: 0 });
      }

      const stats = dailyStats.get(date)!;
      stats.total++;
      if (task.completed) {
        stats.completed++;
      }
    });

    return Array.from(dailyStats.entries()).map(([date, stats]) => ({
      date,
      completed: stats.completed,
      total: stats.total,
    }));
  }

  static async getPriorityDistribution(
    userId: number,
    period: AnalyticsPeriod
  ): Promise<Array<{ priority: string; count: number; completed: number }>> {
    const { startDate, endDate } = this.parsePeriod(period);

    const tasks = await prisma.task.groupBy({
      by: ['priority'],
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        priority: true,
      },
    });

    const completedTasks = await prisma.task.groupBy({
      by: ['priority'],
      where: {
        userId,
        completed: true,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        priority: true,
      },
    });

    const completedMap = new Map(
      completedTasks.map((item: any) => [item.priority, item._count.priority])
    );

    return tasks.map((task: any) => ({
      priority: task.priority,
      count: task._count.priority,
      completed: completedMap.get(task.priority) || 0,
    }));
  }

  static async getMoodCorrelation(
    userId: number,
    period: AnalyticsPeriod
  ): Promise<Array<{ mood: string; avgProductivity: number; taskCount: number }>> {
    const { startDate, endDate } = this.parsePeriod(period);

    // Get mood entries with corresponding task completion rates
    const moodEntries = await prisma.moodEntry.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        mood: true,
        date: true,
      },
    });

    const correlations: Array<{ mood: string; avgProductivity: number; taskCount: number }> = [];

    // Group by mood and calculate average productivity
    const moodGroups = new Map<string, Array<{ date: Date; productivity: number }>>();

    for (const entry of moodEntries) {
      const dayStart = new Date(entry.date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(entry.date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayTasks = await prisma.task.findMany({
        where: {
          userId,
          createdAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
        select: {
          completed: true,
        },
      });

      const totalTasks = dayTasks.length;
      const completedTasksCount = dayTasks.filter((t: any) => t.completed).length;
      const productivity = totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0;

      if (!moodGroups.has(entry.mood)) {
        moodGroups.set(entry.mood, []);
      }

      moodGroups.get(entry.mood)!.push({
        date: entry.date,
        productivity,
      });
    }

    for (const [mood, entries] of moodGroups) {
      const avgProductivity = entries.reduce((sum, entry) => sum + entry.productivity, 0) / entries.length;
      correlations.push({
        mood,
        avgProductivity,
        taskCount: entries.length,
      });
    }

    return correlations;
  }

  private static parsePeriod(period: AnalyticsPeriod): { startDate: Date; endDate: Date } {
    let startDate: Date;
    let endDate: Date;

    if (period.startDate && period.endDate) {
      startDate = new Date(period.startDate);
      endDate = new Date(period.endDate);
    } else {
      // Default to last 30 days
      endDate = new Date();
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
    }

    return { startDate, endDate };
  }
}
