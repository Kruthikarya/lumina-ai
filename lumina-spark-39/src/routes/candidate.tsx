import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Mail, Phone, GraduationCap, Award, FileText, Briefcase, Star } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { skills } from "@/lib/mock-data";

export const Route = createFileRoute("/candidate")({
  head: () => ({ meta: [{ title: "Candidate Profile · LUMINA AI" }] }),
  component: Candidate,
});

export function Candidate() {
  return (
    <DashboardLayout title="Candidate Profile" subtitle="A 360° view of this student.">
      <Card className="overflow-hidden">
        <div className="h-32 gradient-emerald" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <Avatar className="h-24 w-24 ring-4 ring-card"><AvatarFallback className="bg-primary/15 text-primary text-2xl font-bold">PV</AvatarFallback></Avatar>
              <div>
                <h2 className="font-display text-2xl font-bold">Priya Verma</h2>
                <p className="text-sm text-muted-foreground">Frontend Engineer · Final Year, IIT Bombay</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />Bangalore</span>
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" />priya@iitb.ac.in</span>
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" />+91 98765 43210</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-full"><FileText className="mr-1.5 h-4 w-4" />Download Resume</Button>
              <Button className="rounded-full gradient-emerald text-white"><Star className="mr-1.5 h-4 w-4" />Shortlist</Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-display text-lg font-semibold">Skills</h3>
          <div className="mt-3 flex flex-wrap gap-2">{["React", "TypeScript", "Next.js", "GraphQL", "Tailwind", "Node.js", "Postgres", "AWS"].map((s) => (
            <Badge key={s} className="rounded-full bg-primary/10 text-primary hover:bg-primary/15 px-3 py-1">{s}</Badge>
          ))}</div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skills}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="name" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                <PolarRadiusAxis stroke="var(--color-border)" tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} />
                <Radar dataKey="level" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold">Performance Metrics</h3>
          <div className="mt-5 space-y-4">
            {[["Resume score", 94], ["Placement readiness", 91], ["Mock interview avg", 86], ["Assignment avg", 88]].map(([k, v]) => (
              <div key={k as string}>
                <div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">{k}</span><span className="font-semibold">{v}</span></div>
                <Progress value={v as number} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" />Projects</h3>
          <div className="mt-4 space-y-3">
            {[
              { t: "Realtime Whiteboard SaaS", d: "10K+ MAU · Built with Next.js + Yjs + Postgres" },
              { t: "AI Recipe Generator", d: "Open-source · 2.4K GitHub stars" },
              { t: "Campus Marketplace", d: "Served 5 colleges · React Native + Firebase" },
            ].map((p) => (
              <div key={p.t} className="rounded-xl border border-border p-3">
                <p className="font-semibold">{p.t}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.d}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold flex items-center gap-2"><Award className="h-4 w-4 text-gold" />Certifications</h3>
          <div className="mt-4 space-y-3">
            {[
              { t: "AWS Cloud Practitioner", i: "Amazon · 2026" },
              { t: "Google UX Design", i: "Coursera · 2025" },
              { t: "Meta Frontend Developer", i: "Meta · 2025" },
            ].map((c) => (
              <div key={c.t} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-gold/15 text-gold"><GraduationCap className="h-5 w-5" /></div>
                <div><p className="font-semibold">{c.t}</p><p className="text-xs text-muted-foreground">{c.i}</p></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h3 className="font-display text-lg font-semibold">Resume Insights</h3>
        <p className="text-sm text-muted-foreground">AI-generated highlights from this candidate's resume.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            { t: "Top strength", d: "Strong product-thinking with quantified impact across 4 projects." },
            { t: "Standout signal", d: "2.4K GitHub stars on an open-source AI project." },
            { t: "Recommended fit", d: "L3/L4 Frontend or Full-stack — startup or growth-stage SaaS." },
          ].map((x) => (
            <div key={x.t} className="rounded-xl border border-border p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{x.t}</p>
              <p className="mt-2 text-sm">{x.d}</p>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
}
