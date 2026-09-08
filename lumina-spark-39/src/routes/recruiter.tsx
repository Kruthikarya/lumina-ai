import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import {
  Users, UserPlus, Briefcase, TrendingUp, Search, Plus, Star,
  Sparkles, Calendar, MessageSquare, Zap, ArrowUpRight, Clock, Target,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/safe-image";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  AreaChart, Area, PieChart, Pie, Cell, Legend,
} from "recharts";
import { richCandidates, richJobs, funnelData, applicantSources, hiringTrend } from "@/lib/recruiter-data";
import { clearbit } from "@/lib/real-data";

export const Route = createFileRoute("/recruiter")({
  head: () => ({ meta: [{ title: "Recruiter · LUMINA AI" }] }),
  component: Recruiter,
});

const tints = {
  primary: "bg-primary/10 text-primary",
  gold: "bg-gold/10 text-gold",
  success: "bg-success/10 text-success",
} as const;

const stats = [
  { l: "Active roles", v: "8", d: "+2 this week", i: Briefcase, tint: "primary" as const },
  { l: "Candidates viewed", v: "1.2K", d: "+18% WoW", i: Users, tint: "gold" as const },
  { l: "Shortlisted", v: "132", d: "11% rate", i: UserPlus, tint: "success" as const },
  { l: "Offers extended", v: "14", d: "+3 MoM", i: TrendingUp, tint: "primary" as const },
];

const pieColors = ["var(--color-primary)", "var(--color-gold)", "var(--color-success)", "var(--color-muted-foreground)"];


export function Recruiter() {
  const [open, setOpen] = useState<"schedule" | "outreach" | null>(null);
  return (
    <DashboardLayout title="Recruiter Workspace" subtitle="AI-ranked candidates, live pipeline analytics & job postings.">
      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.l}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="relative overflow-hidden p-5 transition hover:shadow-elegant">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</p>
                  <p className="mt-2 font-display text-3xl font-bold">{s.v}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-success">
                    <ArrowUpRight className="h-3 w-3" />{s.d}
                  </p>
                </div>
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${tints[s.tint]}`}>
                  <s.i className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { i: Plus, l: "Post new role", to: "/recruiter/jobs" as const },
          { i: Search, l: "Find candidates", to: "/recruiter/candidates" as const },
          { i: Calendar, l: "Schedule interview", action: "schedule" as const },
          { i: MessageSquare, l: "Send outreach", action: "outreach" as const },
        ].map((a) => {
          const inner = (
            <Card className="group flex items-center gap-3 p-4 transition hover:border-primary/40 hover:shadow-elegant cursor-pointer">
              <div className="grid h-10 w-10 place-items-center rounded-xl gradient-emerald text-white">
                <a.i className="h-4 w-4" />
              </div>
              <span className="font-medium">{a.l}</span>
              <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground transition group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Card>
          );
          return "to" in a && a.to ? (
            <Link key={a.l} to={a.to}>{inner}</Link>
          ) : (
            <button key={a.l} type="button" className="text-left" onClick={() => setOpen(a.action ?? null)}>{inner}</button>
          );
        })}
      </div>

      <Dialog open={open === "schedule"} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule interview</DialogTitle>
            <DialogDescription>Book a slot with a shortlisted candidate.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="cand">Candidate</Label>
              <Input id="cand" defaultValue={richCandidates[0]?.name} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="gradient-emerald text-white"
              onClick={() => { setOpen(null); toast.success("Interview scheduled", { description: "Calendar invite sent to the candidate." }); }}
            >
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={open === "outreach"} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send outreach</DialogTitle>
            <DialogDescription>Reach out to a candidate with a personalised note.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="to">To</Label>
              <Input id="to" defaultValue={richCandidates[0]?.name} />
            </div>
            <div>
              <Label htmlFor="msg">Message</Label>
              <Textarea id="msg" rows={5} defaultValue="Hi! We loved your profile on LUMINA AI and would like to chat about an opening on our team." />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="gradient-emerald text-white"
              onClick={() => { setOpen(null); toast.success("Outreach sent", { description: "You'll be notified when they reply." }); }}
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Pipeline funnel + Sources */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Hiring Funnel
              </h3>
              <p className="text-sm text-muted-foreground">Conversion across every pipeline stage this quarter.</p>
            </div>
            <Badge className="bg-success/15 text-success hover:bg-success/15">1.1% offer rate</Badge>
          </div>
          <div className="mt-6 space-y-3">
            {funnelData.map((f, i) => {
              const pct = (f.value / funnelData[0].value) * 100;
              const conv = i > 0 ? Math.round((f.value / funnelData[i - 1].value) * 100) : 100;
              return (
                <div key={f.stage}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-medium">{f.stage}</span>
                    <span className="text-muted-foreground">
                      {f.value.toLocaleString()} · {i > 0 && <span className="text-success">{conv}% ↳</span>}
                    </span>
                  </div>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
                    style={{ transformOrigin: "left", background: f.color, width: `${pct}%` }}
                    className="h-6 rounded-lg"
                  />
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold">Applicant Sources</h3>
          <p className="text-sm text-muted-foreground">Where candidates come from.</p>
          <div className="mt-2 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={applicantSources} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {applicantSources.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Top candidates + hiring trend */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> AI-Ranked Candidates
              </h3>
              <p className="text-sm text-muted-foreground">Ranked for: Frontend Engineer Intern</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search…" className="h-9 rounded-full bg-muted pl-9 w-44" />
              </div>
              <Link to="/recruiter/candidates">
                <Button size="sm" variant="outline" className="rounded-full">View all</Button>
              </Link>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {richCandidates.slice(0, 5).map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link to="/recruiter/candidate" className="flex items-center gap-4 rounded-xl border border-border p-3 transition hover:border-primary/40 hover:bg-muted/40">
                  <Avatar className="h-11 w-11">
                    <AvatarImage src={clearbit(c.universityDomain)} alt="" />
                    <AvatarFallback className="bg-primary/15 text-primary">{c.initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold flex items-center gap-1.5">
                      <Star className="h-3 w-3 fill-gold text-gold" />{c.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{c.headline} · {c.university}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {c.skills.slice(0, 4).map((s) => (
                        <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-primary/15 text-primary hover:bg-primary/15">{c.match}%</Badge>
                    <p className="mt-1 text-[10px] text-muted-foreground flex items-center gap-1 justify-end">
                      <Clock className="h-2.5 w-2.5" />{c.lastActive}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold flex items-center gap-2">
            <Zap className="h-4 w-4 text-gold" /> Hiring Velocity
          </h3>
          <p className="text-sm text-muted-foreground">Applications & offers, last 6 weeks.</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hiringTrend}>
                <defs>
                  <linearGradient id="apps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="week" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="applications" stroke="var(--color-primary)" fill="url(#apps)" strokeWidth={2} />
                <Area type="monotone" dataKey="offers" stroke="var(--color-gold)" fill="var(--color-gold)" fillOpacity={0.25} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg border border-border p-2">
              <p className="text-[10px] uppercase text-muted-foreground">Avg time to hire</p>
              <p className="font-display text-lg font-bold">18 days</p>
            </div>
            <div className="rounded-lg border border-border p-2">
              <p className="text-[10px] uppercase text-muted-foreground">Offer accept rate</p>
              <p className="font-display text-lg font-bold text-success">78%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Jobs + weekly bar */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Active Job Postings</h3>
            <Link to="/recruiter/jobs">
              <Button size="sm" className="rounded-full gradient-emerald text-white">
                <Plus className="mr-1.5 h-3 w-3" />New role
              </Button>
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {richJobs.slice(0, 4).map((j) => (
              <div key={j.id} className="flex items-center justify-between rounded-xl border border-border p-3 hover:bg-muted/40 transition">
                <div className="flex items-center gap-3 min-w-0">
                  <SafeImage src={j.companyLogo} alt="" className="h-9 w-9 rounded-lg border border-border bg-white object-contain p-1" />
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{j.title}</p>
                    <p className="text-xs text-muted-foreground">{j.applicants} applicants · {j.shortlisted} shortlisted · {j.workMode}</p>
                  </div>
                </div>
                <Badge className={
                  j.status === "Live" ? "bg-success/15 text-success hover:bg-success/15" :
                  j.status === "Draft" ? "bg-muted text-muted-foreground" : "bg-warning/15 text-warning hover:bg-warning/15"
                }>{j.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold">Weekly Pipeline</h3>
          <p className="text-sm text-muted-foreground">Views vs. shortlists this week.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { day: "Mon", views: 124, shortlists: 18 },
                { day: "Tue", views: 168, shortlists: 22 },
                { day: "Wed", views: 142, shortlists: 17 },
                { day: "Thu", views: 201, shortlists: 28 },
                { day: "Fri", views: 188, shortlists: 31 },
                { day: "Sat", views: 96, shortlists: 9 },
                { day: "Sun", views: 72, shortlists: 6 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="views" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="shortlists" fill="var(--color-gold)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent activity */}
      <Card className="mt-6 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Recent Activity</h3>
          <Link to="/recruiter/candidates"><Button size="sm" variant="ghost">View all</Button></Link>
        </div>
        <div className="mt-4 space-y-3">
          {[
            { i: UserPlus, t: "Priya Verma applied to Frontend Engineer Intern", tm: "2m ago", tint: "primary" as const },
            { i: Calendar, t: "Interview scheduled with Rohan Iyer for tomorrow, 3PM", tm: "1h ago", tint: "gold" as const },
            { i: Star, t: "You shortlisted Sneha Kapoor for Backend SDE role", tm: "3h ago", tint: "success" as const },
            { i: MessageSquare, t: "Reply received from Arjun Patel on outreach", tm: "1d ago", tint: "primary" as const },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/40 transition">
              <div className={`grid h-8 w-8 place-items-center rounded-lg ${tints[a.tint]}`}>
                <a.i className="h-4 w-4" />
              </div>
              <p className="flex-1 text-sm">{a.t}</p>
              <span className="text-xs text-muted-foreground">{a.tm}</span>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
}
