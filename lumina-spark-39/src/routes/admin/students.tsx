import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Download, MoreHorizontal, ChevronDown, Users as UsersIcon, GraduationCap, Award } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { richStudents } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/students")({
  head: () => ({ meta: [{ title: "Students · LUMINA AI" }] }),
  component: StudentsPage,
});

const BRANCHES = ["All", "CSE", "ISE", "AI/ML", "ECE"];
const STATUSES = ["All", "Placed", "Interviewing", "Applying", "Preparing"];

function StudentsPage() {
  const [q, setQ] = useState("");
  const [branch, setBranch] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState<"readiness" | "cgpa" | "applications" | "recent">("readiness");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return richStudents
      .filter((s) => (branch === "All" || s.branch === branch))
      .filter((s) => (status === "All" || s.status === status))
      .filter((s) => !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.email.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => {
        if (sort === "readiness") return b.readiness - a.readiness;
        if (sort === "cgpa") return b.cgpa - a.cgpa;
        if (sort === "applications") return b.applications - a.applications;
        return 0;
      });
  }, [q, branch, status, sort]);

  const placedCount = richStudents.filter((s) => s.status === "Placed").length;
  const avgReadiness = Math.round(richStudents.reduce((sum, s) => sum + s.readiness, 0) / richStudents.length);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };
  const toggleAll = () => setSelected((prev) => (prev.size === filtered.length ? new Set() : new Set(filtered.map((s) => s.id))));

  const statusBadge = (s: string) =>
    s === "Placed" ? "bg-success/15 text-success hover:bg-success/15" :
    s === "Interviewing" ? "bg-primary/15 text-primary hover:bg-primary/15" :
    s === "Applying" ? "bg-warning/15 text-warning hover:bg-warning/15" :
    "bg-muted text-muted-foreground";

  return (
    <DashboardLayout title="Student Management" subtitle="Track readiness, placement status and engagement across your institution.">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { l: "Total students", v: richStudents.length.toString(), i: UsersIcon, c: "bg-primary/10 text-primary" },
          { l: "Placed", v: placedCount.toString(), i: Award, c: "bg-success/15 text-success" },
          { l: "Avg. readiness", v: `${avgReadiness}%`, i: GraduationCap, c: "bg-gold/15 text-gold" },
        ].map((s) => (
          <Card key={s.l} className="p-5">
            <div className="flex items-start justify-between">
              <div><p className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</p><p className="mt-2 font-display text-3xl font-bold">{s.v}</p></div>
              <div className={`grid h-11 w-11 place-items-center rounded-xl ${s.c}`}><s.i className="h-5 w-5" /></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <Card className="mt-6 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email…" className="h-11 rounded-full bg-muted pl-10" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full">Branch: {branch} <ChevronDown className="ml-1 h-3 w-3" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {BRANCHES.map((b) => <DropdownMenuItem key={b} onClick={() => setBranch(b)}>{b}</DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full">Status: {status} <ChevronDown className="ml-1 h-3 w-3" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {STATUSES.map((b) => <DropdownMenuItem key={b} onClick={() => setStatus(b)}>{b}</DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full">Sort: {sort} <ChevronDown className="ml-1 h-3 w-3" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSort("readiness")}>Readiness</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort("cgpa")}>CGPA</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort("applications")}>Applications</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort("recent")}>Recent activity</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" className="rounded-full"><Download className="mr-1.5 h-3.5 w-3.5" />Export CSV</Button>
          </div>
        </div>
        {selected.size > 0 && (
          <div className="mt-3 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-3">
            <p className="text-sm"><span className="font-semibold">{selected.size}</span> selected</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="rounded-full">Send nudge</Button>
              <Button size="sm" variant="outline" className="rounded-full">Assign session</Button>
              <Button size="sm" className="rounded-full gradient-emerald text-white">Bulk action</Button>
            </div>
          </div>
        )}
      </Card>

      {/* Table */}
      <Card className="mt-4 overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground">
            <tr className="border-b border-border">
              <th className="p-4 text-left"><input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="h-4 w-4 rounded border-border accent-primary" /></th>
              <th className="text-left">Student</th>
              <th className="text-left">Branch · Batch</th>
              <th className="text-left">CGPA</th>
              <th className="text-left">Readiness</th>
              <th className="text-left">Apps</th>
              <th className="text-left">Placement</th>
              <th className="text-left">Last active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                <td className="p-4"><input type="checkbox" checked={selected.has(s.id)} onChange={() => toggle(s.id)} className="h-4 w-4 rounded border-border accent-primary" /></td>
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary/15 text-primary">{s.name.split(" ").map((p) => p[0]).join("")}</AvatarFallback></Avatar>
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-[11px] text-muted-foreground">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="text-muted-foreground">{s.branch} · {s.batch}</td>
                <td className="font-semibold">{s.cgpa.toFixed(1)}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted"><div className="h-full gradient-emerald" style={{ width: s.readiness + "%" }} /></div>
                    <span className="text-xs font-semibold">{s.readiness}%</span>
                  </div>
                </td>
                <td className="text-muted-foreground">{s.applications}</td>
                <td>
                  <Badge className={statusBadge(s.status)}>
                    {s.placed !== "—" ? s.placed : s.status}
                  </Badge>
                </td>
                <td className="text-xs text-muted-foreground">{s.lastActive}</td>
                <td className="pr-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuItem>Send message</DropdownMenuItem>
                      <DropdownMenuItem>Reset readiness</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Remove from batch</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="p-8 text-center text-sm text-muted-foreground">No students match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </DashboardLayout>
  );
}
