import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  FileText, Target, TrendingUp, ArrowUpRight, Sparkles, Briefcase,
  Code2, Trophy, Building2, CheckCircle2, Clock, Activity, Flame,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { SkillAnalysis } from "@/components/skill-analysis";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  recommendedSkills, recommendedProjects, eligibleCompanies,
  internships, hackathons, roadmap, assignments, interviewHistory, activities, performanceTrend,
} from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Student Dashboard · LUMINA AI" }] }),
  component: Dashboard,
});

function Stat({ icon: Icon, label, value, delta, accent }: any) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold">{value}</p>
          {delta && <p className="mt-1 text-xs text-success flex items-center gap-1"><TrendingUp className="h-3 w-3" />{delta}</p>}
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${accent}`}><Icon className="h-5 w-5" /></div>
      </div>
    </Card>
  );
}

export function Dashboard() {
  return (
    <DashboardLayout title="Welcome back, Aarav 👋" subtitle="Here's your placement readiness snapshot for this week.">
      {/* TOP STATS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden p-6">
          <div className="absolute inset-0 gradient-emerald opacity-95" />
          <div className="relative text-white">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-white/80">Resume Score</p>
              <FileText className="h-5 w-5" />
            </div>
            <p className="mt-3 font-display text-5xl font-bold">87<span className="text-2xl text-white/70">/100</span></p>
            <Link to="/resume" className="mt-3 inline-flex items-center text-sm font-medium text-white hover:underline">Improve <ArrowUpRight className="ml-1 h-3 w-3" /></Link>
          </div>
        </Card>
        <Stat icon={Target} label="Placement Readiness" value="78%" delta="+12% MoM" accent="bg-primary/10 text-primary" />
        <Stat icon={Flame} label="Streak" value="14 days" delta="Keep it up" accent="bg-gold/15 text-gold" />
        <Stat icon={Briefcase} label="Eligible Companies" value="14" delta="+3 this week" accent="bg-primary/10 text-primary" />
      </div>

      {/* SKILL ANALYSIS + RECOMMENDED SKILLS */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SkillAnalysis />
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Recommended Skills</h3>
            <Sparkles className="h-4 w-4 text-gold" />
          </div>
          <ul className="mt-4 space-y-3">
            {recommendedSkills.map((s) => (
              <li key={s.name} className="rounded-xl border border-border p-3 transition hover:border-primary/40">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{s.name}</p>
                  <Button size="sm" variant="ghost" className="h-7 text-xs">Add</Button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{s.reason}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* PROJECTS + COMPANIES */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Recommended Projects</h3>
            <Code2 className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 space-y-3">
            {recommendedProjects.map((p) => (
              <div key={p.title} className="rounded-xl border border-border p-4 transition hover:border-primary/40 hover:shadow-elegant">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{p.title}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {p.stack.map((s) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{p.difficulty}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Eligible Companies</h3>
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 space-y-2">
            {eligibleCompanies.map((c) => (
              <div key={c.name} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/15 text-primary text-sm">{c.name[0]}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-semibold">{c.name}</p>
                    <span className="text-sm font-bold text-primary">{c.match}%</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{c.role} · {c.ctc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* INTERNSHIPS + HACKATHONS */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Recommended Internships</h3>
            <Link to="/opportunities" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="mt-4 space-y-2">
            {internships.slice(0, 3).map((i) => (
              <div key={i.title} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{i.title}</p>
                  <Badge className="bg-primary/10 text-primary">{i.stipend}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{i.company} · {i.location}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Hackathons</h3>
            <Trophy className="h-4 w-4 text-gold" />
          </div>
          <div className="mt-4 space-y-2">
            {hackathons.map((h) => (
              <div key={h.name} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <p className="font-semibold">{h.name}</p>
                  <p className="text-xs text-muted-foreground">{h.date} · {h.mode}</p>
                </div>
                <Badge className="bg-gold/15 text-gold">{h.prize}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ROADMAP */}
      <Card className="mt-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold">Career Roadmap</h3>
            <p className="text-sm text-muted-foreground">Your personalized path to placement.</p>
          </div>
          <Link to="/roadmap" className="text-xs text-primary hover:underline">Full roadmap →</Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {roadmap.map((r, i) => (
            <motion.div key={r.quarter} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
              <div className={`rounded-xl border p-4 ${r.active ? "border-primary bg-primary/5" : "border-border"}`}>
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{r.quarter}</p>
                  {r.done && <CheckCircle2 className="h-4 w-4 text-success" />}
                </div>
                <p className="mt-2 font-display font-semibold">{r.title}</p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">{r.milestones.map((m) => <li key={m}>• {m}</li>)}</ul>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* ASSIGNMENTS + INTERVIEWS + ACTIVITIES */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Assignment Performance</h3>
            <Link to="/assignments" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="mt-4 space-y-3">
            {assignments.map((a) => (
              <div key={a.title} className="rounded-xl border border-border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.subject} · Due {a.due}</p>
                  </div>
                  <Badge variant={a.status === "Submitted" ? "default" : "secondary"} className={a.status === "Submitted" ? "bg-success/15 text-success hover:bg-success/15" : ""}>{a.status}</Badge>
                </div>
                <Progress value={a.progress} className="mt-3 h-2" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold">Mock Interview Score</h3>
          <div className="mt-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceTrend}>
                <defs><linearGradient id="g1" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Area dataKey="mock" stroke="var(--color-primary)" fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-2">
            {interviewHistory.slice(0, 3).map((h) => (
              <li key={h.type} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{h.type}</span>
                <span className="font-semibold">{h.score}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* RECENT ACTIVITY */}
      <Card className="mt-6 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Recent Activity</h3>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>
        <ul className="mt-4 space-y-3">
          {activities.map((a, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><Sparkles className="h-3 w-3" /></div>
              <div className="min-w-0 flex-1">
                <p className="text-sm">{a.text}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{a.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </DashboardLayout>
  );
}
