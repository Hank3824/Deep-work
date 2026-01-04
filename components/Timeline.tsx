
import React, { useState } from 'react';
import { Task, Priority } from '../types';

interface TimelineProps {
  timelineTasks: Task[];
  onDropTask: (taskId: number, hour: number) => void;
  onUpdateTaskTime: (taskId: number, hour: number) => void;
  onRemoveFromTimeline: (taskId: number) => void;
  onDeleteFromTimeline: (taskId: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ timelineTasks, onDropTask, onUpdateTaskTime, onRemoveFromTimeline, onDeleteFromTimeline }) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [currentDragY, setCurrentDragY] = useState(0);

  const hours = Array.from({ length: 24 }, (_, i) => {
    const h = (i + 6) % 24;
    return h.toString().padStart(2, '0') + ':00';
  });

  // Use timelineTasks directly for rendering
  const displayTasks = timelineTasks;

  // Simplified drag handling for timeline cards
  const handleMouseDown = (e: React.MouseEvent, task: Task) => {
    e.preventDefault();

    const timelineElement = document.querySelector('.timeline-container') as HTMLElement;
    if (!timelineElement) return;

    const rect = timelineElement.getBoundingClientRect();
    const scrollTop = timelineElement.scrollTop;

    // Calculate mouse position relative to timeline content
    const mouseY = e.clientY - rect.top + scrollTop;

    setDraggedTask(task);
    setIsDragging(true);
    setDragStartY(mouseY);
    setCurrentDragY(mouseY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !draggedTask) return;

    const timelineElement = document.querySelector('.timeline-container') as HTMLElement;
    if (!timelineElement) return;

    const rect = timelineElement.getBoundingClientRect();
    const scrollTop = timelineElement.scrollTop;

    // Update current drag position
    const mouseY = e.clientY - rect.top + scrollTop;
    setCurrentDragY(mouseY);
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging || !draggedTask) return;

    const timelineElement = document.querySelector('.timeline-container') as HTMLElement;
    if (!timelineElement) return;

    const rect = timelineElement.getBoundingClientRect();
    const scrollTop = timelineElement.scrollTop;

    // Get final mouse position
    const finalY = e.clientY - rect.top + scrollTop;

    // Calculate which hour slot the card should snap to
    const slotHeight = 96;
    const slotStartY = 12;

    // Find the closest hour slot
    const slotIndex = Math.round((finalY - slotStartY) / slotHeight);
    const clampedSlotIndex = Math.max(0, Math.min(23, slotIndex));
    const newHour = (clampedSlotIndex + 6) % 24;

    // Update task time if changed
    if (newHour !== draggedTask.scheduledHour && newHour >= 0 && newHour <= 23) {
      onUpdateTaskTime(draggedTask.id, newHour);
    }

    // Reset drag state
    setDraggedTask(null);
    setIsDragging(false);
    setDragStartY(0);
    setCurrentDragY(0);
  };

  // Add global mouse event listeners when dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className="flex-[3] flex flex-col bg-white rounded-[40px] shadow-[0_15px_45px_rgba(74,66,56,0.1)] border border-[#4A4238]/10 overflow-hidden relative">
      {/* Notebook Spine Decoration */}
      <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-center justify-around py-10 z-20 pointer-events-none border-r border-[#4A4238]/5 bg-[#FDFBF6]">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="w-4 h-4 rounded-full bg-[#DAD7CD] shadow-inner opacity-40" />
        ))}
      </div>

      <div className="px-16 py-8 border-b border-[#4A4238]/10 flex justify-between items-center bg-[#FDFBF6] z-10">
        <h2 className="text-[14px] font-black uppercase tracking-[0.4em] text-[#4A4238]">时间轴 | TIMELINE</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#E6A05D]" />
            <span className="text-[10px] font-bold text-[#4A4238]/40 uppercase tracking-widest">Focus Session</span>
          </div>
          <button
            onClick={() => {
              // Test button to manually add a task
              const testTask = {
                id: Date.now(),
                title: '测试任务 ' + Date.now(),
                priority: 'HIGH' as const,
                completed: false,
                tags: '[]',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isScheduled: true,
                scheduledHour: 10,
                scheduledDuration: 1,
                scheduledTime: '10:00',
              };
              console.log('Adding test task:', testTask);
              // Directly add to timelineTasks for testing
              console.log('Current timelineTasks before adding:', timelineTasks);
              // This should work if the button calls the right function
              onDropTask(testTask.id, 10);
              console.log('Test task added, checking timelineTasks after...');
            }}
            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            测试添加
          </button>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto relative p-10 pt-16 ml-8 timeline-container"
        style={{
          backgroundImage: 'linear-gradient(#E5E0D6 1px, transparent 1px), linear-gradient(90deg, #E5E0D6 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      >
        <div className="relative pl-16">
          {/* Main vertical line */}
          <div className="absolute left-[54px] top-0 bottom-0 w-[2px] bg-[#4A4238]/10" />

          {hours.map((time, idx) => {
            const hour = (idx + 6) % 24; // Actual hour (0-23)

            const handleDrop = (e: React.DragEvent) => {
              e.preventDefault();
              try {
                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                console.log('Timeline drop at hour', hour, 'data:', data);
                if (data.type === 'timeline-task') {
                  // 时间轴上任务卡片的拖拽，更新时间
                  console.log('Updating timeline task', data.id, 'to hour', hour);
                  onUpdateTaskTime(data.id, hour);
                } else {
                  // 从待办清单拖拽过来的新任务
                  console.log('Adding new task', data.id, 'to timeline at hour', hour);
                  onDropTask(data.id, hour);
                }
              } catch (error) {
                console.error('Failed to parse drag data:', error);
              }
            };

            const handleDragOver = (e: React.DragEvent) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'copy';
            };

            return (
              <div
                key={idx}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="h-24 flex items-start relative border-none group transition-colors hover:bg-blue-50/50"
              >
                <span className="absolute left-[-90px] top-[-10px] text-[13px] font-black text-[#4A4238]/30 group-hover:text-[#4A4238] transition-colors tabular-nums">{time}</span>
                <div className="w-3 h-3 rounded-full bg-white border-2 shadow-sm transition-all border-[#DAD7CD] group-hover:border-blue-400 group-hover:scale-125 absolute left-[-16px] top-[-5px] z-10" />
              </div>
            );
          })}

          {/* Time Blocks - Hand Drawn Style */}
          {displayTasks.map((task, index) => {
            const hour = task.scheduledHour || 9; // Default to 9 AM if not set
            // Convert hour to position (6 AM = 0, 7 AM = 1, ..., 5 AM next day = 23)
            const position = hour >= 6 ? hour - 6 : hour + 18;
            const top = position * 96 + 12; // 96px per hour slot, offset by 12px
            const height = Math.max(80, (task.scheduledDuration || 1) * 96 - 24);

            // Ensure the task card is within reasonable bounds
            const clampedTop = Math.max(12, Math.min(top, 20 * 96));

            // 根据优先级设置卡片颜色
            const getCardStyles = (priority: Priority) => {
              switch (priority) {
                case Priority.HIGH:
                  return {
                    className: "absolute left-10 right-16 p-6 rounded-2xl border-4 border-red-200/50 shadow-2xl flex flex-col gap-3 transform hover:-translate-y-1 transition-all duration-300 cursor-move bg-red-50/95 backdrop-blur-sm",
                    emoji: "🔥"
                  };
                case Priority.MEDIUM:
                  return {
                    className: "absolute left-10 right-16 p-6 rounded-2xl border-4 border-orange-200/50 shadow-2xl flex flex-col gap-3 transform hover:-translate-y-1 transition-all duration-300 cursor-move bg-orange-50/95 backdrop-blur-sm",
                    emoji: "⚡"
                  };
                case Priority.LOW:
                  return {
                    className: "absolute left-10 right-16 p-6 rounded-2xl border-4 border-green-200/50 shadow-2xl flex flex-col gap-3 transform hover:-translate-y-1 transition-all duration-300 cursor-move bg-green-50/95 backdrop-blur-sm",
                    emoji: "🌱"
                  };
                default:
                  return {
                    className: "absolute left-10 right-16 p-6 rounded-2xl border-4 border-[#4A4238]/20 shadow-2xl flex flex-col gap-3 transform hover:-translate-y-1 transition-all duration-300 cursor-move bg-white/95 backdrop-blur-sm",
                    emoji: "📅"
                  };
              }
            };

            const cardStyles = getCardStyles(task.priority);



            const isDragging = draggedTask?.id === task.id;
            const dragStyle = isDragging ? {
              transform: `translateY(${currentDragY - dragStartY}px)`,
              zIndex: 10000,
              pointerEvents: 'none' as const,
              opacity: 0.8
            } : {};

            return (
              <div
                key={task.id}
                onMouseDown={(e) => handleMouseDown(e, task)}
                className={`${cardStyles.className} select-none`}
                style={{
                  top: `${clampedTop}px`,
                  height: `${height}px`,
                  minHeight: '80px',
                  zIndex: isDragging ? 10000 : 9999,
                  ...dragStyle
                }}
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white/90 rounded-2xl flex items-center justify-center border border-black/5 shadow-inner text-2xl">
                    {cardStyles.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="handwriting text-4xl text-[#4A4238] leading-none mb-2 font-bold">{task.title}</h3>
                    <p className="text-[12px] text-[#4A4238]/50 font-black uppercase tracking-widest font-sans">
                      {task.scheduledTime} — PRO MODE
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFromTimeline(task.id);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors pointer-events-auto"
                    title="删除任务"
                  >
                    ×
                  </button>
                </div>

                {/* Priority indicator */}
                <div className="flex items-center gap-1">
                  {task.priority === Priority.HIGH && (
                    <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">🔥 高</span>
                  )}
                  {task.priority === Priority.MEDIUM && (
                    <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">⚡ 中</span>
                  )}
                  {task.priority === Priority.LOW && (
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">🌱 低</span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Decorative Visuals */}
          <div className="absolute right-12 bottom-60 w-64 rotate-[-4deg] bg-white p-4 shadow-2xl border border-black/5 z-20 hover:rotate-0 transition-all duration-700 cursor-zoom-in group">
            <div className="relative overflow-hidden aspect-[4/5] mb-4 bg-[#F9F7F2]">
              <img 
                src="https://picsum.photos/500/600?grayscale&seed=99" 
                alt="Decoration" 
                className="w-full h-full object-cover grayscale opacity-95 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
              />
            </div>
            <p className="handwriting text-2xl text-center text-[#4A4238] leading-none font-bold">旷野的回响：静默时刻</p>
          </div>
          
          <div className="absolute top-24 right-32 handwriting text-4xl text-[#E6A05D] select-none animate-pulse rotate-6 font-bold">
             Focus, then fly! ✨
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
