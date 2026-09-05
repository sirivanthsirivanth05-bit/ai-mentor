import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Volume2
} from 'lucide-react';
import { TaskItem } from '../types';
import { formatMinutes, triggerConfetti } from '../utils/helpers';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTask: TaskItem | null;
  isRunning: boolean;
  secondsLeft: number;
  onStart: () => void;
  onPause: () => void;
  onReset: (minutes: number) => void;
  onCompleteTask: (id: string) => void;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  isOpen,
  onClose,
  activeTask,
  isRunning,
  secondsLeft,
  onStart,
  onPause,
  onReset,
  onCompleteTask,
}) => {
  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const handleFinish = () => {
    if (activeTask) {
      triggerConfetti();
      onCompleteTask(activeTask.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-6 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Deep Work Focus Companion
          </span>
          <h3 className="text-lg font-bold text-slate-900 font-display">
            {activeTask ? activeTask.title : 'Focused Work Session'}
          </h3>
          {activeTask && (
            <p className="text-xs text-slate-500 mt-1">
              Estimated: {formatMinutes(activeTask.estimatedMinutes)} • {activeTask.category}
            </p>
          )}
        </div>

        {/* Big Timer Display */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="w-48 h-48 rounded-full border-4 border-indigo-100 flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50/50 to-white shadow-inner relative">
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight font-mono">
              {formatted}
            </span>
            <span className="text-xs text-slate-400 font-medium mt-1">
              {isRunning ? 'Sprint Active' : 'Paused'}
            </span>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 mt-5">
            <button
              onClick={() => onReset(25)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              25m (Pomodoro)
            </button>
            <button
              onClick={() => onReset(45)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              45m (Deep Sprint)
            </button>
            <button
              onClick={() => onReset(15)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              15m (Quick Win)
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => onReset(25)}
            className="p-3 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {isRunning ? (
            <button
              onClick={onPause}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-sm transition-all"
            >
              <Pause className="w-4 h-4 fill-white" />
              <span>Pause Focus</span>
            </button>
          ) : (
            <button
              onClick={onStart}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Focus</span>
            </button>
          )}

          {activeTask && (
            <button
              onClick={handleFinish}
              className="p-3 text-emerald-600 hover:text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors"
              title="Mark Task Finished"
            >
              <CheckCircle2 className="w-6 h-6" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
