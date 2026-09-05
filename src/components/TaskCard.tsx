import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Play, 
  Trash2, 
  Edit3, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  Tag,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { TaskItem, TaskStatus } from '../types';
import { getCategoryStyles, getPriorityBadge, formatMinutes } from '../utils/helpers';

interface TaskCardProps {
  task: TaskItem;
  onToggleStatus: (id: string) => void;
  onMoveStatus: (id: string, newStatus: TaskStatus) => void;
  onDelete: (id: string) => void;
  onEdit: (task: TaskItem) => void;
  onStartTimer: (task: TaskItem) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleStatus,
  onMoveStatus,
  onDelete,
  onEdit,
  onStartTimer,
  onToggleSubtask,
}) => {
  const [showSubtasks, setShowSubtasks] = useState(true);
  const catStyles = getCategoryStyles(task.category);
  const priorityBadge = getPriorityBadge(task.priority);

  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const isCompleted = task.status === 'completed';

  return (
    <div
      id={`task-card-${task.id}`}
      className={`group relative rounded-xl border p-4 transition-all duration-200 bg-white ${
        isCompleted
          ? 'border-slate-200 bg-slate-50/60 opacity-80'
          : task.status === 'in-progress'
          ? 'border-indigo-300 shadow-sm ring-1 ring-indigo-200/50'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      {/* Top row: Category, Priority, Feasibility / Uniqueness tags */}
      <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Category */}
          <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${catStyles.bg}`}>
            {task.category}
          </span>

          {/* Priority */}
          <span className={`px-1.5 py-0.5 rounded text-[11px] ${priorityBadge.className}`}>
            {priorityBadge.label}
          </span>

          {/* Feasibility Tag */}
          {task.feasibilityTag && (
            <span 
              className={`px-1.5 py-0.5 rounded text-[11px] font-medium border ${
                task.feasibilityTag === 'Realistic' || task.feasibilityTag === 'Quick Win'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
              title="Workload Feasibility Assessment"
            >
              {task.feasibilityTag}
            </span>
          )}

          {/* Uniqueness Tag */}
          {task.uniquenessTag && (
            <span 
              className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200"
              title="Impact & Uniqueness Flag"
            >
              {task.uniquenessTag}
            </span>
          )}
        </div>

        {/* Source indicator */}
        {task.source === 'ai-mentor' && (
          <span 
            className="flex items-center gap-1 text-[10px] font-medium text-indigo-600 bg-indigo-50/80 px-1.5 py-0.5 rounded"
            title="Generated via AI Goal Mentor"
          >
            <Sparkles className="w-2.5 h-2.5" />
            AI Mentor
          </span>
        )}
      </div>

      {/* Main Title & Complete Toggle */}
      <div className="flex items-start gap-2.5">
        <button
          id={`toggle-task-${task.id}`}
          onClick={() => onToggleStatus(task.id)}
          className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-emerald-600 transition-colors"
          title={isCompleted ? "Mark incomplete" : "Mark completed"}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3 
            className={`text-sm font-semibold text-slate-900 leading-snug break-words ${
              isCompleted ? 'line-through text-slate-500' : ''
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-1 text-xs text-slate-600 leading-relaxed line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Subtasks (if any) */}
      {totalSubtasks > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <button
            onClick={() => setShowSubtasks(!showSubtasks)}
            className="w-full flex items-center justify-between text-[11px] font-medium text-slate-500 hover:text-slate-700 py-0.5"
          >
            <span className="flex items-center gap-1">
              <span>Steps ({completedSubtasks}/{totalSubtasks})</span>
            </span>
            {showSubtasks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showSubtasks && (
            <div className="mt-1.5 space-y-1 pl-1">
              {task.subtasks!.map(sub => (
                <label 
                  key={sub.id}
                  className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer select-none group/sub hover:bg-slate-50 p-1 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={sub.completed}
                    onChange={() => onToggleSubtask(task.id, sub.id)}
                    className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className={`text-[11px] leading-tight ${sub.completed ? 'line-through text-slate-400' : ''}`}>
                    {sub.text}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom bar: Time estimate, Actions, Status mover */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-500">
        
        {/* Estimated Time & Timer Launcher */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            <Clock className="w-3 h-3 text-slate-400" />
            {formatMinutes(task.estimatedMinutes)}
          </span>

          {!isCompleted && (
            <button
              id={`start-timer-${task.id}`}
              onClick={() => onStartTimer(task)}
              className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-0.5 rounded transition-colors"
              title="Start focused session for this task"
            >
              <Play className="w-2.5 h-2.5 fill-indigo-600" />
              Focus
            </button>
          )}
        </div>

        {/* Card Controls */}
        <div className="flex items-center gap-1.5">
          {/* Status Quick Shifter */}
          {task.status === 'todo' && (
            <button
              onClick={() => onMoveStatus(task.id, 'in-progress')}
              className="text-[11px] text-slate-500 hover:text-indigo-600 font-medium px-1.5 py-0.5 rounded hover:bg-slate-100 transition-colors flex items-center gap-0.5"
              title="Move to In Progress"
            >
              Start <ArrowRight className="w-2.5 h-2.5" />
            </button>
          )}

          {task.status === 'in-progress' && (
            <button
              onClick={() => onMoveStatus(task.id, 'completed')}
              className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium px-1.5 py-0.5 rounded hover:bg-emerald-50 transition-colors flex items-center gap-0.5"
              title="Mark as Done"
            >
              Finish <CheckCircle2 className="w-2.5 h-2.5" />
            </button>
          )}

          <button
            onClick={() => onEdit(task)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
            title="Edit task"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
