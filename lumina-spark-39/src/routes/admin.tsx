import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Users, Building2, Briefcase, GraduationCap, Calendar, BarChart3, AlertTriangle, CheckCircle2, Info, ArrowUpRight, TrendingUp, Sparkles } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/safe-image";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import { placementStats, skillDistribution } from "@/lib/mock-data";
import { departmentPerformance, systemAlerts, richSessions, richRecruiters, clearbitLogo } from "@/lib/admin-data";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · LUMINA AI" }] }),
  component: Admin,
});

const PIE_COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

const alertTones: Record<string, { icon: typeof AlertTriangle; wrap: string; iconWrap: string }> = {
  warning: { icon: AlertTriangle, wrap: "border-warning/30 bg-warning/5", iconWrap: "bg-warning/15 text-warning" },
  success: { icon: CheckCircle2, wrap: "border-success/30 bg-success/5", iconWrap: "bg-success/15 text-success" },
  info: { icon: Info, wrap: "border-primary/30 bg-primary/5", iconWrap: "bg-primary/15 text-primary" },
};

export function Admin() {
  const kpis = [
    { l: "Total Students", v: "4,218", d: "+218 this term", i: Users, gradient: true },
    { l: "Total Recruiters", v: "312", d: "+24 this month", i: Building2 },
    { l: "Active Opportunities", v: "187", d: "+12 this week", i: Briefcase },
    { l: "Placement Rate", v: "87.4%", d: "+5.2% YoY", i: GraduationCap },
  ];

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Institution-wide overview of students, recruiters and placement performance.">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((s, i) => (
          <motion.div key={s.l} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`p-5 ${s.gradient ? "relative overflow-hidden" : ""}`}>
              {s.gradient && <div className="absolute inset-0 gradient-emerald opacity-95" />}
              <div className={`relative flex items-start justify-between ${s.gradient ? "text-white" : ""}`}>
                <div>
                  <p className={`text-xs uppercase tracking-wider ${s.gradient ? "text-white/80" : "text-muted-foreground"}`}>{s.l}</p>
                  <p className="mt-2 font-display text-3xl font-bold">{s.v}</p>
                  <p className={`mt-1 text-xs ${s.gradient ? "text-white/80" : "text-success"}`}>{s.d}</p>
                </div>
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${s.gradient ? "bg-white/15 text-white" : "bg-primary/10 text-primary"}`}><s.i className="h-5 w-5" /></div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link to="/admin/students"><Button size="sm" variant="outline" className="rounded-full"><Users className="mr-1.5 h-3.5 w-3.5" />Manage students</Button></Link>
        <Link to="/admin/recruiters"><Button size="sm" variant="outline" className="rounded-full"><Building2 className="mr-1.5 h-3.5 w-3.5" />Approve recruiters</Button></Link>
        <Link to="/admin/sessions"><Button size="sm" variant="outline" className="rounded-full"><Calendar className="mr-1.5 h-3.5 w-3.5" />New session</Button></Link>
        <Link to="/admin/analytics"><Button size="sm" variant="outline" className="rounded-full"><BarChart3 className="mr-1.5 h-3.5 w-3.5" />Analytics</Button></Link>
      </div>

      {/* Charts row */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div><h3 className="font-display text-lg font-semibold">Placement Statistics</h3><p className="text-sm text-muted-foreground">Offers & confirmed placements per month.</p></div>
            <Badge variant="outline">Last 6 months</Badge>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={placementStats}>
                <defs>
                  <linearGradient id="ag1" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.6} /><stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="ag2" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--color-gold)" stopOpacity={0.6} /><stop offset="100%" stopColor="var(--color-gold)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Area dataKey="offers" stroke="var(--color-gold)" fill="url(#ag2)" />
                <Area dataKey="placed" stroke="var(--color-primary)" fill="url(#ag1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold">Skill Distribution</h3>
          <p className="text-sm text-muted-foreground">Students by core domain.</p>
          <div className="mt-4 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={skillDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                  {skillDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Department performance + Alerts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div><h3 className="font-display text-lg font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" />Department Performance</h3><p className="text-sm text-muted-foreground">Placement rate by branch.</p></div>
            <Badge variant="outline">All batches</Badge>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="dept" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Bar dataKey="rate" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {departmentPerformance.map((d) => (
              <div key={d.dept} className="rounded-lg border border-border p-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{d.dept}</p>
                <p className="text-sm font-semibold">{d.placed}/{d.students}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-gold" />System Alerts</h3>
            <Badge variant="outline">{systemAlerts.length}</Badge>
          </div>
          <div className="mt-4 space-y-2">
            {systemAlerts.map((a) => {
              const tone = alertTones[a.tone] ?? alertTones.info;
              const Icon = tone.icon;
              return (
                <div key={a.id} className={`rounded-xl border p-3 ${tone.wrap}`}>
                  <div className="flex items-start gap-3">
                    <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${tone.iconWrap}`}><Icon className="h-4 w-4" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-tight">{a.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{a.detail}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{a.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Sessions + Top Recruiters */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div><h3 className="font-display text-lg font-semibold flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />Session Management</h3><p className="text-sm text-muted-foreground">Active and recent recruitment drives.</p></div>
            <Link to="/admin/sessions"><Button size="sm" className="rounded-full gradient-emerald text-white">Manage sessions</Button></Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border"><th className="py-3 text-left">Session</th><th className="text-left">Students</th><th className="text-left">Recruiters</th><th className="text-left">Offers</th><th className="text-right">Status</th></tr>
              </thead>
              <tbody>
                {richSessions.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium">{s.name}<p className="text-[10px] text-muted-foreground">{s.starts}</p></td>
                    <td className="text-muted-foreground">{s.students}</td>
                    <td className="text-muted-foreground">{s.recruiters}</td>
                    <td className="font-semibold text-primary">{s.offers}</td>
                    <td className="text-right">
                      <Badge className={
                        s.status === "Active" ? "bg-success/15 text-success hover:bg-success/15" :
                        s.status === "Upcoming" ? "bg-warning/15 text-warning hover:bg-warning/15" :
                        "bg-muted text-muted-foreground"
                      }>{s.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Top Recruiters</h3>
            <Link to="/admin/recruiters"><Button size="sm" variant="ghost" className="rounded-full text-xs">View all <ArrowUpRight className="ml-1 h-3 w-3" /></Button></Link>
          </div>
          <div className="mt-4 space-y-3">
            {richRecruiters.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center gap-3">
                <SafeImage src={clearbitLogo(r.domain)} alt={r.name} className="h-9 w-9 rounded-lg border border-border bg-white object-contain p-1" onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{r.name}</p>
                  <p className="text-[11px] text-muted-foreground">{r.roles} roles · {r.hires} hires · {r.avgCtc}</p>
                </div>
                <Badge className={
                  r.tier === "Platinum" ? "bg-gold/15 text-gold hover:bg-gold/15" :
                  r.tier === "Gold" ? "bg-primary/15 text-primary hover:bg-primary/15" :
                  "bg-muted text-muted-foreground"
                }>{r.tier}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Analytics CTA */}
      <Link to="/admin/analytics" className="mt-6 block">
        <Card className="p-6 transition hover:border-primary/40 hover:shadow-elegant">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl gradient-emerald"><BarChart3 className="h-5 w-5 text-white" /></div>
              <div><p className="font-display font-semibold">Full Analytics Dashboard</p><p className="text-sm text-muted-foreground">Deep-dive placement, skill and recruiter analytics.</p></div>
            </div>
            <Button variant="outline" className="rounded-full">Open →</Button>
          </div>
        </Card>
      </Link>
    </DashboardLayout>
  );
}
