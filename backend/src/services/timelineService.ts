import { TaskService } from './taskService';
import { TaskWithProjects, TimelineData, TimelineSlot } from '../types';

export class TimelineService {
  static async getTimelineData(userId: number, date: string): Promise<TimelineData> {
    // Get all tasks for the date
    const tasks = await TaskService.getTasksByDate(userId, date);

    // Create time slots from 6:00 to 24:00
    const slots: TimelineSlot[] = [];
    for (let hour = 6; hour < 24; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      slots.push({
        time,
        tasks: [],
      });
    }

    // Group tasks by scheduled time
    const tasksByTime = new Map<string, TaskWithProjects[]>();

    tasks.forEach((task: any) => {
      if (task.scheduledTime) {
        const hour = task.scheduledTime.split(':')[0];
        const timeSlot = `${hour.padStart(2, '0')}:00`;

        if (!tasksByTime.has(timeSlot)) {
          tasksByTime.set(timeSlot, []);
        }
        tasksByTime.get(timeSlot)!.push(task);
      }
    });

    // Populate slots with tasks
    slots.forEach(slot => {
      const tasksForSlot = tasksByTime.get(slot.time) || [];
      slot.tasks = tasksForSlot.sort((a, b) => {
        if (a.scheduledTime && b.scheduledTime) {
          return a.scheduledTime.localeCompare(b.scheduledTime);
        }
        return 0;
      });
    });

    return {
      date,
      slots,
    };
  }

  static async checkTimeConflicts(
    userId: number,
    date: string,
    newTaskTime: string,
    newTaskDuration: number,
    excludeTaskId?: number
  ): Promise<boolean> {
    const tasks = await TaskService.getTasksByDate(userId, date);

    const newStart = this.timeToMinutes(newTaskTime);
    const newEnd = newStart + newTaskDuration;

    return tasks.some((task: any) => {
      if (excludeTaskId && task.id === excludeTaskId) {
        return false;
      }

      if (!task.scheduledTime || !task.duration) {
        return false;
      }

      const existingStart = this.timeToMinutes(task.scheduledTime);
      const existingEnd = existingStart + task.duration;

      return !(newEnd <= existingStart || newStart >= existingEnd);
    });
  }

  static async getAvailableTimeSlots(
    userId: number,
    date: string,
    duration: number
  ): Promise<string[]> {
    const timelineData = await this.getTimelineData(userId, date as string);
    const availableSlots: string[] = [];

    timelineData.slots.forEach((slot: any) => {
      const slotHour = parseInt(slot.time.split(':')[0]);

      // Check every 30 minutes within the hour
      for (let minutes = 0; minutes < 60; minutes += 30) {
        const timeString = `${slotHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        const hasConflict = this.checkTimeConflicts(userId, date as string, timeString, duration, undefined);

        if (!hasConflict) {
          availableSlots.push(timeString);
        }
      }
    });

    return availableSlots;
  }

  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours || 0) * 60 + (minutes || 0);
  }
}
