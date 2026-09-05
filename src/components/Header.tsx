import React from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Flame, 
  Plus, 
  Bot, 
  KanbanSquare, 
  Wand2, 
  Terminal
} from 'lucide-react';
import { formatMinutes } from '../utils/helpers';

interface HeaderProps {
  activeTab: 'board' | 'chat' | 'quick-intake' | 'prompt-optimizer';
  setActiveTab: (tab: 'board' | 'chat' | 'quick-intake' | 'prompt-optimizer') => void;
  dailyFocusTheme: string;
  completedTasksCount: number;
  totalTasksCount: number;
  totalMinutesPlanned: number;
  totalMinutesCompleted: number;
  onOpenTimer: () => void;
  onOpenNewTask: () => void;
  isTimerRunning: boolean;
  timerSecondsLeft: number;
  streakCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  dailyFocusTheme,
  completedTasksCount,
  totalTasksCount,
  totalMinutesPlanned,
  totalMinutesCompleted,
  onOpenTimer,
  onOpenNewTask,
  isTimerRunning,
  timerSecondsLeft,
  streakCount,
}) => {
  const progressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
  const minutes = Math.floor(timerSecondsLeft / 60);
  const seconds = timerSecondsLeft % 60;
  const timerFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Banner with focus theme & quick stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Brand & Theme */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 font-display">
                  Daily Goal & Task Architect
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Intake-First AI
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate max-w-md">
                Today's Theme: <span className="text-slate-800 font-semibold">{dailyFocusTheme || "Sprint: Focus & High-Leverage Milestones"}</span>
              </p>
            </div>
          </div>

          {/* Quick Widgets: Progress, Timer, Streak, Action */}
          <div className="flex items-center gap-2.5 flex-wrap">
            
            {/* Daily Streak */}
            <div 
              id="streak-badge"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold"
              title="Consecutive days with completed daily goals"
            >
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{streakCount} Day Streak</span>
            </div>

            {/* Daily Progress Gauge */}
            <div 
              id="daily-progress-pill"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium"
            >
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{completedTasksCount}/{totalTasksCount} Done ({progressPercent}%)</span>
              </div>
              <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-slate-500 text-[11px] border-l border-slate-300 pl-2">
                {formatMinutes(totalMinutesCompleted)} / {formatMinutes(totalMinutesPlanned)}
              </span>
            </div>

            {/* Focus Timer Button */}
            <button
              id="header-timer-btn"
              onClick={onOpenTimer}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isTimerRunning 
                  ? 'bg-amber-500 text-white shadow-xs animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
              title="Open Focus Timer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isTimerRunning ? `Focusing: ${timerFormatted}` : 'Focus Timer'}</span>
            </button>

            {/* Quick Add Manual Task */}
            <button
              id="header-add-task-btn"
              onClick={onOpenNewTask}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Task</span>
            </button>
          </div>

        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <nav className="flex space-x-1 sm:space-x-4 py-2 overflow-x-auto no-scrollbar">
          
          <button
            id="tab-board"
            onClick={() => setActiveTab('board')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'board'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <KanbanSquare className="w-4 h-4" />
            <span>Daily Task Board</span>
            {totalTasksCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[11px] ${activeTab === 'board' ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-200 text-slate-700'}`}>
                {totalTasksCount}
              </span>
            )}
          </button>

          <button
            id="tab-chat"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'chat'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Bot className="w-4 h-4 text-indigo-600" />
            <span>AI Intake & Goal Mentor</span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
              Feasibility First
            </span>
          </button>

          <button
            id="tab-quick-intake"
            onClick={() => setActiveTab('quick-intake')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'quick-intake'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Wand2 className="w-4 h-4 text-emerald-600" />
            <span>Quick Goal Generator</span>
          </button>

          <button
            id="tab-prompt-optimizer"
            onClick={() => setActiveTab('prompt-optimizer')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'prompt-optimizer'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Terminal className="w-4 h-4 text-purple-600" />
            <span>Project Prompt Builder</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
              Reusable Prompt
            </span>
          </button>

        </nav>
      </div>
    </header>
  );
};
