import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Filter, MapPin, Calendar, Trophy, GraduationCap, Microscope, Briefcase } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { internships, hackathons, competitions, scholarships, research } from "@/lib/mock-data";

export const Route = createFileRoute("/opportunities")({
  head: () => ({ meta: [{ title: "Opportunities · LUMINA AI" }] }),
  component: Opportunities,
});

function ListCard({ icon: Icon, title, sub, right, tags }: any) {
  return (
    <Card className="p-5 transition hover:border-primary/40 hover:shadow-elegant">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-display font-semibold">{title}</p>
              <p className="truncate text-sm text-muted-foreground">{sub}</p>
            </div>
            {right && <Badge className="bg-gold/15 text-gold hover:bg-gold/15">{right}</Badge>}
          </div>
          {tags && <div className="mt-3 flex flex-wrap gap-1.5">{tags.map((t: string) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}</div>}
        </div>
      </div>
    </Card>
  );
}

export function Opportunities() {
  const [q, setQ] = useState("");
  return (
    <DashboardLayout title="Opportunity Discovery" subtitle="Internships, hackathons, competitions, scholarships & research — all in one feed.">
      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search roles, companies, skills…" className="h-11 rounded-full bg-muted pl-10" />
          </div>
          <div className="flex flex-wrap gap-2">
            {["Remote", "Paid", "≤ 2 weeks", "Top-tier"].map((f) => (
              <Button key={f} variant="outline" size="sm" className="rounded-full">{f}</Button>
            ))}
            <Button size="sm" className="rounded-full gradient-emerald text-white"><Filter className="mr-1.5 h-3.5 w-3.5" />Filters</Button>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="internships">
        <TabsList className="flex w-full flex-wrap gap-1 rounded-full bg-muted p-1">
          {[
            ["internships", "Internships", internships.length],
            ["hackathons", "Hackathons", hackathons.length],
            ["competitions", "Competitions", competitions.length],
            ["scholarships", "Scholarships", scholarships.length],
            ["research", "Research", research.length],
          ].map(([v, l, c]) => (
            <TabsTrigger key={v as string} value={v as string} className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow">{l} <span className="ml-1.5 text-xs text-muted-foreground">{c}</span></TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="internships" className="mt-5 grid gap-3 lg:grid-cols-2">
          {internships.map((i) => (
            <ListCard key={i.title} icon={Briefcase} title={i.title} sub={`${i.company} · ${i.location}`} right={i.stipend} tags={i.tags} />
          ))}
        </TabsContent>
        <TabsContent value="hackathons" className="mt-5 grid gap-3 lg:grid-cols-2">
          {hackathons.map((h) => (
            <ListCard key={h.name} icon={Trophy} title={h.name} sub={`${h.date} · ${h.mode}`} right={h.prize} />
          ))}
        </TabsContent>
        <TabsContent value="competitions" className="mt-5 grid gap-3 lg:grid-cols-2">
          {competitions.map((c) => (
            <ListCard key={c.name} icon={Calendar} title={c.name} sub={`${c.category} · Deadline ${c.deadline}`} />
          ))}
        </TabsContent>
        <TabsContent value="scholarships" className="mt-5 grid gap-3 lg:grid-cols-2">
          {scholarships.map((s) => (
            <ListCard key={s.name} icon={GraduationCap} title={s.name} sub={`Deadline ${s.deadline}`} right={s.amount} />
          ))}
        </TabsContent>
        <TabsContent value="research" className="mt-5 grid gap-3 lg:grid-cols-2">
          {research.map((r) => (
            <ListCard key={r.lab} icon={Microscope} title={r.topic} sub={`${r.lab} · ${r.advisor}`} />
          ))}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
