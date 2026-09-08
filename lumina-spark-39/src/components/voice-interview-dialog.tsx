import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Loader2, Play, Square, Sparkles, Video, VideoOff,
  Volume2, VolumeX, PhoneOff, Timer,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { InterviewerAvatar, MicWaveform, type AvatarState, type Gender } from "@/components/interviewer-avatar";
import { companyLogo, findCompany } from "@/lib/interview-data";
import { SafeImage } from "@/components/safe-image";
import { PostInterviewReport, type InterviewReport } from "@/components/post-interview-report";

type Turn = { role: "interviewer" | "candidate"; text: string };
type Feedback = {
  overall?: number; clarity?: number; structure?: number;
  depth?: number; confidence?: number;
  strength?: string; improve?: string; next_step?: string;
  raw?: string;
};

type Phase = "idle" | "speaking" | "listening" | "recording" | "transcribing" | "thinking" | "evaluating" | "done";

export type InterviewConfig = {
  company: string;
  role: string;
  difficulty: string;
  type: string;
  gender: Gender;
};

type ResumeCtx = { name?: string; role?: string; college?: string; skills?: string[]; company?: string };

async function speak(text: string, gender: Gender, muted: boolean, hold: { audio: HTMLAudioElement | null }) {
  if (muted) { await new Promise((r) => setTimeout(r, Math.min(6000, text.length * 45))); return; }
  const res = await fetch("/api/interview/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice: gender === "female" ? "shimmer" : "onyx" }),
  });
  if (!res.ok) throw new Error(`TTS failed: ${res.status}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  hold.audio = audio;
  await new Promise<void>((resolve, reject) => {
    audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
    audio.onerror = () => reject(new Error("audio playback failed"));
    audio.play().catch(reject);
  });
  hold.audio = null;
}

async function transcribe(blob: Blob): Promise<string> {
  const fd = new FormData();
  fd.append("file", blob, "answer");
  const res = await fetch("/api/interview/stt", { method: "POST", body: fd });
  if (!res.ok) throw new Error(await res.text().catch(() => "STT failed"));
  const { text } = (await res.json()) as { text: string };
  return text || "";
}

async function chatNext(topic: string, history: Turn[], resume: ResumeCtx | undefined, config: InterviewConfig) {
  const res = await fetch("/api/interview/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, history, action: "next", resume, config }),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Chat failed"));
  return (await res.json()) as { question: string; done: boolean };
}

async function chatFeedback(topic: string, history: Turn[], resume: ResumeCtx | undefined, config: InterviewConfig): Promise<Feedback> {
  const res = await fetch("/api/interview/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, history, action: "feedback", resume, config }),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Chat failed"));
  const { feedback } = (await res.json()) as { feedback: Feedback };
  return feedback;
}

async function chatReport(topic: string, history: Turn[], resume: ResumeCtx | undefined, config: InterviewConfig): Promise<InterviewReport> {
  const res = await fetch("/api/interview/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic, history, action: "report", resume, config,
      payload: { transcript: history },
    }),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Report failed"));
  const { report } = (await res.json()) as { report: InterviewReport };
  return report;
}

function avatarState(p: Phase): AvatarState {
  if (p === "speaking") return "speaking";
  if (p === "listening" || p === "recording") return "listening";
  if (p === "thinking" || p === "transcribing") return "thinking";
  if (p === "evaluating") return "evaluating";
  return "idle";
}

export function VoiceInterviewDialog({
  open, onOpenChange, topic, resume, config,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  topic: string;
  resume?: ResumeCtx;
  config?: Partial<InterviewConfig>;
}) {
  const cfg: InterviewConfig = {
    company: config?.company || resume?.company || "Google",
    role: config?.role || resume?.role || "Software Engineer",
    difficulty: config?.difficulty || "Intermediate",
    type: config?.type || topic,
    gender: config?.gender || "male",
  };

  const [phase, setPhase] = useState<Phase>("idle");
  const [history, setHistory] = useState<Turn[]>([]);
  const [currentQ, setCurrentQ] = useState<string>("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [level, setLevel] = useState(0);
  const [muted, setMuted] = useState(false);
  const [camOn, setCamOn] = useState(false);
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const running = phase !== "idle" && phase !== "done";
  useEffect(() => {
    if (!open || !running) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [open, running]);


  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const camStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const cancelledRef = useRef(false);
  const ttsRef = useRef<{ audio: HTMLAudioElement | null }>({ audio: null });

  useEffect(() => {
    if (open) { cancelledRef.current = false; return; }
    cleanup();
    setPhase("idle"); setHistory([]); setCurrentQ(""); setFeedback(null); setCamOn(false);
    setReport(null); setElapsed(0);
    cancelledRef.current = true;
  }, [open]);

  useEffect(() => () => { cancelledRef.current = true; cleanup(); }, []);

  function cleanup() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    recorderRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    camStreamRef.current?.getTracks().forEach((t) => t.stop());
    camStreamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    ttsRef.current.audio?.pause();
    ttsRef.current.audio = null;
  }

  async function toggleCam() {
    if (camOn) {
      camStreamRef.current?.getTracks().forEach((t) => t.stop());
      camStreamRef.current = null;
      setCamOn(false);
      return;
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      camStreamRef.current = s;
      setCamOn(true);
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = s; }, 50);
    } catch {
      toast.error("Camera permission denied");
    }
  }

  async function askAndPlay(h: Turn[]) {
    setPhase("thinking");
    const { question, done } = await chatNext(cfg.type, h, resume, cfg);
    if (cancelledRef.current) return;
    setCurrentQ(question);
    const nextHistory: Turn[] = [...h, { role: "interviewer", text: question }];
    setHistory(nextHistory);

    setPhase("speaking");
    await speak(question, cfg.gender, muted, ttsRef.current);
    if (cancelledRef.current) return;

    if (done) {
      await evaluate(nextHistory);
    } else {
      setPhase("listening");
    }
  }

  async function evaluate(h: Turn[]) {
    setPhase("evaluating");
    const [fb, rp] = await Promise.allSettled([
      chatFeedback(cfg.type, h, resume, cfg),
      chatReport(cfg.type, h, resume, cfg),
    ]);
    if (!cancelledRef.current) {
      if (fb.status === "fulfilled") setFeedback(fb.value);
      if (rp.status === "fulfilled") setReport(rp.value);
    }
    setPhase("done");
  }

  async function start() {
    try {
      setFeedback(null); setReport(null); setElapsed(0); setHistory([]); setCurrentQ("");
      await askAndPlay([]);
    } catch (e: any) {
      toast.error(e?.message || "Could not start interview");
      setPhase("idle");
    }
  }

  async function beginRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; sum += v * v; }
        setLevel(Math.min(1, Math.sqrt(sum / buf.length) * 3));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();

      const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "";
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      recorderRef.current = rec;
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      rec.onstop = handleRecordingStopped;
      rec.start();
      setPhase("recording");
    } catch (e: any) {
      toast.error(e?.message || "Microphone permission denied");
      setPhase("listening");
    }
  }

  async function handleRecordingStopped() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setLevel(0);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    await audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;

    const rec = recorderRef.current;
    const blob = new Blob(chunksRef.current, { type: rec?.mimeType || "audio/webm" });
    recorderRef.current = null;
    if (blob.size < 1024) {
      toast.error("That recording was empty — please try again.");
      setPhase("listening");
      return;
    }

    setPhase("transcribing");
    try {
      const text = await transcribe(blob);
      if (cancelledRef.current) return;
      if (!text.trim()) { toast.error("Couldn't hear that — try again."); setPhase("listening"); return; }
      const nextHistory: Turn[] = [...history, { role: "candidate", text }];
      setHistory(nextHistory);
      await askAndPlay(nextHistory);
    } catch (e: any) {
      toast.error(e?.message || "Transcription failed");
      setPhase("listening");
    }
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }

  async function endInterview() {
    if (history.length === 0) { onOpenChange(false); return; }
    ttsRef.current.audio?.pause();
    stopRecording();
    await evaluate(history);
  }

  const asked = history.filter((h) => h.role === "interviewer").length;
  const logo = companyLogo(findCompany(cfg.company)?.domain || "");
  const clock = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
  const STEPS = ["Intro", "Background", "Core", "Follow-up", "Deep dive", "Closing"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-hidden p-0">
        <DialogHeader className="border-b border-border/60 bg-gradient-to-r from-primary/10 via-transparent to-gold/10 p-5">
          <div className="flex items-center gap-3">
            {logo && <SafeImage src={logo} alt={cfg.company} className="h-9 w-9 rounded-lg bg-white p-1" />}
            <div className="min-w-0">
              <DialogTitle className="truncate font-display text-lg">{cfg.company} · {cfg.role}</DialogTitle>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {cfg.type} round · {cfg.difficulty} · {cfg.gender === "female" ? "Female" : "Male"} AI interviewer
              </p>
            </div>
            <div className="ml-auto hidden items-center gap-2 sm:flex">
              <Badge variant="outline" className="font-mono tabular-nums">
                <Timer className="mr-1 h-3 w-3" />{clock}
              </Badge>
              <Badge variant="secondary">
                <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${running ? "animate-pulse bg-red-500" : "bg-muted-foreground"}`} />
                Live simulation
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="grid max-h-[75vh] gap-6 overflow-y-auto p-6 md:grid-cols-[300px_1fr]">
          {/* Interviewer stage */}
          <div className="flex flex-col items-center rounded-2xl border border-border/60 bg-muted/30 p-5">
            <InterviewerAvatar gender={cfg.gender} state={avatarState(phase)} level={level} size={200} />
            <p className="mt-3 text-sm font-semibold">{cfg.gender === "female" ? "Aria" : "Alex"}</p>
            <p className="text-xs text-muted-foreground">Senior interviewer · {cfg.company}</p>

            <div className="mt-3 w-full rounded-xl border border-border/60 bg-background/60 p-2">
              <MicWaveform level={level} active={phase === "recording"} bars={22} />
              <p className="text-center text-[10px] uppercase tracking-wider text-muted-foreground">
                {phase === "recording" ? "You are speaking" : "Mic idle"}
              </p>
            </div>

            {camOn && (
              <video
                ref={videoRef}
                autoPlay muted playsInline
                className="mt-3 h-24 w-full rounded-xl object-cover"
              />
            )}

            {/* Controls */}
            <div className="mt-4 flex items-center gap-2">
              <Button size="icon" variant={muted ? "destructive" : "outline"} className="rounded-full" onClick={() => setMuted((m) => !m)} title="Mute interviewer voice">
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button
                size="icon"
                variant={phase === "recording" ? "destructive" : "outline"}
                className="rounded-full"
                onClick={() => (phase === "recording" ? stopRecording() : phase === "listening" ? beginRecording() : undefined)}
                disabled={phase !== "recording" && phase !== "listening"}
                title="Microphone"
              >
                {phase === "recording" ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
              <Button size="icon" variant={camOn ? "default" : "outline"} className="rounded-full" onClick={toggleCam} title="Camera">
                {camOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
              <Button size="icon" variant="destructive" className="rounded-full" onClick={endInterview} title="End interview">
                <PhoneOff className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Conversation */}
          <div className="flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={phase === "thinking" ? "thinking" : currentQ || phase}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="min-h-[110px] rounded-2xl border border-border/60 bg-card p-4"
              >
                {phase === "thinking" ? (
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Interviewer is thinking…</p>
                    <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                  </div>
                ) : currentQ ? (
                  <>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Interviewer</p>
                    <p className="mt-1 text-base leading-relaxed">{currentQ}</p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Press <span className="font-semibold text-foreground">Start</span> — your {cfg.company} interviewer will greet you and ask the first question aloud.
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {phase === "idle" && (
                <Button onClick={start} className="rounded-full gradient-emerald text-white shadow-elegant">
                  <Play className="mr-1.5 h-4 w-4" /> Start interview
                </Button>
              )}
              {phase === "listening" && (
                <Button onClick={beginRecording} className="rounded-full gradient-emerald text-white shadow-elegant">
                  <Mic className="mr-1.5 h-4 w-4" /> Record answer
                </Button>
              )}
              {phase === "recording" && (
                <Button onClick={stopRecording} variant="destructive" className="rounded-full">
                  <Square className="mr-1.5 h-4 w-4" /> Stop & submit
                </Button>
              )}
              {(phase === "thinking" || phase === "transcribing" || phase === "speaking" || phase === "evaluating") && (
                <Button disabled variant="outline" className="rounded-full">
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  {phase === "speaking" ? "Speaking…" : phase === "transcribing" ? "Transcribing…" : phase === "evaluating" ? "Evaluating…" : "Thinking…"}
                </Button>
              )}
              {phase === "done" && (
                <Button onClick={start} variant="outline" className="rounded-full">
                  <Play className="mr-1.5 h-4 w-4" /> New session
                </Button>
              )}
              <div className="ml-auto text-xs text-muted-foreground">{asked}/6 questions · {clock}</div>
            </div>
            <Progress value={Math.min(100, (asked / 6) * 100)} className="mt-2 h-1.5" />

            {/* Interview progress stepper */}
            <div className="mt-3 flex items-center gap-1.5">
              {STEPS.map((s, i) => {
                const state = i < asked ? "done" : i === asked ? "active" : "todo";
                return (
                  <div key={s} className="flex-1">
                    <motion.div
                      layout
                      className={`h-1.5 rounded-full ${state === "done" ? "bg-primary" : state === "active" ? "gradient-emerald animate-pulse" : "bg-muted"}`}
                    />
                    <p className={`mt-1 truncate text-center text-[9px] uppercase tracking-wider ${state === "todo" ? "text-muted-foreground/60" : "text-muted-foreground"}`}>{s}</p>
                  </div>
                );
              })}
            </div>


            {history.length > 0 && (
              <div className="mt-4 max-h-56 space-y-2 overflow-y-auto rounded-2xl border border-border/60 bg-muted/20 p-3">
                {history.map((t, i) => (
                  <div key={i} className={`text-sm ${t.role === "interviewer" ? "text-foreground" : "text-primary"}`}>
                    <span className="mr-2 rounded-full bg-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                      {t.role === "interviewer" ? "AI" : "You"}
                    </span>
                    {t.text}
                  </div>
                ))}
              </div>
            )}

            {feedback && (
              <div className="mt-5 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/5 to-gold/5 p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="font-display text-sm font-semibold">AI Feedback</p>
                  {typeof feedback.overall === "number" && <Badge className="ml-auto">{feedback.overall}/100</Badge>}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  {(["clarity", "structure", "depth", "confidence"] as const).map((k) => (
                    typeof feedback[k] === "number" && (
                      <div key={k}>
                        <div className="mb-1 flex justify-between capitalize">
                          <span className="text-muted-foreground">{k}</span>
                          <span className="font-semibold">{feedback[k]}</span>
                        </div>
                        <Progress value={feedback[k] as number} className="h-1.5" />
                      </div>
                    )
                  ))}
                </div>
                {feedback.strength && <p className="mt-3 text-xs"><span className="font-semibold text-emerald-500">Strength: </span>{feedback.strength}</p>}
                {feedback.improve && <p className="mt-1 text-xs"><span className="font-semibold text-orange-500">Improve: </span>{feedback.improve}</p>}
                {feedback.next_step && <p className="mt-1 text-xs"><span className="font-semibold text-primary">Next: </span>{feedback.next_step}</p>}
                {feedback.raw && <p className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground">{feedback.raw}</p>}
              </div>
            )}

            {phase === "evaluating" && (
              <div className="mt-5 space-y-2 rounded-2xl border border-border/60 bg-muted/20 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Generating your report…</p>
                <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-24 w-full animate-pulse rounded-xl bg-muted" />
              </div>
            )}

            {report && (
              <div className="mt-5">
                <PostInterviewReport report={report} company={cfg.company} role={cfg.role} onRetry={start} />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
