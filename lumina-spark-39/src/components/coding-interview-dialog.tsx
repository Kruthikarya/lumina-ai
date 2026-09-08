import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, Play, Sparkles, Terminal, Timer, Lightbulb, Send, RotateCcw,
  CheckCircle2, XCircle, AlertTriangle, Bug, Gauge, HardDrive,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { SafeImage } from "@/components/safe-image";
import { LANGUAGES, codingFocus, companyLogo, findCompany } from "@/lib/interview-data";
import { InterviewerAvatar, type Gender } from "@/components/interviewer-avatar";
import { CodeEditor, FILE_EXT } from "@/components/code-editor";

type TestCase = { name?: string; input?: string; expected?: string; hidden?: boolean };
type Problem = {
  title?: string; topic?: string; difficulty?: string; statement?: string;
  examples?: { input?: string; output?: string; explanation?: string }[];
  constraints?: string[]; hints?: string[]; starter_code?: string;
  test_cases?: TestCase[]; optimal_complexity?: { time?: string; space?: string };
  raw?: string;
};
type RunResult = {
  name?: string; input?: string; expected?: string; actual?: string;
  passed?: boolean; error?: string | null; runtime_ms?: number;
};
type RunOutput = {
  status?: "passed" | "failed" | "runtime_error" | "compilation_error";
  compile_error?: string | null;
  results?: RunResult[];
  custom_output?: string | null;
  stdout?: string;
  time_complexity?: string; space_complexity?: string;
  edge_cases?: string[];
  raw?: string;
};
type Review = {
  overall?: number; correctness?: number; efficiency?: number; readability?: number;
  edge_cases?: number; best_practices?: number;
  time_complexity?: string; space_complexity?: string;
  complexity?: string; strength?: string; improve?: string; next_step?: string; raw?: string;
};

const STATUS_META = {
  passed: { label: "All tests passed", cls: "text-emerald-500", Icon: CheckCircle2 },
  failed: { label: "Some tests failed", cls: "text-orange-500", Icon: XCircle },
  runtime_error: { label: "Runtime error", cls: "text-rose-500", Icon: Bug },
  compilation_error: { label: "Compilation error", cls: "text-rose-500", Icon: AlertTriangle },
} as const;

export function CodingInterviewDialog({
  open, onOpenChange, company, role, difficulty, gender = "male",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  company: string;
  role: string;
  difficulty: string;
  gender?: Gender;
}) {
  const [language, setLanguage] = useState<string>("Java");
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [run, setRun] = useState<RunOutput | null>(null);
  const [customInput, setCustomInput] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [review, setReview] = useState<Review | null>(null);
  const [showHint, setShowHint] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) {
      setProblem(null); setCode(""); setReview(null); setRun(null);
      setShowHint(0); setSeconds(0); setCustomInput(""); setUseCustom(false);
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [open]);

  const focus = codingFocus(company, role);
  const logo = companyLogo(findCompany(company)?.domain || "");
  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const cfg = { company, role, difficulty, language, focus, gender };

  async function post(body: Record<string, unknown>) {
    const res = await fetch("/api/interview/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error((await res.text().catch(() => "")) || "Request failed");
    return res.json();
  }

  async function loadProblem() {
    setLoading(true); setReview(null); setRun(null); setShowHint(0);
    try {
      const { problem: p } = (await post({ action: "problem", config: cfg })) as { problem: Problem };
      setProblem(p);
      setCode(p?.starter_code || "");
      setSeconds(0);
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (e: any) {
      toast.error(e?.message || "Could not load a problem");
    } finally {
      setLoading(false);
    }
  }

  async function runCode() {
    if (!problem || !code.trim()) { toast.error("Write some code first."); return; }
    setRunning(true); setRun(null);
    try {
      const { run: r } = (await post({
        action: "run",
        config: cfg,
        payload: {
          problem: { title: problem.title, statement: problem.statement, constraints: problem.constraints },
          language,
          code,
          test_cases: problem.test_cases ?? problem.examples?.map((e, i) => ({
            name: `Example ${i + 1}`, input: e.input, expected: e.output,
          })) ?? [],
          custom_input: useCustom && customInput.trim() ? customInput : null,
        },
      })) as { run: RunOutput };
      setRun(r);
      if (r?.status === "passed") toast.success("All test cases passed");
      else if (r?.status === "compilation_error") toast.error("Compilation error");
      else if (r?.status === "runtime_error") toast.error("Runtime error");
      else toast.warning("Some test cases failed");
    } catch (e: any) {
      toast.error(e?.message || "Run failed");
    } finally {
      setRunning(false);
    }
  }

  function reset() {
    setCode(problem?.starter_code || "");
    setRun(null); setReview(null);
    toast.info("Editor reset to starter code");
  }

  async function submit() {
    if (!problem || !code.trim()) { toast.error("Write some code first."); return; }
    setReviewing(true);
    if (timerRef.current) window.clearInterval(timerRef.current);
    try {
      const { review: r } = (await post({
        action: "review",
        config: cfg,
        history: [
          { role: "interviewer", text: `Problem: ${problem.title}\n${problem.statement}` },
          { role: "candidate", text: `Solution in ${language}:\n${code}` },
          ...(run ? [{ role: "candidate" as const, text: `Test run result: ${JSON.stringify(run).slice(0, 2000)}` }] : []),
        ],
      })) as { review: Review };
      setReview(r);
    } catch (e: any) {
      toast.error(e?.message || "Review failed");
    } finally {
      setReviewing(false);
    }
  }

  const visibleTests = problem?.test_cases ?? [];
  const passedCount = run?.results?.filter((r) => r.passed).length ?? 0;
  const totalCount = run?.results?.length ?? 0;
  const statusMeta = run?.status ? STATUS_META[run.status] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl overflow-hidden p-0">
        <DialogHeader className="border-b border-border/60 bg-gradient-to-r from-primary/10 via-transparent to-gold/10 p-5">
          <div className="flex items-center gap-3">
            {logo && <SafeImage src={logo} alt={company} className="h-9 w-9 rounded-lg bg-white p-1" />}
            <div className="min-w-0">
              <DialogTitle className="truncate font-display text-lg">{company} · Coding Round</DialogTitle>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{role} · {difficulty} · {focus.slice(0, 3).join(", ")}</p>
            </div>
            <Badge variant="secondary" className="ml-auto gap-1"><Timer className="h-3 w-3" />{mmss}</Badge>
          </div>
        </DialogHeader>

        <div className="grid max-h-[78vh] gap-5 overflow-y-auto p-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          {/* Problem panel */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-40 rounded-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={loadProblem} disabled={loading} className="rounded-full gradient-emerald text-white">
                {loading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Play className="mr-1.5 h-4 w-4" />}
                {problem ? "New problem" : "Get problem"}
              </Button>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/25 p-3">
              <InterviewerAvatar gender={gender} state={loading ? "thinking" : reviewing || running ? "evaluating" : "idle"} size={78} />
              <p className="pt-2 text-xs text-muted-foreground">
                Your {company} interviewer will hand you one role-relevant problem. Solve it in {language}, run the tests, then submit for a structured review.
              </p>
            </div>

            {loading && (
              <div className="space-y-2 rounded-2xl border border-border/60 p-4">
                {[...Array(5)].map((_, i) => <div key={i} className="h-3 animate-pulse rounded bg-muted" style={{ width: `${90 - i * 12}%` }} />)}
              </div>
            )}

            {problem && !loading && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border/60 bg-card p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-display text-base font-semibold">{problem.title || "Coding problem"}</h4>
                  {problem.difficulty && <Badge variant="outline">{problem.difficulty}</Badge>}
                  {problem.topic && <Badge variant="secondary" className="ml-auto">{problem.topic}</Badge>}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{problem.statement || problem.raw}</p>

                {problem.examples?.map((ex, i) => (
                  <div key={i} className="mt-3 rounded-xl bg-muted/40 p-3 font-mono text-xs">
                    <p><span className="text-muted-foreground">Input: </span>{ex.input}</p>
                    <p><span className="text-muted-foreground">Output: </span>{ex.output}</p>
                    {ex.explanation && <p className="mt-1 font-sans text-muted-foreground">{ex.explanation}</p>}
                  </div>
                ))}

                {!!problem.constraints?.length && (
                  <ul className="mt-3 list-inside list-disc text-xs text-muted-foreground">
                    {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                )}

                {problem.optimal_complexity && (
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                    <Badge variant="outline" className="gap-1"><Gauge className="h-3 w-3" />Target time: {problem.optimal_complexity.time}</Badge>
                    <Badge variant="outline" className="gap-1"><HardDrive className="h-3 w-3" />Target space: {problem.optimal_complexity.space}</Badge>
                  </div>
                )}

                {!!problem.hints?.length && (
                  <div className="mt-3">
                    <Button size="sm" variant="outline" className="rounded-full"
                      onClick={() => setShowHint((h) => Math.min(h + 1, problem.hints!.length))}
                      disabled={showHint >= problem.hints.length}>
                      <Lightbulb className="mr-1.5 h-3 w-3" /> Reveal hint ({showHint}/{problem.hints.length})
                    </Button>
                    {problem.hints.slice(0, showHint).map((h, i) => (
                      <p key={i} className="mt-2 rounded-lg border border-gold/30 bg-gold/5 p-2 text-xs">{h}</p>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Test cases */}
            {!!visibleTests.length && (
              <div className="rounded-2xl border border-border/60 bg-card p-4">
                <p className="font-display text-sm font-semibold">Test cases</p>
                <div className="mt-3 space-y-2">
                  {visibleTests.map((tc, i) => {
                    const r = run?.results?.[i];
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className={`rounded-xl border p-2.5 text-xs ${
                          r ? (r.passed ? "border-emerald-500/40 bg-emerald-500/5" : "border-rose-500/40 bg-rose-500/5") : "border-border/60 bg-muted/25"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{tc.name || `Case ${i + 1}`}</span>
                          {tc.hidden && <Badge variant="outline" className="h-4 px-1.5 text-[10px]">hidden</Badge>}
                          {r && (
                            <span className={`ml-auto inline-flex items-center gap-1 font-semibold ${r.passed ? "text-emerald-500" : "text-rose-500"}`}>
                              {r.passed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                              {r.passed ? "Passed" : "Failed"}
                              {typeof r.runtime_ms === "number" && <span className="text-muted-foreground">· {r.runtime_ms}ms</span>}
                            </span>
                          )}
                        </div>
                        {!tc.hidden && (
                          <div className="mt-1 font-mono text-[11px] text-muted-foreground">
                            <p>in: {tc.input}</p>
                            <p>expected: {tc.expected}</p>
                            {r && !r.passed && <p className="text-rose-500">got: {r.actual ?? r.error}</p>}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Editor panel */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2 rounded-t-2xl border border-b-0 border-border/60 bg-muted/40 px-3 py-2">
              <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium">solution.{FILE_EXT[language] || "txt"}</span>
              <div className="ml-auto flex items-center gap-1.5">
                <Button size="sm" variant="outline" onClick={reset} disabled={!problem} className="h-7 rounded-full">
                  <RotateCcw className="mr-1.5 h-3 w-3" /> Reset
                </Button>
                <Button size="sm" variant="outline" onClick={runCode} disabled={running || !problem} className="h-7 rounded-full">
                  {running ? <Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> : <Play className="mr-1.5 h-3 w-3" />} Run code
                </Button>
                <Button size="sm" onClick={submit} disabled={reviewing || !problem} className="h-7 rounded-full gradient-emerald text-white">
                  {reviewing ? <Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> : <Send className="mr-1.5 h-3 w-3" />} Submit
                </Button>
              </div>
            </div>

            <CodeEditor value={code} onChange={setCode} language={language} minHeight={300} />

            {/* Custom input */}
            <div className="mt-3 rounded-2xl border border-border/60 bg-card p-3">
              <label className="flex items-center gap-2 text-xs font-medium">
                <input type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} className="accent-primary" />
                Custom input
              </label>
              {useCustom && (
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="e.g. nums = [2,7,11,15], target = 9"
                  className="mt-2 h-20 w-full resize-none rounded-xl border border-border/60 bg-muted/25 p-2 font-mono text-xs outline-none focus:ring-2 focus:ring-primary/30"
                />
              )}
            </div>

            {/* Output console */}
            <AnimatePresence>
              {(running || run) && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-3 rounded-2xl border border-border/60 bg-[#0b1220] p-3 font-mono text-xs text-slate-200"
                >
                  <div className="flex items-center gap-2 pb-2 text-[11px] uppercase tracking-wider text-slate-400">
                    <Terminal className="h-3 w-3" /> Output console
                    {statusMeta && (
                      <span className={`ml-auto inline-flex items-center gap-1 font-semibold ${statusMeta.cls}`}>
                        <statusMeta.Icon className="h-3.5 w-3.5" /> {statusMeta.label}
                      </span>
                    )}
                  </div>
                  {running ? (
                    <p className="animate-pulse text-slate-400">$ compiling and running test cases…</p>
                  ) : (
                    <>
                      {totalCount > 0 && (
                        <p className="text-slate-300">Test cases: {passedCount}/{totalCount} passed</p>
                      )}
                      {run?.compile_error && <p className="whitespace-pre-wrap text-rose-400">{run.compile_error}</p>}
                      {run?.stdout && <p className="mt-1 whitespace-pre-wrap text-slate-300">{run.stdout}</p>}
                      {run?.custom_output && (
                        <p className="mt-1 whitespace-pre-wrap text-emerald-300">custom input → {run.custom_output}</p>
                      )}
                      {run?.results?.filter((r) => r.error).map((r, i) => (
                        <p key={i} className="mt-1 whitespace-pre-wrap text-rose-400">{r.name}: {r.error}</p>
                      ))}
                      {(run?.time_complexity || run?.space_complexity) && (
                        <p className="mt-2 text-sky-300">
                          Time: {run?.time_complexity} · Space: {run?.space_complexity}
                        </p>
                      )}
                      {!!run?.edge_cases?.length && (
                        <ul className="mt-1 list-inside list-disc text-amber-300">
                          {run.edge_cases.map((e, i) => <li key={i}>{e}</li>)}
                        </ul>
                      )}
                      {run?.raw && <p className="whitespace-pre-wrap text-slate-400">{run.raw}</p>}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {review && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/5 to-gold/5 p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="font-display text-sm font-semibold">Interviewer review</p>
                  {typeof review.overall === "number" && <Badge className="ml-auto">{review.overall}/100</Badge>}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
                  {(["correctness", "efficiency", "readability", "edge_cases", "best_practices"] as const).map((k) => (
                    typeof review[k] === "number" ? (
                      <div key={k}>
                        <div className="mb-1 flex justify-between capitalize">
                          <span className="text-muted-foreground">{k.replace("_", " ")}</span>
                          <span className="font-semibold">{review[k]}</span>
                        </div>
                        <Progress value={review[k] as number} className="h-1.5" />
                      </div>
                    ) : null
                  ))}
                </div>
                {(review.time_complexity || review.space_complexity) && (
                  <p className="mt-3 text-xs">
                    <span className="font-semibold">Complexity: </span>
                    {review.time_complexity} time · {review.space_complexity} space
                  </p>
                )}
                {review.complexity && !review.time_complexity && <p className="mt-3 text-xs"><span className="font-semibold">Complexity: </span>{review.complexity}</p>}
                {review.strength && <p className="mt-1 text-xs"><span className="font-semibold text-emerald-500">Strength: </span>{review.strength}</p>}
                {review.improve && <p className="mt-1 text-xs"><span className="font-semibold text-orange-500">Improve: </span>{review.improve}</p>}
                {review.next_step && <p className="mt-1 text-xs"><span className="font-semibold text-primary">Next: </span>{review.next_step}</p>}
                {review.raw && <p className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground">{review.raw}</p>}
              </motion.div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
