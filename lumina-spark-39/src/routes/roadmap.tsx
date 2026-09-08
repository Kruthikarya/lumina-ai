import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Sparkles, BookOpen, Trophy, Rocket } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/roadmap")({
  head: () => ({ meta: [{ title: "Career Roadmap · LUMINA AI" }] }),
  component: Roadmap,
});

const milestones = [
  { q: "Q1 2026", title: "Foundations", icon: BookOpen, done: true, items: [
    { label: "Master DSA fundamentals", done: true },
    { label: "Build 2 portfolio projects", done: true },
    { label: "Reach 80+ resume score", done: true },
  ]},
  { q: "Q2 2026", title: "Specialization", icon: Sparkles, done: true, items: [
    { label: "Choose ML or Web specialization", done: true },
    { label: "Complete 1 paid internship", done: true },
    { label: "Publish 2 technical blog posts", done: false },
  ]},
  { q: "Q3 2026", title: "Production-grade", icon: Rocket, active: true, items: [
    { label: "Ship 1 open-source contribution", done: true },
    { label: "Mock 5 interviews", done: false },
    { label: "Reach 85% placement readiness", done: false },
  ]},
  { q: "Q4 2026", title: "Placement", icon: Trophy, items: [
    { label: "Apply to 20 target companies", done: false },
    { label: "Clear 3 final rounds", done: false },
    { label: "Convert offer", done: false },
  ]},
];

export function Roadmap() {
  return (
    <DashboardLayout title="Career Roadmap" subtitle="A personalized quarter-by-quarter path to your dream offer.">
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
        <div className="space-y-6">
          {milestones.map((m, i) => (
            <motion.div key={m.q} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="relative md:pl-16">
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
                <ul className="mt-4 space-y-2">
                  {m.items.map((it) => (
                    <li key={it.label} className="flex items-center gap-2 text-sm">
                      {it.done ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                      <span className={it.done ? "text-muted-foreground line-through" : ""}>{it.label}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
