import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calendar, Sparkles, Users, Trophy, ArrowUpRight, MapPin } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { richHackathons, clearbit, type RichHackathon } from "@/lib/real-data";
import { SafeImage } from "@/components/safe-image";
import { Stagger, StaggerItem, MotionCard } from "@/components/motion";
import { competitions } from "@/lib/mock-data";

export const Route = createFileRoute("/student/hackathons")({
  head: () => ({ meta: [{ title: "Hackathons & Competitions · LUMINA AI" }] }),
  component: HackathonsPage,
});

function HackathonCard({ h }: { h: RichHackathon }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group h-full overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:border-primary/40 hover:shadow-elegant"
    >
      <div className="img-zoom relative h-40">
        <SafeImage src={h.banner} alt="" seed={h.name} label={h.name} className="h-full w-full object-cover transition group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <Badge className="absolute left-3 top-3 bg-gold text-gold-foreground hover:bg-gold">
          <Trophy className="mr-1 h-3 w-3" /> {h.prize}
        </Badge>
        <Badge className="pulse-ring absolute right-3 top-3 bg-background/90 text-foreground backdrop-blur hover:bg-background/90">
          <Sparkles className="mr-1 h-3 w-3 text-primary" /> {h.match}% match
        </Badge>
        <div className="absolute bottom-0 left-0 right-0 flex items-end gap-3 p-4">
          <SafeImage
            src={clearbit(h.organizerDomain)}
            alt={h.organizer}
            seed={h.organizerDomain}
            label={h.organizer}
            className="h-12 w-12 shrink-0 rounded-xl border border-white/20 bg-white object-contain p-1.5"
          />
          <div className="min-w-0 flex-1 text-white">
            <p className="font-display text-lg font-bold leading-tight">{h.name}</p>
            <p className="truncate text-xs text-white/80">{h.organizer}</p>
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {h.date.split(",")[0]}</span>
          <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {h.mode}</span>
          <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {(h.registered/1000).toFixed(1)}k</span>
        </div>
        <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {h.location}</span>
          <span className="inline-flex items-center gap-1.5 text-gold"><Calendar className="h-3.5 w-3.5" /> Register by {h.deadline}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge
            variant="secondary"
            className={`text-[10px] ${h.difficulty === "Advanced" ? "bg-red-500/15 text-red-500" : h.difficulty === "Intermediate" ? "bg-gold/15 text-gold" : "bg-success/15 text-success"}`}
          >{h.difficulty}</Badge>
          {h.themes.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">{h.date}</span>
          <Button size="sm" className="rounded-full gradient-emerald text-white transition hover:shadow-glow" asChild>
            <a href={h.url} target="_blank" rel="noreferrer noopener">
              Register <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>

    </motion.div>
  );
}

function HackathonsPage() {
  return (
    <DashboardLayout title="Hackathons & Competitions" subtitle="Compete, prototype and win — with AI-matched events worldwide.">
      <Stagger className="grid gap-6 lg:grid-cols-2">
        {richHackathons.map((h) => (
          <StaggerItem key={h.name} className="h-full">
            <HackathonCard h={h} />
          </StaggerItem>
        ))}
      </Stagger>

      <h3 className="mt-12 font-display text-lg font-semibold">Open Competitions</h3>
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {competitions.map((c, idx) => (
          <MotionCard key={c.name} index={idx}>
          <Card className="p-5">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-display font-semibold">{c.name}</p>
                <p className="text-sm text-muted-foreground">{c.category} · Deadline {c.deadline}</p>
              </div>
              <Button size="sm" variant="outline" className="rounded-full">View</Button>
            </div>
          </Card>
          </MotionCard>
        ))}
      </div>
    </DashboardLayout>
  );
}
