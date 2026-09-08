import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Users, Building2, Award, MapPin } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area,
} from "recharts";
import { placementStats, skillDistribution, recruiterActivity, performanceTrend } from "@/lib/mock-data";
import { placementFunnel, monthlyRegistrations, topSkills, engagementByHour, geoDistribution } from "@/lib/admin-data";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics · LUMINA AI" }] }),
  component: Analytics,
});

const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

export function Analytics() {
  const maxFunnel = Math.max(...placementFunnel.map((f) => f.value));

  return (
    <DashboardLayout title="Analytics Dashboard" subtitle="Deep-dive into placement, skill and recruiter performance.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Avg. readiness", v: "78%", d: "+6% MoM", i: TrendingUp },
          { l: "Engaged students", v: "3.4K", d: "+12% MoM", i: Users },
          { l: "Top recruiters", v: 42, d: "+5 this term", i: Building2 },
          { l: "Offers closed", v: 312, d: "+18% YoY", i: Award },
        ].map((s) => (
          <Card key={s.l} className="p-5">
            <div className="flex items-start justify-between">
              <div><p className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</p><p className="mt-2 font-display text-3xl font-bold">{s.v}</p><p className="mt-1 text-xs text-success">{s.d}</p></div>
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><s.i className="h-5 w-5" /></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Placement funnel */}
      <Card className="mt-6 p-6">
        <div className="flex items-center justify-between">
          <div><h3 className="font-display text-lg font-semibold">Placement Funnel</h3><p className="text-sm text-muted-foreground">Student journey from registration to placement.</p></div>
          <Badge variant="outline">This term</Badge>
        </div>
        <div className="mt-5 space-y-2">
          {placementFunnel.map((f, i) => {
            const width = (f.value / maxFunnel) * 100;
            const prev = i === 0 ? null : placementFunnel[i - 1].value;
            const dropoff = prev ? Math.round((1 - f.value / prev) * 100) : 0;
            return (
              <div key={f.stage} className="grid grid-cols-[160px_1fr_120px] items-center gap-4">
                <span className="text-sm font-medium">{f.stage}</span>
                <div className="relative h-8 overflow-hidden rounded-full bg-muted/50">
                  <div className="h-full gradient-emerald transition-all" style={{ width: `${width}%` }} />
                  <span className="absolute inset-0 flex items-center justify-end pr-3 text-xs font-semibold text-foreground/80">{f.value.toLocaleString()}</span>
                </div>
                <span className="text-right text-xs text-muted-foreground">{i === 0 ? "—" : `${dropoff}% dropoff`}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between"><h3 className="font-display text-lg font-semibold">Placement Analytics</h3><Badge variant="outline">6 months</Badge></div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={placementStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="placed" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="offers" fill="var(--color-gold)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold">Skill Distribution</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={skillDistribution} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}>
                  {skillDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold">Monthly Registrations</h3>
          <p className="text-sm text-muted-foreground">New students & recruiters onboarded.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRegistrations}>
                <defs>
                  <linearGradient id="reg1" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="reg2" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--color-gold)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--color-gold)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area dataKey="students" stroke="var(--color-primary)" fill="url(#reg1)" />
                <Area dataKey="recruiters" stroke="var(--color-gold)" fill="url(#reg2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold">Top Skills</h3>
          <p className="text-sm text-muted-foreground">Students enrolled per skill track.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSkills} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <YAxis type="category" dataKey="skill" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} width={110} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Bar dataKey="students" fill="var(--color-primary)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold">Recruiter Activity</h3>
          <p className="text-sm text-muted-foreground">Daily views & shortlists.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recruiterActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line dataKey="views" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line dataKey="shortlists" stroke="var(--color-gold)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold">Student Performance Trend</h3>
          <p className="text-sm text-muted-foreground">Resume score & mock interview average.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceTrend}>
                <defs>
                  <linearGradient id="aa1" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="aa2" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--color-gold)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--color-gold)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area dataKey="score" stroke="var(--color-primary)" fill="url(#aa1)" />
                <Area dataKey="mock" stroke="var(--color-gold)" fill="url(#aa2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Engagement by hour + Geo */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-display text-lg font-semibold">Engagement by Hour</h3>
          <p className="text-sm text-muted-foreground">Peak platform activity throughout the day.</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementByHour}>
                <defs>
                  <linearGradient id="eh1" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.6} /><stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="hour" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Area dataKey="value" stroke="var(--color-primary)" fill="url(#eh1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />Geo Distribution</h3>
          <p className="text-sm text-muted-foreground">Top cities by student count.</p>
          <div className="mt-4 space-y-2.5">
            {geoDistribution.map((g) => {
              const max = geoDistribution[0].students;
              const w = (g.students / max) * 100;
              return (
                <div key={g.city}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{g.city}</span>
                    <span className="text-muted-foreground">{g.students.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full gradient-emerald" style={{ width: `${w}%` }} /></div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
