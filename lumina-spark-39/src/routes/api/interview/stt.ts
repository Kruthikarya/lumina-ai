import { createFileRoute } from "@tanstack/react-router";

// Speech-to-text via Lovable AI Gateway (OpenAI).
export const Route = createFileRoute("/api/interview/stt")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const form = await request.formData();
        const file = form.get("file");
        if (!(file instanceof Blob) || file.size < 512) {
          return new Response("Empty or missing audio file", { status: 400 });
        }

        // Name the upload for its real container so OpenAI can decode it.
        const mime = (file.type || "audio/webm").split(";")[0];
        const ext =
          mime === "audio/mp4" || mime === "audio/x-m4a" ? "mp4" :
          mime === "audio/mpeg" ? "mp3" :
          mime === "audio/wav" || mime === "audio/x-wav" ? "wav" :
          mime === "audio/ogg" ? "ogg" :
          "webm";

        const upstream = new FormData();
        upstream.append("model", "openai/gpt-4o-mini-transcribe");
        upstream.append("file", file, `answer.${ext}`);

        const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}` }, // no Content-Type — fetch sets the boundary
          body: upstream,
        });

        if (!res.ok) {
          const body = await res.text().catch(() => "");
          return new Response(body || "Transcription failed", { status: res.status });
        }
        const data = (await res.json()) as { text?: string };
        return Response.json({ text: data.text ?? "" });
      },
    },
  },
});
