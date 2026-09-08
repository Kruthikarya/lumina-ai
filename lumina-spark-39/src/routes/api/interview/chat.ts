import { createFileRoute } from "@tanstack/react-router";

type Turn = { role: "interviewer" | "candidate"; text: string };

export const Route = createFileRoute("/api/interview/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const { topic, history, action, resume, config, payload } = (await request.json()) as {
          topic?: string;
          history?: Turn[];
          action?: "next" | "feedback" | "problem" | "review" | "run" | "report";
          resume?: { name?: string; role?: string; college?: string; skills?: string[]; company?: string };
          payload?: Record<string, unknown>;
          config?: {
            company?: string; role?: string; difficulty?: string;
            type?: string; language?: string; focus?: string[]; gender?: string;
          };
        };

        const t = topic || config?.type || "Behavioral";
        const turns = Array.isArray(history) ? history : [];
        const r = resume || {};
        const c = config || {};
        const contextLine = [
          c.company && `Company: ${c.company}`,
          c.role && `Role: ${c.role}`,
          c.difficulty && `Difficulty: ${c.difficulty}`,
          c.language && `Language: ${c.language}`,
          c.focus?.length && `Focus areas: ${c.focus.join(", ")}`,
        ].filter(Boolean).join(" · ");

        const candidateBrief = [
          r.name && `Candidate: ${r.name}`,
          r.college && `From: ${r.college}`,
          r.skills?.length && `Key skills: ${r.skills.slice(0, 8).join(", ")}`,
        ].filter(Boolean).join(" · ");

        let system: string;
        let userKick: string | null = null;

        if (action === "feedback") {
          system = `You are a senior interviewer at ${c.company || "a top tech company"}. Given the transcript of a ${t} interview for a ${c.role || "software"} role, return concise structured feedback as JSON with keys: overall (0-100), clarity (0-100), structure (0-100), depth (0-100), confidence (0-100), strength (1 sentence), improve (1 sentence), next_step (1 sentence). Respond with ONLY valid JSON.`;
        } else if (action === "report") {
          system = `You are the hiring panel lead at ${c.company || "a top tech company"} writing the post-interview report for a ${c.role || "Software Engineer"} candidate after a ${t} round (${c.difficulty || "Intermediate"}).
Base every judgement strictly on the transcript provided. Return JSON with keys:
overall (0-100),
categories (object with numeric 0-100 keys: technical_knowledge, problem_solving, communication, confidence, coding_quality, time_management, behavioral_skills, company_readiness),
strongest_areas (array of 2-3 short strings),
weakest_areas (array of 2-3 short strings),
weak_answers (array of up to 3 objects {question, issue, better_answer}),
coding_mistakes (array of up to 3 short strings; empty array if there was no coding),
study_topics (array of 4-6 short topic strings),
recommended_projects (array of 3 objects {title, why}),
recommended_difficulty (one of Beginner, Intermediate, Advanced, FAANG/Top Company),
next_interview (object {company, role, type, why}),
summary (2 sentences).
Respond with ONLY valid JSON.`;
        } else if (action === "problem") {
          system = `You are a coding interviewer at ${c.company || "a top tech company"} running a live coding round for a ${c.role || "Software Engineer"} candidate in ${c.language || "Java"}. Difficulty: ${c.difficulty || "Intermediate"}. Focus areas: ${(c.focus || []).join(", ") || "DSA"}.
Produce ONE realistic company-style coding problem as JSON with keys: title (string), topic (string), difficulty (Easy|Medium|Hard), statement (2-4 sentences), examples (array of {input, output, explanation}), constraints (array of strings), hints (array of 2 short strings), starter_code (a ${c.language || "Java"} function/class skeleton with a TODO comment), test_cases (array of 4 objects {name, input, expected, hidden: boolean} — first two visible, last two hidden edge cases), optimal_complexity (object {time, space}). Respond with ONLY valid JSON.`;
        } else if (action === "run") {
          system = `You are a deterministic code execution engine and static analyser for ${c.language || "Java"}. You are given a problem, the candidate's code, a list of test cases and optionally a custom input.
Carefully reason about what the code actually does — do NOT assume it is correct.
Return JSON with keys:
status (one of "passed", "failed", "runtime_error", "compilation_error"),
compile_error (string or null),
results (array, one per given test case, each {name, input, expected, actual, passed: boolean, error: string|null, runtime_ms: number}),
custom_output (string or null — output for the custom input if one was given),
stdout (string — a short console log of the run),
time_complexity (string), space_complexity (string),
edge_cases (array of up to 3 short strings about edge cases handled or missed).
Respond with ONLY valid JSON.`;
        } else if (action === "review") {
          system = `You are a strict but fair coding interviewer at ${c.company || "a top tech company"}. Review the candidate's ${c.language || "Java"} solution to the given problem, including any test results supplied. Return JSON with keys: overall (0-100), correctness (0-100), efficiency (0-100), readability (0-100), edge_cases (0-100), best_practices (0-100), time_complexity (string), space_complexity (string), complexity (string summary), strength (1 sentence), improve (1 sentence), next_step (1 sentence). Respond with ONLY valid JSON.`;
        } else {
          system = `You are a calm, professional ${c.gender === "female" ? "female" : "male"} interviewer at ${c.company || "a top tech company"} conducting a ${t} interview for the role of ${c.role || "Software Engineer"}.${contextLine ? ` ${contextLine}.` : ""}${candidateBrief ? ` ${candidateBrief}.` : ""}
Tailor every question to that exact company's real interview style, the role, and the difficulty level.
This is an ADAPTIVE conversation, never a fixed script. Listen to the candidate's last answer and react to it:
  - If they named a technology, data structure or trade-off, probe it ("Why a HashMap instead of sorting?").
  - If they gave an approach, ask about its time/space complexity, then how they'd optimise it.
  - If the answer was vague or incomplete, ask a sharper, narrower follow-up on the same topic instead of moving on.
  - If the answer was strong, escalate difficulty or shift to a new area.
Roughly plan a 5-6 question arc: warm opening, a resume/skills-driven question, a core ${t} question for ${c.company || "the company"}, at least two genuine follow-ups derived from their own words, and a closing fit question.
Ask ONE question at a time, under 40 words. Briefly acknowledge their previous answer in at most one short sentence before the next question. When the arc is complete, end with: "That wraps up our session — thanks!" Do not use markdown or numbering.`;
          if (turns.length === 0) userKick = "Please begin the interview with your first question.";
        }

        const messages: { role: string; content: string }[] = [
          { role: "system", content: system },
          ...turns.map((tn) => ({
            role: tn.role === "interviewer" ? "assistant" : "user",
            content: tn.text,
          })),
        ];
        if (userKick) messages.push({ role: "user", content: userKick });
        if (action === "problem" && turns.length === 0) {
          messages.push({ role: "user", content: "Give me the coding problem now." });
        }
        if (action === "run" || action === "report") {
          messages.push({ role: "user", content: JSON.stringify(payload ?? {}) });
        }

        const wantsJson =
          action === "feedback" || action === "problem" || action === "review" ||
          action === "run" || action === "report";

        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-5-mini",
            messages,
            ...(wantsJson ? { response_format: { type: "json_object" } } : {}),
          }),
        });

        if (!res.ok) {
          const body = await res.text().catch(() => "");
          return new Response(body || "Chat failed", { status: res.status });
        }
        const data = await res.json();
        const content: string = data?.choices?.[0]?.message?.content ?? "";

        if (wantsJson) {
          let parsed: unknown = null;
          try { parsed = JSON.parse(content); } catch { parsed = { raw: content }; }
          if (action === "feedback") return Response.json({ feedback: parsed });
          if (action === "problem") return Response.json({ problem: parsed });
          if (action === "run") return Response.json({ run: parsed });
          if (action === "report") return Response.json({ report: parsed });
          return Response.json({ review: parsed });
        }

        const done = /wraps up our session/i.test(content);
        return Response.json({ question: content.trim(), done });
      },
    },
  },
});
