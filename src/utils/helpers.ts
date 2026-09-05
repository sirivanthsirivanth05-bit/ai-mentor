import confetti from 'canvas-confetti';
import { TaskCategory, TaskPriority } from '../types';

export const triggerConfetti = () => {
  try {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'],
    });
  } catch (e) {
    // Ignore if canvas isn't ready
  }
};

export const formatMinutes = (mins: number): string => {
  if (!mins || mins <= 0) return '0m';
  const hours = Math.floor(mins / 60);
  const remaining = mins % 60;
  if (hours === 0) return `${remaining}m`;
  if (remaining === 0) return `${hours}h`;
  return `${hours}h ${remaining}m`;
};

export const getCategoryStyles = (category: TaskCategory) => {
  switch (category) {
    case 'Deep Work':
      return {
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        badge: 'bg-indigo-600',
        dot: 'bg-indigo-500',
      };
    case 'Learning':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        badge: 'bg-emerald-600',
        dot: 'bg-emerald-500',
      };
    case 'Admin':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        badge: 'bg-amber-600',
        dot: 'bg-amber-500',
      };
    case 'Review':
      return {
        bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
        badge: 'bg-cyan-600',
        dot: 'bg-cyan-500',
      };
    case 'Personal':
    default:
      return {
        bg: 'bg-purple-50 text-purple-700 border-purple-200',
        badge: 'bg-purple-600',
        dot: 'bg-purple-500',
      };
  }
};

export const getPriorityBadge = (priority: TaskPriority) => {
  switch (priority) {
    case 'high':
      return {
        label: 'High',
        className: 'bg-rose-50 text-rose-700 border border-rose-200 font-medium',
      };
    case 'medium':
      return {
        label: 'Med',
        className: 'bg-amber-50 text-amber-700 border border-amber-200 font-medium',
      };
    case 'low':
      return {
        label: 'Low',
        className: 'bg-slate-100 text-slate-600 border border-slate-200 font-medium',
      };
  }
};

export const getFeasibilityColor = (score: number) => {
  if (score >= 8) {
    return {
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      label: 'High Feasibility',
    };
  }
  if (score >= 5) {
    return {
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      label: 'Moderate Stretch',
    };
  }
  return {
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    label: 'High Scope Risk',
  };
};

export const generateId = (): string => {
  return 'item-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
};
