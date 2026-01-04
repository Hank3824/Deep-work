
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import Timeline from './components/Timeline';
import TaskList from './components/TaskList';
import { Task, Priority } from './types';

// Main App component with DndProvider
const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timelineTasks, setTimelineTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Hold splash screen for 3.5 seconds before triggering exit animation
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const toggleComplete = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    setTimelineTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (title: string, priority: Priority) => {
    const newTask: Task = {
      id: Date.now(),
      title,
      priority,
      completed: false,
      tags: '[]',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const scheduleTask = (id: number, time: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, scheduledTime: time } : t));
  };

  // Delete task from tasklist
  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Delete task from timeline
  const deleteFromTimeline = (id: number) => {
    setTimelineTasks(prev => prev.filter(t => t.id !== id));
  };


  // Handle dropping task from tasklist to timeline
  const handleDropToTimeline = (taskId: number, hour: number) => {
    // Find the task in the tasks array
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      console.error('Task not found:', taskId);
      return;
    }

    // Create a scheduled version of the task
    const scheduledTask: Task = {
      ...task,
      isScheduled: true,
      scheduledHour: hour,
      scheduledDuration: 1, // Default 1 hour
      scheduledTime: `${hour.toString().padStart(2, '0')}:00`,
    };

    // Update timeline tasks state
    setTimelineTasks(prevTimelineTasks => {
      // Remove any existing task with same ID to avoid duplicates
      const filtered = prevTimelineTasks.filter(t => t.id !== taskId);
      const newTasks = [...filtered, scheduledTask];
      return newTasks;
    });

    // Update the task in the main tasks array to mark it as scheduled
    // This ensures the task list shows it's scheduled
    setTasks(prevTasks =>
      prevTasks.map(t =>
        t.id === taskId
          ? { ...t, isScheduled: true, scheduledHour: hour, scheduledTime: scheduledTask.scheduledTime }
          : t
      )
    );
  };

  // Handle updating task time on timeline (when dragging timeline cards)
  const handleUpdateTaskTime = (taskId: number, hour: number) => {
    setTimelineTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              scheduledHour: hour,
              scheduledTime: `${hour.toString().padStart(2, '0')}:00`,
            }
          : task
      )
    );

    // Also update the task in the main tasks array
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              scheduledHour: hour,
              scheduledTime: `${hour.toString().padStart(2, '0')}:00`,
            }
          : task
      )
    );
  };

  // Handle dropping task from timeline back to tasklist
  const handleDropToTaskList = (taskId: number) => {
    const timelineTask = timelineTasks.find(t => t.id === taskId);
    if (!timelineTask) return;

    // Remove scheduled properties and add back to tasklist
    const { isScheduled, scheduledHour, scheduledDuration, ...taskData } = timelineTask;
    const unscheduledTask: Task = {
      ...taskData,
      scheduledTime: undefined,
    };

    // Add back to tasks if not already there
    setTasks(prev => {
      const exists = prev.some(t => t.id === taskId);
      if (!exists) {
        return [unscheduledTask, ...prev];
      }
      return prev;
    });

    // Remove from timeline
    setTimelineTasks(prev => prev.filter(t => t.id !== taskId));
  };

  return (
    <div className="h-screen w-screen overflow-hidden base-layer flex flex-col bg-[#FDFBF6]">
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen
            key="splash"
            onComplete={() => {
              // This is called after the exit animation finishes
            }}
          />
        )}
      </AnimatePresence>

      {!showSplash && (
        <motion.div
          className="flex-1 flex flex-col h-full"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
          {/* Global Header (Base Layer) */}
          <Header />

          {/* Core Functional Layout: Timeline (60%) & Tasks (40%) */}
          <div className="flex-1 flex gap-12 px-16 pb-12 overflow-hidden items-stretch">
            {/* Main Timeline Page (Left) */}
            <Timeline
              timelineTasks={timelineTasks}
              onDropTask={handleDropToTimeline}
              onUpdateTaskTime={handleUpdateTaskTime}
              onRemoveFromTimeline={handleDropToTaskList}
              onDeleteFromTimeline={deleteFromTimeline}
            />

            {/* Results & Management Panel (Right) */}
            <TaskList
              tasks={tasks}
              onAddTask={addTask}
              onToggleComplete={toggleComplete}
              onSchedule={scheduleTask}
              onDeleteTask={deleteTask}
            />
          </div>

          {/* Page Footer */}
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6 text-[#4A4238]/20 text-[11px] font-black tracking-[1em] select-none pl-[1em]">
            JOURNAL 2026 <span className="w-24 h-[2px] bg-[#4A4238]/10" /> 01 / 365
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default App;
