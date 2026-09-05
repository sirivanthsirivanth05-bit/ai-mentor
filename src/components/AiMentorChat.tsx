import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck, 
  Flame, 
  Layers,
  HelpCircle,
  Plus
} from 'lucide-react';
import { ChatMessage, DailyGoalPlan, UserProfile, TaskItem } from '../types';
import { formatMinutes, triggerConfetti } from '../utils/helpers';

interface AiMentorChatProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => Promise<void>;
  onImportGoals: (plan: DailyGoalPlan) => void;
  isLoading: boolean;
  userProfile: UserProfile;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
  currentTasks: TaskItem[];
}

export const AiMentorChat: React.FC<AiMentorChatProps> = ({
  messages,
  onSendMessage,
  onImportGoals,
  isLoading,
  userProfile,
  onUpdateProfile,
  currentTasks,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const text = inputValue.trim();
    setInputValue('');
    await onSendMessage(text);
  };

  const handleQuickChip = (chipText: string) => {
    setInputValue(chipText);
  };

  // Quick intake helper questions
  const quickIntakeSuggestions = [
    "I have 3 hours today to learn backend caching with Redis",
    "I need 3 realistic goals for completing my portfolio auth flow",
    "Review my schedule: I only have 90 mins and need high-impact progress",
    "I'm an intermediate dev tackling Docker & CI/CD today",
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[750px] overflow-hidden">
      
      {/* Top Mentor Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 font-display">GoalMentor AI</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Mentor Mode
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Intake-first architecture • Feasibility ratings • Anti-burnout guardrails
            </p>
          </div>
        </div>

        {/* User Context Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600">
          <Clock className="w-3.5 h-3.5 text-indigo-600" />
          <span>Available Today: <strong className="text-slate-900">{userProfile.focusTimeToday} hrs</strong></span>
          <span className="text-slate-300">|</span>
          <span>Energy: <strong className="text-slate-900">{userProfile.energyLevel}</strong></span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/30">
        
        {/* Anti-Slop Methodology Banner */}
        <div className="bg-gradient-to-r from-indigo-50/90 to-blue-50/90 border border-indigo-100 rounded-xl p-3.5 text-xs text-indigo-900 flex items-start gap-3 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="font-bold text-indigo-950">Why This AI Mentor is Different:</p>
            <p className="text-indigo-800/90 leading-relaxed">
              Instead of dumping generic 10-item lists, we ask for your available time and skill context <strong>first</strong>. We evaluate <strong>feasibility (1-10)</strong>, flag <strong>overdone vs high-leverage</strong> goals, and keep daily plans within realistic cognitive limits.
            </p>
          </div>
        </div>

        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-semibold ${
                  isUser
                    ? 'bg-slate-800 text-white'
                    : 'bg-indigo-600 text-white shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content Container */}
              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-xs rounded-tl-none'
                }`}
              >
                {/* Text Body */}
                <div className="whitespace-pre-wrap font-normal space-y-2">
                  {msg.content}
                </div>

                {/* Extracted Structured Goal Proposal (if AI returned structured goals) */}
                {msg.extractedGoals && (
                  <div className="mt-4 pt-4 border-t border-slate-100 bg-indigo-50/40 rounded-xl p-4 border border-indigo-100">
                    
                    {/* Proposal Meta Badges */}
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 block">
                          Generated Daily Goal Plan
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 font-display">
                          {msg.extractedGoals.dailyFocusTheme}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Feasibility score pill */}
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Feasibility: {msg.extractedGoals.feasibilityScore}/10
                        </span>

                        {/* Uniqueness rating */}
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          {msg.extractedGoals.uniquenessRating}
                        </span>
                      </div>
                    </div>

                    {/* Feasibility & Guardrail Commentary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3.5 text-xs">
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <p className="font-semibold text-slate-700 flex items-center gap-1 mb-1">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          Workload Reality Check
                        </p>
                        <p className="text-slate-600 leading-snug">
                          {msg.extractedGoals.feasibilitySummary}
                        </p>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <p className="font-semibold text-slate-700 flex items-center gap-1 mb-1">
                          <ShieldCheck className="w-3 h-3 text-indigo-600" />
                          Learning & Scope Guardrail
                        </p>
                        <p className="text-slate-600 leading-snug">
                          {msg.extractedGoals.guardrailAdvice}
                        </p>
                      </div>
                    </div>

                    {/* Proposed Goals Checklist */}
                    <div className="space-y-2 mb-3">
                      <p className="text-xs font-semibold text-slate-700">
                        Proposed Sprint Milestones ({msg.extractedGoals.goals.length} goals • ~{formatMinutes(msg.extractedGoals.totalEstimatedMinutes)}):
                      </p>
                      {msg.extractedGoals.goals.map((goal, idx) => (
                        <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-slate-900">{idx + 1}. {goal.title}</span>
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                                {goal.category}
                              </span>
                              {goal.feasibilityTag && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {goal.feasibilityTag}
                                </span>
                              )}
                            </div>
                            <p className="text-slate-500 text-[11px] mt-0.5">{goal.description}</p>
                            {goal.subtasks && goal.subtasks.length > 0 && (
                              <p className="text-[10px] text-slate-400 mt-1">
                                Steps: {goal.subtasks.join(' • ')}
                              </p>
                            )}
                          </div>
                          <span className="text-slate-600 font-semibold text-[11px] whitespace-nowrap bg-slate-100 px-2 py-0.5 rounded">
                            {formatMinutes(goal.estimatedMinutes)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* 1-Click Import Button */}
                    <button
                      id="import-ai-goals-btn"
                      onClick={() => onImportGoals(msg.extractedGoals!)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add All {msg.extractedGoals.goals.length} Goals to My Task Board</span>
                    </button>
                  </div>
                )}

                <div className={`mt-1.5 text-[10px] ${isUser ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                <span>Evaluating intake constraints & feasibility score...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Intake Prompts */}
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/60 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 whitespace-nowrap text-xs">
          <span className="text-slate-400 text-[11px] font-medium flex-shrink-0">Intake ideas:</span>
          {quickIntakeSuggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickChip(suggestion)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 text-[11px] transition-colors flex-shrink-0 shadow-2xs"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            id="ai-chat-input"
            type="text"
            placeholder="Tell me your available hours, today's focus, or ask to refine your daily goals..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-1 text-xs sm:text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
          />
          <button
            id="ai-chat-send-btn"
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
