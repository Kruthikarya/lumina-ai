import { createFileRoute } from "@tanstack/react-router";
import { Microscope, GraduationCap } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { research, scholarships } from "@/lib/mock-data";

export const Route = createFileRoute("/student/research")({
  head: () => ({ meta: [{ title: "Research & Scholarships · LUMINA AI" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <DashboardLayout title="Research & Scholarships" subtitle="Open positions in top labs and funding opportunities.">
      <h3 className="font-display text-lg font-semibold">Research Positions</h3>
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {research.map((r) => (
          <Card key={r.lab} className="p-5">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary"><Microscope className="h-5 w-5" /></div>
              <div className="flex-1">
                <p className="font-display font-semibold">{r.topic}</p>
                <p className="text-sm text-muted-foreground">{r.lab} · {r.advisor}</p>
                <div className="mt-3 flex gap-2">
                  <Badge variant="secondary" className="text-[10px]">Funded</Badge>
                  <Badge variant="secondary" className="text-[10px]">Remote OK</Badge>
                </div>
              </div>
              <Button size="sm" className="rounded-full">Apply</Button>
            </div>
          </Card>
        ))}
      </div>

      <h3 className="mt-10 font-display text-lg font-semibold">Scholarships</h3>
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {scholarships.map((s) => (
          <Card key={s.name} className="p-5">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gold/15 text-gold"><GraduationCap className="h-5 w-5" /></div>
              <div className="flex-1">
                <p className="font-display font-semibold">{s.name}</p>
                <p className="text-sm text-muted-foreground">Deadline {s.deadline}</p>
              </div>
              <Badge className="bg-gold/15 text-gold hover:bg-gold/15">{s.amount}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
