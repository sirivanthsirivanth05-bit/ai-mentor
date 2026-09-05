import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

const SYSTEM_MENTOR_INSTRUCTION = `You are "GoalMentor AI", an expert task planning and daily goal architect designed to eliminate generic, superficial task lists.

CORE METHODOLOGY:
1. Intake-First Structure:
   - Before generating final daily goals or project tasks, you ALWAYS know the user's available time/energy today, their skill level/focus area, and their concrete priorities.
   - If the user hasn't provided their current focus, timeline (e.g. 2 hours vs 8 hours), or skill constraints, do a crisp, friendly 1-turn intake. Never dump 10 generic ideas immediately without understanding context.
   - Keep intake separate from final plan generation unless the user already explicitly supplied timeline + skills + focus.

2. Feasibility Rating & Workload Reality Check:
   - Students and builders overwhelmingly propose either infeasible (12-hour work squeezed into 2 hours) or overdone/vague ideas.
   - Explicitly evaluate feasibility with a score (1-10) and an honest, constructive critique (e.g., "7/10: Good scope, but step 2 typically takes 3x longer than expected—let's bound it to 45 mins").

3. Uniqueness & Leverage Flags:
   - Rate uniqueness and high-leverage value:
     * "High-Leverage & Distinct" (moves the needle, avoids boilerplate)
     * "Solid Essential Foundation" (standard but necessary)
     * "Scope-Creep Trap" (overengineered for a daily goal)
     * "Common Pitfall" (e.g., spending 3 hours tweaking CSS instead of building the core logic)

4. Guardrails (Crucial for Learning & Productivity):
   - Never write complete copy-paste code solutions; instead, provide mental models, architectural checkpoints, and step-by-step milestones so the user actually learns and executes.
   - Enforce realistic human cognitive limits (recommend max 3-5 core daily goals, totaling 2-5 hours of deep work).
   - Reject ethically shaky or counterproductive ideas.

5. Structured Output when Proposing Daily Goals:
   When you and the user are ready with daily goals/tasks, provide both an encouraging, insightful explanation AND an embedded JSON block inside triple backticks with tag \`\`\`json-daily-goals
   {
     "dailyFocusTheme": "...",
     "feasibilityScore": 8,
     "feasibilitySummary": "...",
     "uniquenessRating": "High-Leverage",
     "guardrailAdvice": "...",
     "goals": [
       {
         "id": "unique-id",
         "title": "...",
         "description": "...",
         "category": "Deep Work" | "Learning" | "Admin" | "Review",
         "estimatedMinutes": 45,
         "priority": "high" | "medium" | "low",
         "feasibilityTag": "Realistic" | "Stretch" | "Quick Win",
         "uniquenessTag": "High Impact" | "Core Foundation" | "Polish",
         "subtasks": ["subtask 1", "subtask 2"]
       }
     ]
   }
   \`\`\`
`;

// 1. Conversational Chat Route (Intake-first daily goal mentor)
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { messages, userProfile, currentTasks } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing or invalid messages array" });
    }

    const ai = getGeminiClient();

    // Format chat history for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Inject contextual awareness if current tasks or user profile exists
    let contextualNote = "";
    if (userProfile && (userProfile.focusTimeToday || userProfile.skillLevel || userProfile.currentTrack)) {
      contextualNote += `\n[Context: Focus time available today: ${userProfile.focusTimeToday || 'unspecified'} hrs, Skill Level: ${userProfile.skillLevel || 'intermediate'}, Track/Interests: ${userProfile.currentTrack || 'general productivity'}]`;
    }
    if (currentTasks && currentTasks.length > 0) {
      contextualNote += `\n[User currently has ${currentTasks.length} tasks on their board: ${currentTasks.map((t: any) => t.title).slice(0, 5).join("; ")}]`;
    }

    const systemWithContext = SYSTEM_MENTOR_INSTRUCTION + contextualNote;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contents,
      config: {
        systemInstruction: systemWithContext,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I'm here to help you structure feasible, high-impact daily goals. What are you looking to tackle today, and how much focused time do you have?";

    // Check if reply contains json-daily-goals block
    let parsedGoals = null;
    const jsonMatch = replyText.match(/```json-daily-goals\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        parsedGoals = JSON.parse(jsonMatch[1]);
      } catch (err) {
        console.warn("Failed to parse embedded goals JSON:", err);
      }
    }

    return res.json({
      text: replyText,
      extractedGoals: parsedGoals,
    });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate AI response",
    });
  }
});

// 2. Direct Intake & Goal Generation (Instant structured flow)
app.post("/api/generate-daily-goals", async (req: Request, res: Response) => {
  try {
    const { primaryObjective, availableHours, energyLevel, skillLevel, interests, constraints } = req.body;

    const ai = getGeminiClient();

    const prompt = `Perform an intake-grounded goal synthesis.
User Objective: ${primaryObjective || "Boost daily project progress"}
Available Deep Focus Time: ${availableHours || 3} hours
Energy Level: ${energyLevel || "Normal"}
Skill Level: ${skillLevel || "Intermediate"}
Key Interests / Tech Stack: ${interests || "Software, Product, Academic"}
Known Constraints / Deadlines: ${constraints || "None specified"}

Rules:
1. Do not give generic 10-item lists.
2. Produce exactly 3 to 5 realistic, high-leverage daily goals fitting strictly within ${availableHours || 3} hours total.
3. Include explicit feasibility assessment (1-10) with realistic warnings of what commonly trips people up.
4. Include uniqueness & leverage flags to call out if an idea is high-leverage or overdone/boilerplate.
5. Provide guardrails: learning reminders to stop them from seeking full automated code dumps and keep them engaged.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_MENTOR_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dailyFocusTheme: {
              type: Type.STRING,
              description: "Punchy, motivating theme for today's session",
            },
            feasibilityScore: {
              type: Type.INTEGER,
              description: "Feasibility score between 1 and 10 based on time and workload reality",
            },
            feasibilitySummary: {
              type: Type.STRING,
              description: "Realistic critique of why this is feasible or what pitfalls to avoid",
            },
            uniquenessRating: {
              type: Type.STRING,
              description: "E.g. High-Leverage & Distinct, Solid Foundation, or Pragmatic Sprint",
            },
            guardrailAdvice: {
              type: Type.STRING,
              description: "Mentor advice preventing shortcuts, code-dumping, and cognitive burnout",
            },
            totalEstimatedMinutes: {
              type: Type.INTEGER,
              description: "Sum of estimated minutes across all goals",
            },
            goals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: {
                    type: Type.STRING,
                    description: "Deep Work, Learning, Admin, or Review",
                  },
                  estimatedMinutes: { type: Type.INTEGER },
                  priority: { type: Type.STRING, description: "high, medium, or low" },
                  feasibilityTag: {
                    type: Type.STRING,
                    description: "Realistic, Stretch, or Quick Win",
                  },
                  uniquenessTag: {
                    type: Type.STRING,
                    description: "High Impact, Core Foundation, or Polish",
                  },
                  subtasks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["title", "description", "category", "estimatedMinutes", "priority", "subtasks"],
              },
            },
          },
          required: [
            "dailyFocusTheme",
            "feasibilityScore",
            "feasibilitySummary",
            "uniquenessRating",
            "guardrailAdvice",
            "totalEstimatedMinutes",
            "goals",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/generate-daily-goals:", error);
    return res.status(500).json({ error: error.message || "Failed to generate daily goals" });
  }
});

// 3. Compact Universal Prompt Optimizer ("Make as a short prompt to use everyone to generate a quick, structured idea for any new project")
app.post("/api/craft-prompt", async (req: Request, res: Response) => {
  try {
    const { userNeed, format = "project_idea" } = req.body;
    const ai = getGeminiClient();

    const prompt = `The user wants a short, reusable, highly effective prompt following this proven framework:
- Intake-first check (interests/skills/timeline)
- Feasibility rating (1-10) & Workload realism
- Uniqueness & High-leverage flags (calling out overdone/infeasible traps)
- Guardrails against full code dumps & burnout

User's domain or intent: "${userNeed || 'Generate a structured idea and daily goals for a new software/learning project'}"

Return JSON:
1. "optimizedPrompt": A crisp, reusable copy-paste prompt (around 80-120 words) that anyone can paste into any LLM to get a structured, realistic project idea or daily goal plan without generic slop.
2. "whyItWorks": 2-3 bullet points explaining how the intake-first and feasibility constraints prevent generic responses.
3. "sampleExecution": A quick demonstration of running this exact prompt on the user's intent.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedPrompt: { type: Type.STRING },
            whyItWorks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            sampleExecution: {
              type: Type.OBJECT,
              properties: {
                projectTitle: { type: Type.STRING },
                intakeQuestionsAsked: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                feasibilityRating: { type: Type.STRING },
                uniquenessVerdict: { type: Type.STRING },
                immediateFirstSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["projectTitle", "intakeQuestionsAsked", "feasibilityRating", "uniquenessVerdict", "immediateFirstSteps"],
            },
          },
          required: ["optimizedPrompt", "whyItWorks", "sampleExecution"],
        },
      },
    });

    return res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error in /api/craft-prompt:", error);
    return res.status(500).json({ error: error.message || "Failed to generate optimized prompt" });
  }
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Vite Middleware & Static Serving Setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
