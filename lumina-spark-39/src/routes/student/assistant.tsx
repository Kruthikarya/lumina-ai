import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { chatWithAssistant } from "@/lib/ai-service";

export const Route = createFileRoute("/student/assistant")({
  head: () => ({ meta: [{ title: "AI Career Assistant · LUMINA AI" }] }),
  component: Assistant,
});

type Msg = { role: "user" | "assistant"; content: string };

const suggestions = [
  "How can I improve my resume score?",
  "Suggest internships that match my profile",
  "What should I focus on this quarter?",
  "Prepare me for a behavioral interview",
];

function Assistant() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi Aarav 👋 I'm Lumi, your AI career coach. Ask me about resumes, mocks, roadmaps or opportunities." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    const reply = await chatWithAssistant(next);
    setMessages([...next, { role: "assistant", content: reply }]);
    setLoading(false);
  }

  return (
    <DashboardLayout title="AI Career Assistant" subtitle="Personalized guidance powered by LUMINA AI.">
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <Card className="flex h-[68vh] flex-col p-0">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl gradient-emerald"><Bot className="h-5 w-5 text-white" /></div>
              <div>
                <p className="font-display font-semibold">Lumi · AI Coach</p>
                <p className="text-xs text-muted-foreground">Powered by Gemini · responses are illustrative</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />Online
            </span>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={"flex gap-3 " + (m.role === "user" ? "flex-row-reverse" : "")}>
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className={m.role === "user" ? "bg-primary/15 text-primary" : "gradient-emerald text-white"}>
                    {m.role === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className={"max-w-[78%] rounded-2xl px-4 py-2.5 text-sm " + (m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8"><AvatarFallback className="gradient-emerald text-white"><Sparkles className="h-4 w-4" /></AvatarFallback></Avatar>
                <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:120ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:240ms]" />
                </div>
              </div>
            )}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2 border-t border-border p-3">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything about your career…" className="h-11 rounded-full bg-muted" />
            <Button type="submit" disabled={loading} className="h-11 rounded-full gradient-emerald text-white"><Send className="h-4 w-4" /></Button>
          </form>
        </Card>

        <Card className="p-5">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Try asking</h3>
          <div className="mt-3 space-y-2">
            {suggestions.map((s) => (
              <button key={s} onClick={() => send(s)} className="block w-full rounded-xl border border-border p-3 text-left text-sm transition hover:border-primary/40 hover:bg-primary/5">{s}</button>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <p className="text-xs font-semibold text-primary">Ready for real AI?</p>
            <p className="mt-1 text-xs text-muted-foreground">Wire Gemini, OpenRouter or HuggingFace via <code className="rounded bg-muted px-1">lib/ai-service.ts</code>.</p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
