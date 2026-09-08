import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Users, Building2, Calendar, MoreHorizontal, CheckCircle2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { richSessions } from "@/lib/admin-data";

export const Route = createFileRoute("/sessions")({
  head: () => ({ meta: [{ title: "Sessions · LUMINA AI" }] }),
  component: Sessions,
});

const TABS = ["All", "Active", "Upcoming", "Closed"] as const;

export function Sessions() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const filtered = richSessions.filter((s) => tab === "All" || s.status === tab);

  const counts = {
    Active: richSessions.filter((s) => s.status === "Active").length,
    Upcoming: richSessions.filter((s) => s.status === "Upcoming").length,
    Closed: richSessions.filter((s) => s.status === "Closed").length,
  };
  const totalStudents = richSessions.reduce((sum, s) => sum + s.students, 0);
  const totalRecruiters = richSessions.reduce((sum, s) => sum + s.recruiters, 0);

  const statusColor = (s: string) =>
    s === "Active" ? "bg-success/15 text-success hover:bg-success/15" :
    s === "Upcoming" ? "bg-warning/15 text-warning hover:bg-warning/15" :
    "bg-muted text-muted-foreground";

  return (
    <DashboardLayout title="Session Management" subtitle="Create and manage recruitment drives, students and recruiters.">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { l: "Active sessions", v: counts.Active, c: "bg-success/15 text-success", i: Calendar },
          { l: "Total students enrolled", v: totalStudents, c: "bg-primary/10 text-primary", i: Users },
          { l: "Recruiters engaged", v: totalRecruiters, c: "bg-gold/15 text-gold", i: Building2 },
        ].map((s) => (
          <Card key={s.l} className="p-5">
            <div className="flex items-start justify-between">
              <div><p className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</p><p className="mt-2 font-display text-3xl font-bold">{s.v}</p></div>
              <div className={`grid h-11 w-11 place-items-center rounded-xl ${s.c}`}><s.i className="h-5 w-5" /></div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-lg font-semibold">All Sessions</h3>
            <div className="flex flex-wrap gap-1.5">
              {TABS.map((t) => (
                <Button key={t} size="sm" variant={tab === t ? "default" : "outline"} className={`rounded-full ${tab === t ? "gradient-emerald text-white" : ""}`} onClick={() => setTab(t)}>
                  {t}{t !== "All" && <span className="ml-1.5 text-[10px] opacity-70">{counts[t as keyof typeof counts]}</span>}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {filtered.map((s) => {
              const conversion = s.students > 0 ? Math.round((s.offers / s.students) * 100) : 0;
              return (
                <div key={s.id} className="rounded-xl border border-border p-4 transition hover:border-primary/40">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-display font-semibold">{s.name}</p>
                        <Badge className={statusColor(s.status)}>{s.status}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{s.starts} → {s.ends} · {s.eligibility}</p>
                      <div className="mt-3 flex flex-wrap gap-4 text-xs">
                        <span className="text-muted-foreground">Students: <span className="font-semibold text-foreground">{s.students}</span></span>
                        <span className="text-muted-foreground">Recruiters: <span className="font-semibold text-foreground">{s.recruiters}</span></span>
                        <span className="text-muted-foreground">Offers: <span className="font-semibold text-primary">{s.offers}</span></span>
                        <span className="text-muted-foreground">Conversion: <span className="font-semibold text-gold">{conversion}%</span></span>
                      </div>
                      {s.students > 0 && (
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div className="h-full gradient-emerald" style={{ width: `${Math.min(100, conversion * 3)}%` }} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button size="sm" variant="outline" className="rounded-full">Manage</Button>
                      {s.status === "Closed" && <Badge variant="outline" className="gap-1"><CheckCircle2 className="h-3 w-3" />Archived</Badge>}
                      <Button size="icon" variant="ghost" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No sessions in this category yet.</div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold">Create Session</h3>
          <p className="text-sm text-muted-foreground">Spin up a new placement drive.</p>
          <form className="mt-5 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2"><Label>Session name</Label><Input placeholder="Spring 2027 Placements" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Start date</Label><Input type="date" /></div>
              <div className="space-y-2"><Label>End date</Label><Input type="date" /></div>
            </div>
            <div className="space-y-2"><Label>Eligibility</Label><Input placeholder="CGPA ≥ 7.5, Final year" /></div>
            <Button className="w-full rounded-full gradient-emerald text-white"><Plus className="mr-1.5 h-3.5 w-3.5" />Create session</Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
