export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskCategory = 'Deep Work' | 'Learning' | 'Admin' | 'Review' | 'Personal';

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedMinutes: number;
  actualMinutes?: number;
  feasibilityTag?: string;
  uniquenessTag?: string;
  subtasks?: Subtask[];
  createdAt: string;
  completedAt?: string;
  source?: 'ai-mentor' | 'manual' | 'intake-synthesis';
}

export interface GoalProposal {
  title: string;
  description: string;
  category: TaskCategory;
  estimatedMinutes: number;
  priority: TaskPriority;
  feasibilityTag?: string;
  uniquenessTag?: string;
  subtasks: string[];
}

export interface DailyGoalPlan {
  dailyFocusTheme: string;
  feasibilityScore: number;
  feasibilitySummary: string;
  uniquenessRating: string;
  guardrailAdvice: string;
  totalEstimatedMinutes: number;
  goals: GoalProposal[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  extractedGoals?: DailyGoalPlan | null;
}

export interface UserProfile {
  focusTimeToday: number;
  energyLevel: 'High' | 'Medium' | 'Low';
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  currentTrack: string;
  primaryObjective: string;
}

export interface PromptCraftResult {
  optimizedPrompt: string;
  whyItWorks: string[];
  sampleExecution: {
    projectTitle: string;
    intakeQuestionsAsked: string[];
    feasibilityRating: string;
    uniquenessVerdict: string;
    immediateFirstSteps: string[];
  };
}
