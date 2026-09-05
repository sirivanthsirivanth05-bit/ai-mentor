import React, { useState, useEffect } from 'react';
import { 
  INITIAL_TASKS, 
  INITIAL_CHAT_MESSAGES, 
  INITIAL_USER_PROFILE 
} from './data/initialData';
import { 
  TaskItem, 
  TaskStatus, 
  ChatMessage, 
  DailyGoalPlan, 
  UserProfile 
} from './types';
import { Header } from './components/Header';
import { TaskBoard } from './components/TaskBoard';
import { AiMentorChat } from './components/AiMentorChat';
import { QuickIntakeView } from './components/QuickIntakeView';
import { PromptOptimizerView } from './components/PromptOptimizerView';
import { FocusTimerModal } from './components/FocusTimerModal';
import { TaskModal } from './components/TaskModal';
import { triggerConfetti, generateId } from './utils/helpers';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

export default function App() {
  // Local storage loaded state with fallbacks
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem('dg_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [dailyFocusTheme, setDailyFocusTheme] = useState<string>(() => {
    try {
      return localStorage.getItem('dg_theme') || 'Sprint: High-Leverage Milestones';
    } catch {
      return 'Sprint: High-Leverage Milestones';
    }
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('dg_chat');
      return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
    } catch {
      return INITIAL_CHAT_MESSAGES;
    }
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('dg_profile');
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [activeTab, setActiveTab] = useState<'board' | 'chat' | 'quick-intake' | 'prompt-optimizer'>('board');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [streakCount, setStreakCount] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('dg_streak')) || 5;
    } catch {
      return 5;
    }
  });

  // Focus Timer state
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [activeTimerTask, setActiveTimerTask] = useState<TaskItem | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(25 * 60);

  // Task creation/editing modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('dg_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('dg_theme', dailyFocusTheme);
    } catch (e) {
      console.error(e);
    }
  }, [dailyFocusTheme]);

  useEffect(() => {
    try {
      localStorage.setItem('dg_chat', JSON.stringify(chatMessages));
    } catch (e) {
      console.error(e);
    }
  }, [chatMessages]);

  useEffect(() => {
    try {
      localStorage.setItem('dg_profile', JSON.stringify(userProfile));
    } catch (e) {
      console.error(e);
    }
  }, [userProfile]);

  // Focus Timer ticker
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      triggerConfetti();
      showToast('Focus session complete! Take a breather or check off your milestone.');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  // Task Actions
  const handleToggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newStatus: TaskStatus = t.status === 'completed' ? 'todo' : 'completed';
          if (newStatus === 'completed') {
            triggerConfetti();
            showToast(`Completed "${t.title}"!`);
          }
          return {
            ...t,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleMoveTaskStatus = (id: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          if (newStatus === 'completed') {
            triggerConfetti();
            showToast(`Completed "${t.title}"!`);
          }
          return {
            ...t,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task removed from board');
  };

  const handleEditTask = (task: TaskItem) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenNewTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<TaskItem>) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? ({ ...t, ...taskData } as TaskItem) : t))
      );
      showToast('Task updated successfully');
    } else {
      setTasks((prev) => [taskData as TaskItem, ...prev]);
      showToast('New daily goal added');
    }
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId && t.subtasks) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
  };

  // Timer Controls
  const handleStartTimerForTask = (task: TaskItem) => {
    setActiveTimerTask(task);
    const mins = task.estimatedMinutes > 0 ? task.estimatedMinutes : 25;
    setTimerSecondsLeft(mins * 60);
    setIsTimerRunning(true);
    setIsTimerModalOpen(true);
  };

  const handleResetTimer = (minutes: number) => {
    setIsTimerRunning(false);
    setTimerSecondsLeft(minutes * 60);
  };

  // Conversational AI Mentor Send
  const handleSendChatMessage = async (content: string) => {
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          userProfile,
          currentTasks: tasks.map((t) => ({ title: t.title, category: t.category })),
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.text,
        extractedGoals: data.extractedGoals,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error(error);
      const errorReply: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `⚠️ I encountered an issue connecting with the mentor server. Please verify your GEMINI_API_KEY or connection. (${error.message})`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Import AI Generated Goals
  const handleImportGoals = (plan: DailyGoalPlan) => {
    if (!plan || !plan.goals) return;

    if (plan.dailyFocusTheme) {
      setDailyFocusTheme(plan.dailyFocusTheme);
    }

    const newTasks: TaskItem[] = plan.goals.map((g) => ({
      id: generateId(),
      title: g.title,
      description: g.description,
      category: g.category,
      status: 'todo',
      priority: g.priority || 'medium',
      estimatedMinutes: g.estimatedMinutes || 45,
      feasibilityTag: g.feasibilityTag || 'Realistic',
      uniquenessTag: g.uniquenessTag || 'High Impact',
      subtasks: (g.subtasks || []).map((text) => ({
        id: generateId(),
        text,
        completed: false,
      })),
      createdAt: new Date().toISOString(),
      source: 'ai-mentor',
    }));

    setTasks((prev) => [...newTasks, ...prev]);
    triggerConfetti();
    showToast(`Successfully imported ${newTasks.length} goals to your Task Board!`);
    setActiveTab('board');
  };

  // Calculations for stats
  const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;
  const totalTasksCount = tasks.length;
  const totalMinutesPlanned = tasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
  const totalMinutesCompleted = tasks
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dailyFocusTheme={dailyFocusTheme}
        completedTasksCount={completedTasksCount}
        totalTasksCount={totalTasksCount}
        totalMinutesPlanned={totalMinutesPlanned}
        totalMinutesCompleted={totalMinutesCompleted}
        onOpenTimer={() => setIsTimerModalOpen(true)}
        onOpenNewTask={handleOpenNewTask}
        isTimerRunning={isTimerRunning}
        timerSecondsLeft={timerSecondsLeft}
        streakCount={streakCount}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'board' && (
          <TaskBoard
            tasks={tasks}
            dailyFocusTheme={dailyFocusTheme}
            onToggleStatus={handleToggleTaskStatus}
            onMoveStatus={handleMoveTaskStatus}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onStartTimer={handleStartTimerForTask}
            onToggleSubtask={handleToggleSubtask}
            onOpenNewTask={handleOpenNewTask}
            onSwitchToAi={() => setActiveTab('chat')}
            onSwitchToQuickIntake={() => setActiveTab('quick-intake')}
          />
        )}

        {activeTab === 'chat' && (
          <AiMentorChat
            messages={chatMessages}
            onSendMessage={handleSendChatMessage}
            onImportGoals={handleImportGoals}
            isLoading={isChatLoading}
            userProfile={userProfile}
            onUpdateProfile={(partial) => setUserProfile((prev) => ({ ...prev, ...partial }))}
            currentTasks={tasks}
          />
        )}

        {activeTab === 'quick-intake' && (
          <QuickIntakeView
            userProfile={userProfile}
            onUpdateProfile={(partial) => setUserProfile((prev) => ({ ...prev, ...partial }))}
            onImportGoals={handleImportGoals}
          />
        )}

        {activeTab === 'prompt-optimizer' && (
          <PromptOptimizerView />
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-slate-800 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Focus Timer Modal */}
      <FocusTimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
        activeTask={activeTimerTask}
        isRunning={isTimerRunning}
        secondsLeft={timerSecondsLeft}
        onStart={() => setIsTimerRunning(true)}
        onPause={() => setIsTimerRunning(false)}
        onReset={handleResetTimer}
        onCompleteTask={(id) => handleMoveTaskStatus(id, 'completed')}
      />

      {/* Task Create/Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />

    </div>
  );
}
