/**
 * LUMINA AI — Frontend service stub.
 *
 * Designed to plug into free AI providers later:
 *   - Google Gemini API (Free Tier)
 *   - OpenRouter Free Models
 *   - HuggingFace Inference API
 *
 * Each function returns a Promise<string | object>, so the UI can render
 * loading states today and swap in real fetch() calls when keys are wired.
 */

export type AIProvider = "gemini" | "openrouter" | "huggingface";

export interface AIConfig {
  provider: AIProvider;
  apiKey?: string;
  model?: string;
}

const defaultConfig: AIConfig = {
  provider: "gemini",
  model: "gemini-1.5-flash",
};

async function fakeDelay<T>(value: T, ms = 1200): Promise<T> {
  await new Promise((r) => setTimeout(r, ms));
  return value;
}

/* ---------- Resume parsing ---------- */
export interface ResumeAnalysis {
  score: number;
  skills: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export async function parseResume(_file: File | string, _cfg: AIConfig = defaultConfig): Promise<ResumeAnalysis> {
  return fakeDelay({
    score: 87,
    skills: ["React", "TypeScript", "Python", "Node.js", "PostgreSQL"],
    strengths: ["Strong product execution", "Quantified impact on 4/5 projects", "Modern stack alignment"],
    weaknesses: ["Missing leadership signals", "Generic professional summary", "No certifications"],
    suggestions: [
      "Add 1-2 leadership / ownership bullet points",
      "Replace summary with role-specific positioning",
      "List recent certifications or relevant coursework",
    ],
  });
}

/* ---------- Skill Gap Analysis ---------- */
export interface SkillGap { skill: string; current: number; target: number; why: string }
export async function analyzeSkillGap(targetRole: string, _cfg: AIConfig = defaultConfig): Promise<SkillGap[]> {
  return fakeDelay([
    { skill: "System Design", current: 35, target: 80, why: `Required by 9 ${targetRole} roles` },
    { skill: "Kubernetes", current: 20, target: 65, why: "Trending DevOps skill" },
    { skill: "GraphQL", current: 45, target: 75, why: "Complements your React stack" },
  ]);
}

/* ---------- Career Roadmap ---------- */
export interface RoadmapMilestone { quarter: string; title: string; items: string[] }
export async function generateRoadmap(goal: string, _cfg: AIConfig = defaultConfig): Promise<RoadmapMilestone[]> {
  return fakeDelay([
    { quarter: "Q1", title: "Foundations", items: ["DSA + Patterns", "2 portfolio projects", `Aligned to: ${goal}`] },
    { quarter: "Q2", title: "Specialization", items: ["Deep-dive 1 stack", "1 paid internship"] },
    { quarter: "Q3", title: "Production", items: ["OSS contribution", "5 mock interviews"] },
    { quarter: "Q4", title: "Placement", items: ["Apply to 20 companies", "Negotiate offer"] },
  ]);
}

/* ---------- Project / Internship / Hackathon recommendations ---------- */
export async function recommendProjects(_cfg: AIConfig = defaultConfig) {
  return fakeDelay([
    { title: "AI Resume Critique Bot", stack: ["Next.js", "OpenAI"], match: 94 },
    { title: "Realtime Whiteboard", stack: ["React", "WebRTC"], match: 86 },
  ]);
}
export async function recommendInternships(_cfg: AIConfig = defaultConfig) {
  return fakeDelay([
    { title: "ML Research Intern @ OpenAI", match: 92 },
    { title: "Frontend Intern @ Vercel", match: 88 },
  ]);
}
export async function recommendHackathons(_cfg: AIConfig = defaultConfig) {
  return fakeDelay([
    { name: "Smart India Hackathon", match: 91 },
    { name: "HackMIT", match: 84 },
  ]);
}

/* ---------- Mock Interview ---------- */
export interface InterviewQuestion { id: string; q: string; category: string }
export async function generateInterview(type: string, _cfg: AIConfig = defaultConfig): Promise<InterviewQuestion[]> {
  return fakeDelay([
    { id: "1", q: "Tell me about a time you led a team under pressure.", category: type },
    { id: "2", q: "Design a URL shortener for 100M URLs.", category: type },
    { id: "3", q: "What's the time complexity of merging k sorted lists?", category: type },
  ]);
}

/* ---------- Assignment generation ---------- */
export async function generateAssignment(topic: string, _cfg: AIConfig = defaultConfig) {
  return fakeDelay({
    title: `${topic} — Practical Set #4`,
    prompt: `Build a small project that demonstrates ${topic}. Submit code + 200-word reflection.`,
    rubric: ["Correctness (40)", "Code quality (30)", "Reflection (20)", "Bonus (10)"],
  });
}

/* ---------- Eligibility prediction ---------- */
export async function predictEligibility(_cfg: AIConfig = defaultConfig) {
  return fakeDelay({
    eligibleCount: 14,
    top: ["Google", "Microsoft", "Stripe", "Figma", "Linear"],
    confidence: 0.86,
  });
}

/* ---------- Career Assistant Chat ---------- */
export async function chatWithAssistant(messages: { role: "user" | "assistant"; content: string }[], _cfg: AIConfig = defaultConfig): Promise<string> {
  const last = messages[messages.length - 1]?.content ?? "";
  const lower = last.toLowerCase();
  let reply = "I'm here to help with your career — try asking about resume tips, mock interviews or roadmaps.";
  if (lower.includes("resume")) reply = "Upload your resume in the Resume AI tab. I'll score it, extract skills and suggest 3 high-impact rewrites.";
  else if (lower.includes("interview")) reply = "Start a Behavioral or DSA round in Mock Interview. I'll give structured feedback in <30s.";
  else if (lower.includes("intern")) reply = "Based on your profile, top matches are OpenAI ML (92%), Vercel Frontend (88%) and Snowflake Data (81%).";
  else if (lower.includes("roadmap")) reply = "Your Q3 focus: ship 1 OSS PR and complete 5 mocks. That alone bumps readiness +9 points.";
  return fakeDelay(reply, 800);
}
