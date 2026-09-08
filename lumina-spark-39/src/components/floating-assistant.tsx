import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, User, X, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { chatWithAssistant } from "@/lib/ai-service";

type Msg = { role: "user" | "assistant"; content: string };

const quickActions = [
  "Improve my resume",
  "Suggest internships",
  "Plan this week",
];

export function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "Hi 👋 I'm Lumi. Ask me anything about your career — resumes, interviews, opportunities.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamed, setStreamed] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, streamed]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setStreamed("");
    const reply = await chatWithAssistant(next);
    // simulate streaming
    let i = 0;
    const step = Math.max(1, Math.floor(reply.length / 60));
    const id = setInterval(() => {
      i += step;
      setStreamed(reply.slice(0, i));
      if (i >= reply.length) {
        clearInterval(id);
        setMessages([...next, { role: "assistant", content: reply }]);
        setStreamed("");
        setLoading(false);
      }
    }, 25);
  }

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full gradient-emerald text-white shadow-2xl shadow-primary/40 ring-4 ring-primary/10"
            aria-label="Open AI assistant"
          >
            <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary/30" />
            <Bot className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-success ring-2 ring-background" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="fixed bottom-6 right-6 z-50 flex h-[560px] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card/95 shadow-2xl shadow-primary/20 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-border bg-gradient-to-br from-primary/10 via-card to-card p-4">
              <div className="flex items-center gap-3">
                <div className="relative grid h-10 w-10 place-items-center rounded-xl gradient-emerald">
                  <Bot className="h-5 w-5 text-white" />
                  <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-success ring-2 ring-card" />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold">Lumi · AI Coach</p>
                  <p className="text-[11px] text-muted-foreground">Powered by Gemini · always-on</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => setOpen(false)}>
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => setOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={"flex gap-2 " + (m.role === "user" ? "flex-row-reverse" : "")}
                >
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className={m.role === "user" ? "bg-primary/15 text-primary text-[10px]" : "gradient-emerald text-white text-[10px]"}>
                      {m.role === "user" ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className={"max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed " + (m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {loading && streamed && (
                <div className="flex gap-2">
                  <Avatar className="h-7 w-7"><AvatarFallback className="gradient-emerald text-white text-[10px]"><Sparkles className="h-3.5 w-3.5" /></AvatarFallback></Avatar>
                  <div className="max-w-[80%] rounded-2xl bg-muted px-3.5 py-2 text-sm leading-relaxed">
                    {streamed}<span className="ml-0.5 inline-block h-3 w-1 animate-pulse bg-primary align-middle" />
                  </div>
                </div>
              )}
              {loading && !streamed && (
                <div className="flex gap-2">
                  <Avatar className="h-7 w-7"><AvatarFallback className="gradient-emerald text-white text-[10px]"><Sparkles className="h-3.5 w-3.5" /></AvatarFallback></Avatar>
                  <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3">
                    <span className="text-[11px] font-medium text-muted-foreground">Thinking</span>
                    <span className="ml-1 h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:120ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:240ms]" />
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border p-3">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {quickActions.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Lumi…"
                  className="h-10 rounded-full bg-muted text-sm"
                />
                <Button type="submit" disabled={loading} size="icon" className="h-10 w-10 shrink-0 rounded-full gradient-emerald text-white">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
