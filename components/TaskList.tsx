
import React, { useState } from 'react';
import { Task, Priority } from '../types';
import { CheckCircle2, Plus } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (title: string, priority: Priority) => void;
  onToggleComplete: (id: number) => void;
  onSchedule: (id: number, time: string) => void;
  onDeleteTask: (id: number) => void;
}

interface DraggableTaskItemProps {
  task: Task;
  onToggleComplete: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

// Separate component for draggable task item to avoid hooks rule violation
const DraggableTaskItem: React.FC<DraggableTaskItemProps> = ({ task, onToggleComplete, onDeleteTask }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      id: task.id,
      title: task.title,
      priority: task.priority
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      className={`group flex items-start gap-4 relative transition-opacity ${
        task.isScheduled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer'
      }`}
    >
      <div
        draggable={!task.isScheduled}
        onDragStart={handleDragStart}
        onClick={() => onToggleComplete(task.id)}
        className="flex items-start gap-4 flex-1"
      >
        <div className="mt-2 flex-shrink-0">
          {task.completed ?
            <CheckCircle2 className="w-7 h-7 text-[#E6A05D]" /> :
            <div className="w-7 h-7 rounded-full border-[3px] border-[#4A4238]/20 group-hover:border-[#4A4238]/40 transition-all" />
          }
        </div>
        <div className="flex-1">
          <div className={`handwriting text-2xl leading-none transition-all ${task.completed ? 'line-through text-[#4A4238]/30 decoration-[#E6A05D]/70 decoration-4' : 'text-[#4A4238] font-bold'}`}>
            {task.title}
          </div>
          {task.isScheduled && (
            <div className="text-xs text-[#4A4238]/50 mt-1">
              已安排到时间轴
            </div>
          )}
          {!task.isScheduled && (
            <div className="text-xs text-[#4A4238]/40 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              拖拽到时间轴安排时间
            </div>
          )}
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDeleteTask(task.id);
        }}
        className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
        title="删除任务"
      >
        ×
      </button>
    </div>
  );
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onAddTask, onToggleComplete, onDeleteTask }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority>(Priority.MEDIUM);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim(), selectedPriority);
      setNewTaskTitle('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  // Group tasks by priority
  const highPriorityTasks = tasks.filter(task => task.priority === Priority.HIGH);
  const mediumPriorityTasks = tasks.filter(task => task.priority === Priority.MEDIUM);
  const lowPriorityTasks = tasks.filter(task => task.priority === Priority.LOW);

  const renderTaskGroup = (title: string, taskList: Task[], bgColor: string, textColor: string, emoji: string) => (
    <section className={`p-6 rounded-2xl border ${bgColor}`}>
      <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textColor}`}>
        {emoji} {title}
      </h3>
      <div className="space-y-4">
        {taskList.length === 0 ? (
          <div className="text-center py-8 opacity-50">
            <div className="text-2xl mb-2">📝</div>
            <div className="text-sm">暂无任务</div>
          </div>
        ) : (
          taskList.map(task => (
            <DraggableTaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDeleteTask={onDeleteTask}
            />
          ))
        )}
      </div>
    </section>
  );

  return (
    <div className="flex-[2] flex flex-col gap-8 p-10 overflow-y-auto bg-transparent rounded-[32px]">
      {/* Task Input Section */}
      <section className="space-y-8 flex-1">
        <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#4A4238] border-b-2 border-[#4A4238]/10 pb-4">待办清单 | TO-DO LIST</h4>

        {/* Add Task Input */}
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-[24px] border border-[#4A4238]/10">
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="添加新任务..."
              className="flex-1 px-4 py-3 bg-white rounded-lg border border-[#4A4238]/20 focus:outline-none focus:ring-2 focus:ring-[#4A4238]/30 text-[#4A4238] placeholder-[#4A4238]/40"
            />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as Priority)}
              className="px-3 py-3 bg-white rounded-lg border border-[#4A4238]/20 focus:outline-none focus:ring-2 focus:ring-[#4A4238]/30 text-[#4A4238]"
            >
              <option value={Priority.HIGH}>🔥 高优先级</option>
              <option value={Priority.MEDIUM}>⚡ 中优先级</option>
              <option value={Priority.LOW}>🌱 低优先级</option>
            </select>
            <button
              onClick={handleAddTask}
              disabled={!newTaskTitle.trim()}
              className="px-4 py-3 bg-[#4A4238] text-white rounded-lg hover:bg-[#3a3328] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              添加
            </button>
          </div>
        </div>

      </section>

      {/* Priority Grouped Tasks */}
      <div className="space-y-6 flex-1">
        {renderTaskGroup("高优先级任务", highPriorityTasks, "bg-red-50/50 border-red-200/50", "text-red-700", "🔥")}
        {renderTaskGroup("中优先级任务", mediumPriorityTasks, "bg-orange-50/50 border-orange-200/50", "text-orange-700", "⚡")}
        {renderTaskGroup("低优先级任务", lowPriorityTasks, "bg-green-50/50 border-green-200/50", "text-green-700", "🌱")}
      </div>

      <div className="mt-auto pt-10 border-t-2 border-[#4A4238]/10 flex flex-col items-center gap-4">
        <div className="text-3xl handwriting text-[#4A4238]/40 italic tracking-wider font-bold">Step by step. Day by day.</div>
        <div className="text-[11px] font-black tracking-[1em] text-[#4A4238]/20 pl-[1em] uppercase">The Scholar's Journal</div>
      </div>
    </div>
  );
};

export default TaskList;
