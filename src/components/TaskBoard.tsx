import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles,
  Layers,
  ListOrdered
} from 'lucide-react';
import { TaskItem, TaskStatus, TaskCategory, TaskPriority } from '../types';
import { TaskCard } from './TaskCard';
import { formatMinutes } from '../utils/helpers';

interface TaskBoardProps {
  tasks: TaskItem[];
  dailyFocusTheme: string;
  onToggleStatus: (id: string) => void;
  onMoveStatus: (id: string, newStatus: TaskStatus) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: TaskItem) => void;
  onStartTimer: (task: TaskItem) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onOpenNewTask: () => void;
  onSwitchToAi: () => void;
  onSwitchToQuickIntake: () => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  dailyFocusTheme,
  onToggleStatus,
  onMoveStatus,
  onDeleteTask,
  onEditTask,
  onStartTimer,
  onToggleSubtask,
  onOpenNewTask,
  onSwitchToAi,
  onSwitchToQuickIntake,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
      const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;

      return matchesSearch && matchesCategory && matchesPriority;
    });
  }, [tasks, searchQuery, selectedCategory, selectedPriority]);

  const todoTasks = filteredTasks.filter(t => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in-progress');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');

  const totalMinutes = tasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
  const completedMinutes = tasks.filter(t => t.status === 'completed').reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);

  // Workload Feasibility Alert
  const isOverloaded = totalMinutes > 360; // Over 6 hours is high burnout risk for deep focus
  const isOptimal = totalMinutes >= 90 && totalMinutes <= 300;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Daily Theme & Cognitive Workload Assessment */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                Daily Focus
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500 font-medium">
                {tasks.length} {tasks.length === 1 ? 'goal' : 'goals'} scheduled today
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1 font-display tracking-tight">
              {dailyFocusTheme || "Structured Daily Goals"}
            </h2>
          </div>

          {/* Workload Reality Check */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Total Planned Time</p>
                <p className="text-sm font-bold text-slate-800">
                  {formatMinutes(totalMinutes)}
                  <span className="text-xs font-normal text-slate-500 ml-1">
                    ({formatMinutes(completedMinutes)} done)
                  </span>
                </p>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200" />

            <div>
              <p className="text-[11px] text-slate-500 font-medium">Workload Realism</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {isOverloaded ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                    Burnout Risk (&gt;6h)
                  </span>
                ) : isOptimal ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Feasible Daily Sprint
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Light / Flexible Day
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters, Search, View Mode */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-tasks-input"
            type="text"
            placeholder="Search goals, tasks, subtasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 transition-colors"
          />
        </div>

        {/* Category & Priority Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          
          <select
            id="filter-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            <option value="Deep Work">Deep Work</option>
            <option value="Learning">Learning</option>
            <option value="Admin">Admin</option>
            <option value="Review">Review</option>
            <option value="Personal">Personal</option>
          </select>

          <select
            id="filter-priority"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'kanban' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Kanban Board View"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'list' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="List View"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onOpenNewTask}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors ml-auto sm:ml-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>

      </div>

      {/* Main Board / List View */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display">No goals or tasks in this view</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
            Get personalized, high-feasibility daily goals tailored to your time constraints with our conversational AI intake.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={onSwitchToAi}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Goal Mentor</span>
            </button>
            <button
              onClick={onSwitchToQuickIntake}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-200"
            >
              <span>Quick Goal Generator</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Column 1: To Do */}
          <div className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/80 flex flex-col min-h-[420px]">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-display">
                  To Do
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                {todoTasks.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {todoTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={onToggleStatus}
                  onMoveStatus={onMoveStatus}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                  onStartTimer={onStartTimer}
                  onToggleSubtask={onToggleSubtask}
                />
              ))}
              {todoTasks.length === 0 && (
                <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
                  No pending goals
                </div>
              )}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="bg-indigo-50/40 rounded-2xl p-4 border border-indigo-100 flex flex-col min-h-[420px]">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 font-display">
                  In Progress
                </h3>
              </div>
              <span className="text-xs font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                {inProgressTasks.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {inProgressTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={onToggleStatus}
                  onMoveStatus={onMoveStatus}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                  onStartTimer={onStartTimer}
                  onToggleSubtask={onToggleSubtask}
                />
              ))}
              {inProgressTasks.length === 0 && (
                <div className="h-32 border-2 border-dashed border-indigo-100 rounded-xl flex items-center justify-center text-xs text-indigo-400 text-center px-4">
                  Pick a high-leverage task to focus on
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Completed */}
          <div className="bg-emerald-50/40 rounded-2xl p-4 border border-emerald-100 flex flex-col min-h-[420px]">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 font-display">
                  Completed
                </h3>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                {completedTasks.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {completedTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={onToggleStatus}
                  onMoveStatus={onMoveStatus}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                  onStartTimer={onStartTimer}
                  onToggleSubtask={onToggleSubtask}
                />
              ))}
              {completedTasks.length === 0 && (
                <div className="h-32 border-2 border-dashed border-emerald-100 rounded-xl flex items-center justify-center text-xs text-emerald-400">
                  Completed tasks will show here
                </div>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200 p-4 divide-y divide-slate-100 shadow-xs">
          {filteredTasks.map(task => (
            <div key={task.id} className="py-2.5 first:pt-0 last:pb-0">
              <TaskCard
                task={task}
                onToggleStatus={onToggleStatus}
                onMoveStatus={onMoveStatus}
                onDelete={onDeleteTask}
                onEdit={onEditTask}
                onStartTimer={onStartTimer}
                onToggleSubtask={onToggleSubtask}
              />
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
