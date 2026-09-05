import { TaskItem, ChatMessage, UserProfile } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  focusTimeToday: 3.5,
  energyLevel: 'High',
  skillLevel: 'Intermediate',
  currentTrack: 'Full-Stack Development & Learning',
  primaryObjective: 'Build and ship daily milestones without burnout',
};

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Scope core auth flow & API contracts',
    description: 'Sketch the request/response payloads and token refresh lifecycle before writing any code.',
    category: 'Deep Work',
    status: 'completed',
    priority: 'high',
    estimatedMinutes: 45,
    actualMinutes: 40,
    feasibilityTag: 'Realistic',
    uniquenessTag: 'High Impact',
    subtasks: [
      { id: 'sub-1', text: 'Document login/logout payload schema', completed: true },
      { id: 'sub-2', text: 'Verify JWT expiration and refresh token boundary', completed: true },
    ],
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    source: 'ai-mentor',
  },
  {
    id: 'task-2',
    title: 'Implement database indexing for query speedup',
    description: 'Add composite indexes to the users and transactions tables to prevent table scans.',
    category: 'Deep Work',
    status: 'in-progress',
    priority: 'high',
    estimatedMinutes: 50,
    feasibilityTag: 'Realistic',
    uniquenessTag: 'Core Foundation',
    subtasks: [
      { id: 'sub-3', text: 'Analyze slow query logs in staging', completed: true },
      { id: 'sub-4', text: 'Run migration and verify EXPLAIN ANALYZE', completed: false },
    ],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    source: 'ai-mentor',
  },
  {
    id: 'task-3',
    title: 'Read Chapter 4 on Distributed Consensus (Raft)',
    description: 'Understand leader election and log replication principles with personal margin notes.',
    category: 'Learning',
    status: 'todo',
    priority: 'medium',
    estimatedMinutes: 35,
    feasibilityTag: 'Quick Win',
    uniquenessTag: 'High Impact',
    subtasks: [
      { id: 'sub-5', text: 'Read through section 4.1 to 4.4', completed: false },
      { id: 'sub-6', text: 'Summarize election safety invariant in 3 bullets', completed: false },
    ],
    createdAt: new Date().toISOString(),
    source: 'ai-mentor',
  },
  {
    id: 'task-4',
    title: 'Team pull request reviews & architectural comments',
    description: 'Review two incoming feature branches for performance and edge-case error handling.',
    category: 'Review',
    status: 'todo',
    priority: 'medium',
    estimatedMinutes: 30,
    feasibilityTag: 'Realistic',
    uniquenessTag: 'Core Foundation',
    subtasks: [
      { id: 'sub-7', text: 'Review PR #42 (Webhook listener)', completed: false },
      { id: 'sub-8', text: 'Review PR #45 (Cache invalidation)', completed: false },
    ],
    createdAt: new Date().toISOString(),
    source: 'manual',
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: `👋 **Welcome to your Daily Goal Architect!**

To ensure we build a day that's **truly feasible and high-leverage** (rather than dumping a generic, overwhelming 10-task list), let's do a quick **intake first**:

1. **Available Time**: How many deep-focus hours do you actually have available today?
2. **Current Focus**: What main project, skill, or academic objective are you tackling?
3. **Energy / Skill Level**: Are you at peak energy or tired, and is this familiar or completely new terrain?

*Once I have your constraints, I'll evaluate the feasibility score and give you 3–4 tailored, high-impact goals ready to import directly to your task board.*`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];
