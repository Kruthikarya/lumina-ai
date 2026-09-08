import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, Users, Eye, MapPin, Briefcase, LayoutGrid, List, Search, Sparkles,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/safe-image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { richJobs, type RichJob } from "@/lib/recruiter-data";
import { clearbit } from "@/lib/real-data";

export const Route = createFileRoute("/recruiter/jobs")({
  head: () => ({ meta: [{ title: "Job Postings · LUMINA AI" }] }),
  component: JobsPage,
});

const STATUSES = ["All", "Live", "Draft", "Paused", "Closed"] as const;

function JobsPage() {
  const [jobs, setJobs] = useState<RichJob[]>(richJobs);
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");
  const [q, setQ] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ title: "", team: "", location: "Bangalore", ctc: "", skills: "" });

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (status !== "All" && j.status !== status) return false;
      if (q && !`${j.title} ${j.team} ${j.skills.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [jobs, status, q]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: jobs.length };
    for (const j of jobs) c[j.status] = (c[j.status] ?? 0) + 1;
    return c;
  }, [jobs]);

  const createJob = () => {
    if (!draft.title.trim()) return;
    const newJob: RichJob = {
      id: `custom-${Date.now()}`,
      title: draft.title,
      team: draft.team || "General",
      location: draft.location,
      workMode: "Hybrid",
      type: "Full-time",
      ctc: draft.ctc || "Competitive",
      postedDays: 0,
      applicants: 0,
      shortlisted: 0,
      interviewing: 0,
      offers: 0,
      views: 0,
      status: "Draft",
      skills: draft.skills.split(",").map((s) => s.trim()).filter(Boolean),
      companyDomain: "lumina.ai",
      companyLogo: clearbit("lumina.ai"),
    };
    setJobs([newJob, ...jobs]);
    setDraft({ title: "", team: "", location: "Bangalore", ctc: "", skills: "" });
    setOpen(false);
  };

  const statusBadge = (s: RichJob["status"]) =>
    s === "Live" ? "bg-success/15 text-success hover:bg-success/15" :
    s === "Draft" ? "bg-muted text-muted-foreground hover:bg-muted" :
    s === "Paused" ? "bg-warning/15 text-warning hover:bg-warning/15" :
    "bg-destructive/15 text-destructive hover:bg-destructive/15";

  return (
    <DashboardLayout title="Job Postings" subtitle="Manage every role, its pipeline and posting status.">
      {/* Toolbar */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search roles…" className="h-10 rounded-full bg-muted pl-10" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {STATUSES.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={status === s ? "default" : "outline"}
                className={`rounded-full ${status === s ? "gradient-emerald text-white" : ""}`}
                onClick={() => setStatus(s)}
              >
                {s} <span className="ml-1 text-[10px] opacity-70">{counts[s] ?? 0}</span>
              </Button>
            ))}
            <div className="flex overflow-hidden rounded-full border border-border">
              <button onClick={() => setView("grid")} className={`px-2.5 py-1.5 ${view === "grid" ? "bg-muted" : ""}`}>
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setView("list")} className={`px-2.5 py-1.5 ${view === "list" ? "bg-muted" : ""}`}>
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full gradient-emerald text-white">
                  <Plus className="mr-1.5 h-3.5 w-3.5" />Post new role
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" /> New Job Posting
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div><Label>Role title</Label><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Senior Frontend Engineer" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Team</Label><Input value={draft.team} onChange={(e) => setDraft({ ...draft, team: e.target.value })} placeholder="Web Platform" /></div>
                    <div><Label>Location</Label><Input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} /></div>
                  </div>
                  <div><Label>Compensation</Label><Input value={draft.ctc} onChange={(e) => setDraft({ ...draft, ctc: e.target.value })} placeholder="₹24 LPA" /></div>
                  <div><Label>Key skills (comma-separated)</Label><Textarea rows={2} value={draft.skills} onChange={(e) => setDraft({ ...draft, skills: e.target.value })} placeholder="React, TypeScript, Next.js" /></div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={createJob} className="gradient-emerald text-white">Save as draft</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* Content */}
      {view === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((j, i) => {
            const pct = j.applicants ? Math.round((j.shortlisted / j.applicants) * 100) : 0;
            return (
              <motion.div key={j.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="p-5 transition hover:border-primary/40 hover:shadow-elegant h-full flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <SafeImage src={j.companyLogo} alt="" className="h-11 w-11 rounded-lg border border-border bg-white object-contain p-1.5" />
                      <div>
                        <h3 className="font-display font-semibold">{j.title}</h3>
                        <p className="text-xs text-muted-foreground">{j.team} · {j.type}</p>
                      </div>
                    </div>
                    <Badge className={statusBadge(j.status)}>{j.status}</Badge>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{j.location} · {j.workMode}</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{j.ctc}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {j.skills.map((s) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                    {[
                      { l: "Views", v: j.views, i: Eye },
                      { l: "Apps", v: j.applicants, i: Users },
                      { l: "Short.", v: j.shortlisted, i: Users },
                      { l: "Offers", v: j.offers, i: Sparkles },
                    ].map((m) => (
                      <div key={m.l} className="rounded-lg border border-border p-2">
                        <p className="font-display text-sm font-bold">{m.v}</p>
                        <p className="text-[10px] text-muted-foreground">{m.l}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                      <span>Shortlist rate</span><span>{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>

                  <div className="mt-4 flex gap-2 pt-3 border-t border-border">
                    <Button size="sm" variant="outline" className="flex-1 rounded-full">Edit</Button>
                    <Button size="sm" className="flex-1 rounded-full gradient-emerald text-white">View applicants</Button>
                  </div>

                  <p className="mt-2 text-[10px] text-muted-foreground text-right">Posted {j.postedDays}d ago</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                <th className="p-4 text-left">Role</th>
                <th className="text-left">Location</th>
                <th className="text-left">Applicants</th>
                <th className="text-left">Shortlisted</th>
                <th className="text-left">Offers</th>
                <th className="text-left">Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((j) => (
                <tr key={j.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <SafeImage src={j.companyLogo} alt="" className="h-8 w-8 rounded-lg border border-border bg-white object-contain p-1" />
                      <div>
                        <p className="font-medium">{j.title}</p>
                        <p className="text-xs text-muted-foreground">{j.team}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-muted-foreground">{j.location}</td>
                  <td className="text-muted-foreground"><span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{j.applicants}</span></td>
                  <td className="text-muted-foreground">{j.shortlisted}</td>
                  <td className="text-muted-foreground">{j.offers}</td>
                  <td><Badge className={statusBadge(j.status)}>{j.status}</Badge></td>
                  <td className="pr-4"><Button size="sm" variant="ghost">Manage</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {filtered.length === 0 && (
        <Card className="p-12 text-center">
          <Briefcase className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-semibold">No roles match this filter</p>
          <p className="text-sm text-muted-foreground">Adjust status or search to see more.</p>
        </Card>
      )}
    </DashboardLayout>
  );
}
