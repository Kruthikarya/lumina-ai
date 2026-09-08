import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, TrendingUp, TrendingDown, BookOpen, Lightbulb,
  Target, ArrowRight, Download, AlertTriangle, Code2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export type InterviewReport = {
  overall?: number;
  categories?: Record<string, number>;
  strongest_areas?: string[];
  weakest_areas?: string[];
  weak_answers?: { question?: string; issue?: string; better_answer?: string }[];
  coding_mistakes?: string[];
  study_topics?: string[];
  recommended_projects?: { title?: string; why?: string }[];
  recommended_difficulty?: string;
  next_interview?: { company?: string; role?: string; type?: string; why?: string };
  summary?: string;
  raw?: string;
};

const CATEGORY_LABEL: Record<string, string> = {
  technical_knowledge: "Technical knowledge",
  problem_solving: "Problem solving",
  communication: "Communication",
  confidence: "Confidence",
  coding_quality: "Coding quality",
  time_management: "Time management",
  behavioral_skills: "Behavioural skills",
  company_readiness: "Company readiness",
};

function useCountUp(target: number, duration = 1100) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

function ScoreRing({ value }: { value: number }) {
  const shown = useCountUp(value);
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid h-36 w-36 place-items-center">
      <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90">
        <circle cx="60" cy="60" r={r} className="stroke-muted" strokeWidth="10" fill="none" />
        <motion.circle
          cx="60" cy="60" r={r} fill="none" strokeWidth="10" strokeLinecap="round"
          className="stroke-primary"
          initial={{ strokeDasharray: `0 ${c}` }}
          animate={{ strokeDasharray: `${(shown / 100) * c} ${c}` }}
          transition={{ duration: 0.2 }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-3xl font-bold">{shown}</p>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Overall</p>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-border/60 bg-card p-4"
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <p className="font-display text-sm font-semibold">{title}</p>
      </div>
      <div className="mt-3">{children}</div>
    </motion.div>
  );
}

export function PostInterviewReport({
  report, company, role, onRetry,
}: {
  report: InterviewReport;
  company?: string;
  role?: string;
  onRetry?: () => void;
}) {
  const cats = Object.entries(report.categories || {}).filter(([, v]) => typeof v === "number");

  function download() {
    const lines = [
      `LUMINA AI — Interview Report`,
      `${company || ""} · ${role || ""}`,
      ``,
      `Overall: ${report.overall ?? "—"}/100`,
      ``,
      ...cats.map(([k, v]) => `${CATEGORY_LABEL[k] || k}: ${v}`),
      ``,
      `Strongest: ${(report.strongest_areas || []).join(", ")}`,
      `Weakest: ${(report.weakest_areas || []).join(", ")}`,
      `Study topics: ${(report.study_topics || []).join(", ")}`,
      ``,
      report.summary || "",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lumina-interview-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (report.raw && !report.overall && cats.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-4 text-xs whitespace-pre-wrap text-muted-foreground">
        {report.raw}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-wrap items-center gap-5 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/8 via-transparent to-gold/10 p-5"
      >
        <ScoreRing value={Math.max(0, Math.min(100, report.overall ?? 0))} />
        <div className="min-w-[200px] flex-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" />
            <p className="font-display text-base font-semibold">Post-interview report</p>
            {report.recommended_difficulty && (
              <Badge variant="secondary" className="ml-auto text-[10px]">Next level: {report.recommended_difficulty}</Badge>
            )}
          </div>
          {report.summary && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{report.summary}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="rounded-full" onClick={download}>
              <Download className="mr-1.5 h-3.5 w-3.5" /> Download report
            </Button>
            {onRetry && (
              <Button size="sm" className="rounded-full gradient-emerald text-white" onClick={onRetry}>
                <ArrowRight className="mr-1.5 h-3.5 w-3.5" /> Practise again
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {cats.length > 0 && (
        <Section title="Category breakdown" icon={Target}>
          <div className="grid gap-3 sm:grid-cols-2">
            {cats.map(([k, v], i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.4) }}
              >
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">{CATEGORY_LABEL[k] || k}</span>
                  <span className="font-semibold">{v as number}</span>
                </div>
                <Progress value={v as number} className="h-1.5" />
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {!!report.strongest_areas?.length && (
          <Section title="Strongest areas" icon={TrendingUp}>
            <ul className="space-y-1.5 text-xs">
              {report.strongest_areas.map((s) => (
                <li key={s} className="flex gap-2"><span className="text-emerald-500">▲</span>{s}</li>
              ))}
            </ul>
          </Section>
        )}
        {!!report.weakest_areas?.length && (
          <Section title="Needs work" icon={TrendingDown}>
            <ul className="space-y-1.5 text-xs">
              {report.weakest_areas.map((s) => (
                <li key={s} className="flex gap-2"><span className="text-orange-500">▼</span>{s}</li>
              ))}
            </ul>
          </Section>
        )}
      </div>

      {!!report.weak_answers?.length && (
        <Section title="Answers to rewrite" icon={AlertTriangle}>
          <div className="space-y-3">
            {report.weak_answers.map((w, i) => (
              <div key={i} className="rounded-xl border border-border/60 bg-muted/25 p-3 text-xs">
                {w.question && <p className="font-semibold">{w.question}</p>}
                {w.issue && <p className="mt-1 text-orange-500">Issue: {w.issue}</p>}
                {w.better_answer && <p className="mt-1 text-muted-foreground"><span className="font-semibold text-emerald-500">Better: </span>{w.better_answer}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {!!report.coding_mistakes?.length && (
        <Section title="Coding mistakes" icon={Code2}>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            {report.coding_mistakes.map((m, i) => <li key={i}>• {m}</li>)}
          </ul>
        </Section>
      )}

      {!!report.study_topics?.length && (
        <Section title="Study plan" icon={BookOpen}>
          <div className="flex flex-wrap gap-1.5">
            {report.study_topics.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
          </div>
        </Section>
      )}

      {!!report.recommended_projects?.length && (
        <Section title="Projects to build" icon={Lightbulb}>
          <div className="grid gap-2 sm:grid-cols-3">
            {report.recommended_projects.map((p, i) => (
              <div key={i} className="rounded-xl border border-border/60 bg-muted/25 p-3">
                <p className="text-xs font-semibold">{p.title}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{p.why}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {report.next_interview && (
        <Section title="Recommended next interview" icon={ArrowRight}>
          <p className="text-xs">
            <span className="font-semibold">{report.next_interview.company}</span> · {report.next_interview.role} · {report.next_interview.type}
          </p>
          {report.next_interview.why && <p className="mt-1 text-[11px] text-muted-foreground">{report.next_interview.why}</p>}
        </Section>
      )}
    </div>
  );
}
