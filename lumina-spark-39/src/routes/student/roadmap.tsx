import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  CheckCircle2, Circle, Sparkles, BookOpen, Trophy, Rocket, Star, Clock, Users, ExternalLink, PlayCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { roadmapCourses, clearbit, type Course } from "@/lib/real-data";
import { SafeImage } from "@/components/safe-image";

export const Route = createFileRoute("/student/roadmap")({
  head: () => ({ meta: [{ title: "Career Roadmap · LUMINA AI" }] }),
  component: Roadmap,
});

type Milestone = {
  key: keyof typeof roadmapCourses;
  q: string;
  title: string;
  icon: typeof BookOpen;
  done?: boolean;
  active?: boolean;
  items: { label: string; done: boolean }[];
};

const milestones: Milestone[] = [
  { key: "foundations", q: "Q1 2026", title: "Foundations", icon: BookOpen, done: true, items: [
    { label: "Master DSA fundamentals", done: true },
    { label: "Build 2 portfolio projects", done: true },
    { label: "Reach 80+ resume score", done: true },
  ]},
  { key: "specialization", q: "Q2 2026", title: "Specialization", icon: Sparkles, done: true, items: [
    { label: "Choose ML or Web specialization", done: true },
    { label: "Complete 1 paid internship", done: true },
    { label: "Publish 2 technical blog posts", done: false },
  ]},
  { key: "production", q: "Q3 2026", title: "Production-grade", icon: Rocket, active: true, items: [
    { label: "Ship 1 open-source contribution", done: true },
    { label: "Mock 5 interviews", done: false },
    { label: "Reach 85% placement readiness", done: false },
  ]},
  { key: "placement", q: "Q4 2026", title: "Placement", icon: Trophy, items: [
    { label: "Apply to 20 target companies", done: false },
    { label: "Clear 3 final rounds", done: false },
    { label: "Convert offer", done: false },
  ]},
];

function CourseCard({ c }: { c: Course }) {
  return (
    <motion.a
      href={c.url}
      target="_blank"
      rel="noreferrer"
      whileHover={{ y: -4 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/40 hover:shadow-elegant"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <SafeImage src={c.thumbnail} alt={c.title} seed={c.title} label={c.provider} className="h-full w-full object-cover transition group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-2 py-1 text-[10px] font-semibold backdrop-blur">
          <SafeImage src={clearbit(c.providerDomain)} alt="" seed={c.providerDomain} label={c.provider} className="h-3 w-3 rounded-sm" />
          {c.provider}
        </div>
        <Badge className="absolute right-2 top-2 bg-background/90 text-foreground hover:bg-background/90">{c.level}</Badge>
        <PlayCircle className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-white/90 opacity-0 transition group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="line-clamp-2 font-display font-semibold leading-snug">{c.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{c.instructor}</p>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-gold text-gold" /> {c.rating}</span>
          <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {c.learners}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {c.duration}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {c.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-primary">Start Learning</span>
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>
    </motion.a>
  );
}

function Roadmap() {
  return (
    <DashboardLayout title="Career Roadmap" subtitle="A personalized quarter-by-quarter path with AI-curated courses.">
      <Card className="mb-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Overall progress</p>
            <p className="mt-1 font-display text-3xl font-bold">62% complete</p>
          </div>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/15">On track for Aug 2026 placement</Badge>
        </div>
        <Progress value={62} className="mt-4 h-2.5" />
      </Card>

      <div className="relative">
        <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-primary via-primary/40 to-transparent md:block" />
        <div className="space-y-8">
          {milestones.map((m, i) => (
            <motion.section
              key={m.q}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative md:pl-16"
            >
              <div className={`absolute left-0 top-4 hidden h-12 w-12 place-items-center rounded-full shadow-elegant md:grid ${m.active ? "gradient-emerald text-white" : m.done ? "bg-success text-white" : "bg-muted text-muted-foreground"}`}>
                <m.icon className="h-5 w-5" />
              </div>
              <Card className={`p-6 ${m.active ? "border-primary shadow-elegant" : ""}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{m.q}</p>
                    <h3 className="mt-1 font-display text-xl font-semibold">{m.title}</h3>
                  </div>
                  {m.active && <Badge className="bg-primary/15 text-primary hover:bg-primary/15">In progress</Badge>}
                  {m.done && <Badge className="bg-success/15 text-success hover:bg-success/15">Completed</Badge>}
                </div>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {m.items.map((it) => (
                    <li key={it.label} className="flex items-center gap-2 text-sm">
                      {it.done ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                      <span className={it.done ? "text-muted-foreground line-through" : ""}>{it.label}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold">
                      <Sparkles className="h-4 w-4 text-primary" /> AI-recommended courses
                    </p>
                    <Button variant="ghost" size="sm" className="rounded-full text-xs">View all</Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {roadmapCourses[m.key].map((c) => <CourseCard key={c.title} c={c} />)}
                  </div>
                </div>
              </Card>
            </motion.section>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
