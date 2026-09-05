import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Terminal, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Play
} from 'lucide-react';
import { PromptCraftResult } from '../types';

export const PromptOptimizerView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [userInput, setUserInput] = useState('Fullstack web application for task management');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PromptCraftResult | null>(null);

  // The perfected, universal short prompt that anyone can copy & use:
  const UNIVERSAL_SHORT_PROMPT = `Act as a senior mentor. When I propose a new project or daily goal:
1. Intake First: Before generating ideas or full plans, ask 3 brief questions about my available hours/timeline, existing tech skills, and core interest.
2. Feasibility Rating: Once answered, rate feasibility (1–10) and call out realistic scope risks or time traps.
3. Uniqueness Flag: Flag if the idea is high-leverage vs generic/overdone.
4. Guardrails: Propose 3–4 bite-sized execution milestones with mental models, NOT full copy-paste code.`;

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleCraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/craft-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userNeed: userInput }),
      });
      if (!res.ok) throw new Error('Failed to generate optimized prompt');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 mb-2">
            <Terminal className="w-3.5 h-3.5" />
            Compact Universal Prompt Generator
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            The Intake-First Project Idea Prompt
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Eliminate generic 10-item lists and useless GPT wrappers. This refined, battle-tested prompt enforces conversational intake, feasibility ratings (1–10), uniqueness flags, and learning guardrails.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Universal Prompt Card & Preset Launcher */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Main Copyable Short Prompt */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-md border border-slate-800 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Universal Short Prompt (Copy &amp; Use Anywhere)
                </span>
              </div>

              <button
                onClick={() => handleCopyPrompt(UNIVERSAL_SHORT_PROMPT)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
              </button>
            </div>

            <pre className="text-xs font-mono text-slate-200 bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {UNIVERSAL_SHORT_PROMPT}
            </pre>

            <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Enforces Intake Step 1</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Feasibility Score 1–10</span>
              </div>
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Flags Overdone Traps</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                <span>No Full Code Dumps</span>
              </div>
            </div>
          </div>

          {/* Quick Customizer Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Test or Tailor for a Specific Project
            </h3>
            
            <form onSubmit={handleCraft} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Domain or Subject:
                </label>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="e.g. Distributed key-value store in Go, or High school physics simulation"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-wrap gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setUserInput('React & Node.js task planner with offline sync')}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  App Development
                </button>
                <button
                  type="button"
                  onClick={() => setUserInput('Machine learning model for audio transcription')}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  AI / Data Science
                </button>
                <button
                  type="button"
                  onClick={() => setUserInput('Academic computer science senior capstone project')}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  Academic Capstone
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Generating Tailored Prompt &amp; Simulation...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Optimization &amp; Simulated Execution</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Execution Output or Explanation */}
        <div className="lg:col-span-6 space-y-4">
          
          {!result && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 font-display">
                How This Solves the "10 Generic Project Ideas" Problem
              </h3>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-slate-800">Forced Intake Turn:</strong> When prompted without constraints, LLMs default to generic suggestions ("Make a weather app", "Make a calculator"). Enforcing intake as turn #1 guarantees the model calibrates to true available hours and skill level.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-slate-800">Feasibility Reality Check:</strong> Students and indie builders notoriously bite off more than they can chew. The prompt forces a 1–10 rating and reality checks time estimates.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-slate-800">Uniqueness Flagging:</strong> Differentiates high-leverage architectural learning from overdone boilerplate templates.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <strong className="text-slate-800">Learning Guardrails:</strong> Stops the model from dumping full code that ruins the educational learning outcome, fostering genuine skill acquisition.
                  </div>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              
              {/* Tailored Prompt */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                    Tailored Prompt for Your Domain
                  </span>
                  <button
                    onClick={() => handleCopyPrompt(result.optimizedPrompt)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {result.optimizedPrompt}
                </div>
              </div>

              {/* Why It Works */}
              <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 text-xs">
                <p className="font-bold text-indigo-950 mb-1">Why this prompt structure excels:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-indigo-900/90 text-[11px]">
                  {result.whyItWorks.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Simulated Execution */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Simulated Mentor Execution:
                  </h4>
                  <span className="text-xs font-bold text-indigo-700">
                    {result.sampleExecution.projectTitle}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-700 block text-[11px]">
                      Step 1 Intake Questions Asked:
                    </span>
                    <ul className="list-disc pl-4 text-slate-600 text-[11px] space-y-0.5 mt-0.5">
                      {result.sampleExecution.intakeQuestionsAsked.map((q, idx) => (
                        <li key={idx}>{q}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200 flex-wrap">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Feasibility: {result.sampleExecution.feasibilityRating}
                    </span>
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Verdict: {result.sampleExecution.uniquenessVerdict}
                    </span>
                  </div>

                  <div className="pt-1">
                    <span className="font-semibold text-slate-700 block text-[11px]">
                      Immediate First Milestones:
                    </span>
                    <ol className="list-decimal pl-4 text-slate-600 text-[11px] space-y-0.5 mt-0.5">
                      {result.sampleExecution.immediateFirstSteps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
