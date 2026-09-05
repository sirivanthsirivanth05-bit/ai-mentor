import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  BatteryMedium, 
  Brain, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Plus, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { DailyGoalPlan, UserProfile } from '../types';
import { formatMinutes } from '../utils/helpers';

interface QuickIntakeViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
  onImportGoals: (plan: DailyGoalPlan) => void;
}

export const QuickIntakeView: React.FC<QuickIntakeViewProps> = ({
  userProfile,
  onUpdateProfile,
  onImportGoals,
}) => {
  const [objective, setObjective] = useState(userProfile.primaryObjective || 'Ship core milestone for web app');
  const [availableHours, setAvailableHours] = useState(userProfile.focusTimeToday || 3.5);
  const [energyLevel, setEnergyLevel] = useState(userProfile.energyLevel || 'High');
  const [skillLevel, setSkillLevel] = useState(userProfile.skillLevel || 'Intermediate');
  const [interests, setInterests] = useState(userProfile.currentTrack || 'React, Node.js, System Design');
  const [constraints, setConstraints] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<DailyGoalPlan | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!objective.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    // Save profile state
    onUpdateProfile({
      primaryObjective: objective,
      focusTimeToday: availableHours,
      energyLevel: energyLevel as any,
      skillLevel: skillLevel as any,
      currentTrack: interests,
    });

    try {
      const res = await fetch('/api/generate-daily-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryObjective: objective,
          availableHours,
          energyLevel,
          skillLevel,
          interests,
          constraints,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setGeneratedPlan(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to generate daily goals. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Intake-First Rapid Synthesizer
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Generate Feasible Daily Goals
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Specify your real constraints upfront so the AI models your workload realistically, weeds out overambitious traps, and crafts a high-leverage daily sprint.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Intake Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
            <span>Step 1: Your Intake Context</span>
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4">
            
            {/* Primary Objective */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                What do you want to accomplish today?
              </label>
              <input
                id="intake-objective-input"
                type="text"
                required
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="e.g. Build SQLite caching layer for image generator"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            {/* Focus Hours Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  Available Deep Work Time:
                </label>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {availableHours} Hours
                </span>
              </div>
              <input
                id="intake-hours-slider"
                type="range"
                min="0.5"
                max="8"
                step="0.5"
                value={availableHours}
                onChange={(e) => setAvailableHours(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>30m (Micro-Sprint)</span>
                <span>3-4h (Optimal)</span>
                <span>8h (Full Day)</span>
              </div>
            </div>

            {/* Energy & Skill Level */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <BatteryMedium className="w-3.5 h-3.5 text-amber-500" />
                  Energy Level
                </label>
                <select
                  id="intake-energy-select"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="High">High (Fresh & Alert)</option>
                  <option value="Medium">Medium (Steady)</option>
                  <option value="Low">Low (Tired / Recovering)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Brain className="w-3.5 h-3.5 text-purple-600" />
                  Skill Familiarity
                </label>
                <select
                  id="intake-skill-select"
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Beginner">Beginner (Need clarity)</option>
                  <option value="Intermediate">Intermediate (Comfortable)</option>
                  <option value="Advanced">Advanced (High Velocity)</option>
                </select>
              </div>
            </div>

            {/* Track / Tech Stack */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tech Stack / Domain / Interests
              </label>
              <input
                id="intake-track-input"
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g. Next.js, Tailwind, PostgreSQL, Algorithms"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            {/* Constraints */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Known Constraints or Deadlines (optional)
              </label>
              <input
                id="intake-constraints-input"
                type="text"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="e.g. Must finish before 4 PM standup; no external DB allowed"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <button
              id="intake-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Realistic Goals...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesize Daily Goals</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Right Column: Generated Plan or Placeholder */}
        <div className="lg:col-span-7 space-y-4">
          
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {errorMsg}
            </div>
          )}

          {!generatedPlan && !isLoading && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center h-full flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Ready for Intake
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Fill in your available time and focus on the left. The AI mentor will construct a feasible daily plan with explicit feasibility ratings, uniqueness flags, and subtask milestones.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center h-full flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
              <h3 className="text-sm font-bold text-slate-800 font-display">
                Analyzing Workload & Constraints...
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Calculating cognitive load, weeding out overambitious scope creep, and calibrating time blocks for your {availableHours}-hour window.
              </p>
            </div>
          )}

          {generatedPlan && !isLoading && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              
              {/* Plan Header */}
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
                    Synthesized Daily Plan
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    {generatedPlan.dailyFocusTheme}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {generatedPlan.goals.length} Goals • Total: {formatMinutes(generatedPlan.totalEstimatedMinutes)} of {availableHours}h allotted
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Feasibility: {generatedPlan.feasibilityScore}/10
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                    {generatedPlan.uniquenessRating}
                  </span>
                </div>
              </div>

              {/* Workload Reality Check & Guardrail Advice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="font-semibold text-slate-700 flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Feasibility & Pitfalls
                  </p>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {generatedPlan.feasibilitySummary}
                  </p>
                </div>

                <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                  <p className="font-semibold text-indigo-900 flex items-center gap-1 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    Learning Guardrail
                  </p>
                  <p className="text-indigo-800/90 leading-relaxed text-[11px]">
                    {generatedPlan.guardrailAdvice}
                  </p>
                </div>
              </div>

              {/* Goal List */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Sprint Goals to Import:
                </p>

                {generatedPlan.goals.map((goal, idx) => (
                  <div key={idx} className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900">{idx + 1}. {goal.title}</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-white border border-slate-200 text-slate-700">
                            {goal.category}
                          </span>
                          {goal.feasibilityTag && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {goal.feasibilityTag}
                            </span>
                          )}
                          {goal.uniquenessTag && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              {goal.uniquenessTag}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">{goal.description}</p>
                        {goal.subtasks && goal.subtasks.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {goal.subtasks.map((st, sIdx) => (
                              <span key={sIdx} className="inline-flex items-center text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                                • {st}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <span className="text-slate-700 font-bold text-xs bg-white px-2 py-1 rounded border border-slate-200 flex-shrink-0">
                        {formatMinutes(goal.estimatedMinutes)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Import Action */}
              <button
                id="quick-import-all-btn"
                onClick={() => onImportGoals(generatedPlan)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Import All {generatedPlan.goals.length} Goals into My Task Board</span>
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
