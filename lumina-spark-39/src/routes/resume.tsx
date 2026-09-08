import { createFileRoute } from "@tanstack/react-router";
import { Upload, FileText, CheckCircle2, AlertTriangle, Sparkles, FolderGit2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/resume")({
  head: () => ({ meta: [{ title: "Resume AI · LUMINA AI" }] }),
  component: Resume,
});

const extractedSkills = ["React", "TypeScript", "Python", "Node.js", "PostgreSQL", "Tailwind", "Git", "Docker", "REST APIs", "Jest"];
const extractedProjects = [
  { title: "AI Study Buddy", desc: "RAG-based chat over university notes — Next.js + Postgres + OpenAI.", tags: ["AI", "Web"] },
  { title: "Campus Event Hub", desc: "Realtime event discovery for 5K+ students using Supabase + React.", tags: ["Web", "Realtime"] },
  { title: "Sentiment Analyzer", desc: "Twitter sentiment dashboard with FastAPI + scikit-learn.", tags: ["ML"] },
];
const gaps = [
  { skill: "System Design", need: "Required by 9 target roles", level: 35 },
  { skill: "Kubernetes", need: "Trending DevOps skill", level: 20 },
  { skill: "GraphQL", need: "Complements React stack", level: 45 },
];
const strengths = ["Strong product execution narrative", "Quantified impact on 4/5 projects", "Modern stack alignment with target roles", "Clean visual hierarchy"];
const weaknesses = ["Missing leadership signals", "No open-source contributions listed", "Generic professional summary", "No certifications surfaced"];

export function Resume() {
  return (
    <DashboardLayout title="Resume Analysis" subtitle="Upload your resume and let LUMINA score, extract and rewrite it.">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-8 lg:col-span-2">
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-10 text-center transition hover:border-primary/50 hover:bg-primary/5">
            <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-emerald shadow-elegant"><Upload className="h-7 w-7 text-white" /></div>
            <h3 className="mt-4 font-display text-xl font-semibold">Drop your resume here</h3>
            <p className="mt-1 text-sm text-muted-foreground">PDF, DOCX up to 5MB · We support 12+ formats.</p>
            <div className="mt-5 flex gap-2"><Button className="rounded-full gradient-emerald text-white">Choose file</Button><Button variant="outline" className="rounded-full">Paste link</Button></div>
            <p className="mt-3 text-xs text-muted-foreground">Last analyzed: aarav_resume_v3.pdf · 2h ago</p>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Overall Score</p>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="font-display text-6xl font-bold gradient-text">87</p>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
          <p className="mt-1 text-sm text-success flex items-center gap-1"><Sparkles className="h-3 w-3" />+9 since last upload</p>
          <div className="mt-5 space-y-3">
            {[["ATS friendliness", 92], ["Keyword match", 84], ["Impact statements", 78], ["Formatting", 95]].map(([k, v]) => (
              <div key={k as string}>
                <div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">{k}</span><span className="font-semibold">{v}</span></div>
                <Progress value={v as number} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-primary" />Extracted Skills</h3>
            <Badge variant="outline">{extractedSkills.length} found</Badge>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {extractedSkills.map((s) => (
              <Badge key={s} className="rounded-full bg-primary/10 px-3 py-1 text-primary hover:bg-primary/15">{s}</Badge>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold flex items-center gap-2"><FolderGit2 className="h-4 w-4 text-primary" />Extracted Projects</h3>
          <div className="mt-4 space-y-3">
            {extractedProjects.map((p) => (
              <div key={p.title} className="rounded-xl border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold">{p.title}</p>
                  <div className="flex gap-1">{p.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}</div>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h3 className="font-display text-lg font-semibold">Skill Gap Analysis</h3>
        <p className="text-sm text-muted-foreground">Where you are vs. where target roles expect you to be.</p>
        <div className="mt-5 space-y-4">
          {gaps.map((g) => (
            <div key={g.skill}>
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <div><p className="font-semibold">{g.skill}</p><p className="text-xs text-muted-foreground">{g.need}</p></div>
                <Badge variant="outline">{g.level}% → 80%</Badge>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                <div className="absolute inset-y-0 left-0 gradient-emerald" style={{ width: `${g.level}%` }} />
                <div className="absolute inset-y-0 w-0.5 bg-gold" style={{ left: "80%" }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" />Strengths</h3>
          <ul className="mt-4 space-y-2">{strengths.map((s) => <li key={s} className="flex items-start gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />{s}</li>)}</ul>
        </Card>
        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" />Weaknesses</h3>
          <ul className="mt-4 space-y-2">{weaknesses.map((s) => <li key={s} className="flex items-start gap-2 text-sm"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />{s}</li>)}</ul>
        </Card>
      </div>
    </DashboardLayout>
  );
}
