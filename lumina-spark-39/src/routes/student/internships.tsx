import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, MapPin, Clock, Sparkles, Bookmark, ArrowUpRight, Briefcase, Wallet,
  GraduationCap, CalendarClock,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { richInternships, clearbit, type RichInternship } from "@/lib/real-data";
import { SafeImage } from "@/components/safe-image";
import { Stagger, StaggerItem } from "@/components/motion";

export const Route = createFileRoute("/student/internships")({
  head: () => ({ meta: [{ title: "Internships · LUMINA AI" }] }),
  component: InternshipsPage,
});

const typeFilters = ["All", "Remote", "Hybrid", "On-site"] as const;

function InternshipCard({ i }: { i: RichInternship }) {
  const [saved, setSaved] = useState(false);
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group h-full overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:border-primary/40 hover:shadow-elegant"
    >
      <div className="img-zoom relative h-28">
        <SafeImage src={i.banner} alt="" seed={i.company} label={i.company} className="h-full w-full object-cover transition group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-black/30 to-black/60" />
        <button
          onClick={() => setSaved((v) => !v)}
          aria-label="Bookmark internship"
          className={`absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/80 backdrop-blur transition hover:text-primary ${saved ? "pop-once text-primary" : "text-muted-foreground"}`}
        >
          <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
        </button>
        <Badge className="pulse-ring absolute left-3 top-3 bg-background/90 text-foreground backdrop-blur hover:bg-background/90">
          <Sparkles className="mr-1 h-3 w-3 text-primary" /> {i.match}% match
        </Badge>
      </div>
      <div className="relative p-5">
        <SafeImage
          src={clearbit(i.companyDomain)}
          alt={i.company}
          seed={i.companyDomain}
          label={i.company}
          className="absolute -top-7 left-5 h-14 w-14 rounded-2xl border border-border bg-white object-contain p-2 shadow-elegant"
        />
        <div className="ml-16">
          <p className="font-display text-base font-semibold leading-snug">{i.role}</p>
          <p className="text-sm text-muted-foreground">{i.company}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {i.location}</span>
          <span className="inline-flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> {i.type}</span>
          <span className="inline-flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5" /> {i.stipend}</span>
          <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {i.duration}</span>
          <span className="col-span-2 inline-flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5" /> {i.eligibility}</span>
          <span className="col-span-2 inline-flex items-center gap-1.5 text-gold"><CalendarClock className="h-3.5 w-3.5" /> Apply by {i.deadline}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {i.skills.map((s) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Posted {i.posted}</span>
          <Button size="sm" className="rounded-full gradient-emerald text-white transition hover:shadow-glow" asChild>
            <a href={i.url} target="_blank" rel="noreferrer noopener">
              Apply <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </a>
          </Button>
        </div>

      </div>
    </motion.div>
  );
}

function InternshipsPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<(typeof typeFilters)[number]>("All");

  const filtered = richInternships.filter((i) => {
    if (type !== "All" && i.type !== type) return false;
    if (q && !(`${i.role} ${i.company} ${i.skills.join(" ")}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  return (
    <DashboardLayout
      title="Internships"
      subtitle="AI-matched roles at top companies — banners, stipends, and apply-ready in one click."
    >
      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search role, company or skill…"
              className="h-11 rounded-full bg-muted pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {typeFilters.map((t) => (
              <Button
                key={t}
                size="sm"
                variant={type === t ? "default" : "outline"}
                onClick={() => setType(t)}
                className={"rounded-full " + (type === t ? "gradient-emerald text-white" : "")}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <Stagger className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((i) => (
          <StaggerItem key={`${i.company}-${i.role}`} className="h-full">
            <InternshipCard i={i} />
          </StaggerItem>
        ))}
      </Stagger>
    </DashboardLayout>
  );
}
