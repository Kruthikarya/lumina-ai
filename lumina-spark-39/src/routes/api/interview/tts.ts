import { createFileRoute } from "@tanstack/react-router";

// Text-to-speech via Lovable AI Gateway (OpenAI). Male voice: "onyx".
export const Route = createFileRoute("/api/interview/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const { text, voice } = (await request.json()) as {
          text?: string;
          voice?: string;
        };
        if (!text || typeof text !== "string") {
          return new Response("`text` is required", { status: 400 });
        }

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini-tts",
            voice: voice || "onyx", // male, deep — the interviewer's default voice
            input: text,
            response_format: "mp3",
            instructions:
              "Speak as a calm, professional male technical interviewer. Warm, measured pace, clear articulation.",
          }),
        });

        if (!upstream.ok) {
          const body = await upstream.text().catch(() => "");
          return new Response(body || "TTS failed", { status: upstream.status });
        }
        return new Response(upstream.body, {
          headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});
