import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Building2, MoreHorizontal, Plus, Search, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/safe-image";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { richRecruiters, clearbitLogo } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/recruiters")({
  head: () => ({ meta: [{ title: "Recruiters · LUMINA AI" }] }),
  component: RecruitersPage,
});

const TIERS = ["All", "Platinum", "Gold", "Silver"] as const;

function RecruitersPage() {
  const [q, setQ] = useState("");
  const [tier, setTier] = useState<(typeof TIERS)[number]>("All");
  const [inviteOpen, setInviteOpen] = useState(false);

  const filtered = useMemo(() =>
    richRecruiters
      .filter((r) => tier === "All" || r.tier === tier)
      .filter((r) => !q || r.name.toLowerCase().includes(q.toLowerCase())),
    [q, tier]
  );

  const tierBadge = (t: string) =>
    t === "Platinum" ? "bg-gold/15 text-gold hover:bg-gold/15" :
    t === "Gold" ? "bg-primary/15 text-primary hover:bg-primary/15" :
    "bg-muted text-muted-foreground";

  const totalHires = richRecruiters.reduce((s, r) => s + r.hires, 0);
  const totalRoles = richRecruiters.reduce((s, r) => s + r.roles, 0);

  return (
    <DashboardLayout title="Recruiter Management" subtitle="Approved partners, role volume and hire conversion.">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { l: "Partners", v: richRecruiters.length },
          { l: "Open roles", v: totalRoles },
          { l: "Hires this term", v: totalHires },
          { l: "Platinum tier", v: richRecruiters.filter((r) => r.tier === "Platinum").length },
        ].map((s) => (
          <Card key={s.l} className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</p>
            <p className="mt-2 font-display text-3xl font-bold">{s.v}</p>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <Card className="mt-6 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search recruiters…" className="h-11 rounded-full bg-muted pl-10" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {TIERS.map((t) => (
              <Button key={t} size="sm" variant={tier === t ? "default" : "outline"} className={`rounded-full ${tier === t ? "gradient-emerald text-white" : ""}`} onClick={() => setTier(t)}>{t}</Button>
            ))}
            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="rounded-full gradient-emerald text-white"><Plus className="mr-1.5 h-3.5 w-3.5" />Invite recruiter</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Invite a new recruiter</DialogTitle></DialogHeader>
                <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setInviteOpen(false); }}>
                  <div className="space-y-1.5"><Label>Company name</Label><Input placeholder="Acme Inc" required /></div>
                  <div className="space-y-1.5"><Label>Recruiter email</Label><Input type="email" placeholder="talent@acme.com" required /></div>
                  <div className="space-y-1.5"><Label>Domain</Label><Input placeholder="acme.com" required /></div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
                    <Button type="submit" className="gradient-emerald text-white">Send invite</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* Grid */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => (
          <Card key={r.id} className="p-5 transition hover:border-primary/40 hover:shadow-elegant">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <SafeImage src={clearbitLogo(r.domain)} alt={r.name} className="h-12 w-12 rounded-xl border border-border bg-white object-contain p-1.5" onError={(e) => { const el = e.currentTarget as HTMLImageElement; el.style.display = "none"; el.nextElementSibling?.classList.remove("hidden"); }} />
                <div className="hidden grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary"><Building2 className="h-5 w-5" /></div>
                <div>
                  <p className="font-display font-semibold">{r.name}</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <Badge className={`${tierBadge(r.tier)} text-[10px]`}>{r.tier}</Badge>
                    <Badge className={r.status === "Active" ? "bg-success/15 text-success hover:bg-success/15 text-[10px]" : "bg-warning/15 text-warning text-[10px]"}>{r.status}</Badge>
                  </div>
                </div>
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-muted/50 p-2.5"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Roles</p><p className="font-display text-xl font-bold">{r.roles}</p></div>
              <div className="rounded-lg bg-muted/50 p-2.5"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Hires</p><p className="font-display text-xl font-bold text-primary">{r.hires}</p></div>
              <div className="rounded-lg bg-muted/50 p-2.5"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg CTC</p><p className="font-display text-sm font-bold text-gold">{r.avgCtc}</p></div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Contact: {r.contact}</span>
              <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Since {r.joined}</span>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card className="col-span-full p-10 text-center text-sm text-muted-foreground">No recruiters match your filters.</Card>
        )}
      </div>
    </DashboardLayout>
  );
}
