import { prisma } from '../config/prisma';
import { MoodEntry, CreateMoodData, AppError } from '../types';

export class MoodService {
  static async createMoodEntry(userId: number, data: CreateMoodData): Promise<MoodEntry> {
    const { date, ...moodData } = data;

    // Check if entry already exists for this date
    const existingEntry = await prisma.moodEntry.findFirst({
      where: {
        userId,
        date: new Date(date),
      },
    });

    if (existingEntry) {
      throw new AppError('Mood entry already exists for this date', 409);
    }

    return prisma.moodEntry.create({
      data: {
        ...moodData,
        userId,
        date: new Date(date),
      },
    });
  }

  static async getMoodEntries(
    userId: number,
    limit?: number
  ): Promise<MoodEntry[]> {
    return prisma.moodEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: limit,
    });
  }

  static async getMoodEntryByDate(userId: number, date: string): Promise<MoodEntry | null> {
    return prisma.moodEntry.findFirst({
      where: {
        userId,
        date: new Date(date),
      },
    });
  }

  static async updateMoodEntry(
    userId: number,
    date: string,
    data: Partial<CreateMoodData>
  ): Promise<MoodEntry> {
    const existingEntry = await this.getMoodEntryByDate(userId, date);
    if (!existingEntry) {
      throw new AppError('Mood entry not found for this date', 404);
    }

    return prisma.moodEntry.update({
      where: { id: existingEntry.id },
      data,
    });
  }

  static async deleteMoodEntry(userId: number, date: string): Promise<void> {
    const existingEntry = await this.getMoodEntryByDate(userId, date);
    if (!existingEntry) {
      throw new AppError('Mood entry not found for this date', 404);
    }

    await prisma.moodEntry.delete({
      where: { id: existingEntry.id },
    });
  }

  static async getMoodStreak(userId: number): Promise<number> {
    const entries = await prisma.moodEntry.findMany({
      where: { userId },
      select: { date: true },
      orderBy: { date: 'desc' },
    });

    if (entries.length === 0) return 0;

    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let lastDate = entries[0].date;
    lastDate.setHours(0, 0, 0, 0);

    // Check if streak continues to today or yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastDate.getTime() !== today.getTime() && lastDate.getTime() !== yesterday.getTime()) {
      return 0; // Streak broken
    }

    // Count consecutive days
    for (let i = 1; i < entries.length; i++) {
      const currentDate = new Date(entries[i].date);
      currentDate.setHours(0, 0, 0, 0);

      const prevDate = new Date(entries[i - 1].date);
      prevDate.setHours(0, 0, 0, 0);

      const diffTime = prevDate.getTime() - currentDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  static async getMoodStats(
    userId: number,
    period: { startDate?: string; endDate?: string }
  ): Promise<Array<{ mood: string; count: number; percentage: number }>> {
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

    const entries = await prisma.moodEntry.groupBy({
      by: ['mood'],
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        mood: true,
      },
    });

    const total = entries.reduce((sum: number, entry: any) => sum + entry._count.mood, 0);

    return entries.map((entry: any) => ({
      mood: entry.mood,
      count: entry._count.mood,
      percentage: total > 0 ? (entry._count.mood / total) * 100 : 0,
    }));
  }
}
