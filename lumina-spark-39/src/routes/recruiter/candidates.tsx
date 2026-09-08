import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, Star, GraduationCap, MapPin, Briefcase, Github, ChevronDown } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { richCandidates, type RichCandidate } from "@/lib/recruiter-data";
import { clearbit } from "@/lib/real-data";

export const Route = createFileRoute("/recruiter/candidates")({
  head: () => ({ meta: [{ title: "Candidate Discovery · LUMINA AI" }] }),
  component: CandidatesPage,
});

const ROLES: RichCandidate["role"][] = ["Frontend", "Backend", "Full Stack", "ML", "Data", "Mobile", "DevOps", "Design"];
const MODES = ["Remote", "Hybrid", "Onsite"] as const;

type Sort = "match" | "cgpa" | "recent" | "stars";

function CandidatesPage() {
  const [q, setQ] = useState("");
  const [roles, setRoles] = useState<Set<string>>(new Set());
  const [modes, setModes] = useState<Set<string>>(new Set());
  const [minMatch, setMinMatch] = useState(0);
  const [sort, setSort] = useState<Sort>("match");
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set());

  const toggle = (set: Set<string>, val: string, setter: (s: Set<string>) => void) => {
    const n = new Set(set);
    if (n.has(val)) n.delete(val); else n.add(val);
    setter(n);
  };

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim();
    let list = richCandidates.filter((c) => {
      if (roles.size && !roles.has(c.role)) return false;
      if (modes.size && !modes.has(c.workMode)) return false;
      if (c.match < minMatch) return false;
      if (query) {
        const hay = `${c.name} ${c.headline} ${c.university} ${c.skills.join(" ")}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "cgpa") return b.cgpa - a.cgpa;
      if (sort === "stars") return b.githubStars - a.githubStars;
      if (sort === "recent") return a.lastActive.localeCompare(b.lastActive);
      return b.match - a.match;
    });
    return list;
  }, [q, roles, modes, minMatch, sort]);

  const toggleShortlist = (id: string) => {
    const n = new Set(shortlisted);
    if (n.has(id)) n.delete(id); else n.add(id);
    setShortlisted(n);
  };

  return (
    <DashboardLayout title="Candidate Discovery" subtitle="Smart-filter AI-ranked candidates with verified signals.">
      {/* Filter bar */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by skill, role, university…"
              className="h-11 rounded-full bg-muted pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full">
                  Role {roles.size > 0 && <Badge className="ml-1.5 bg-primary text-primary-foreground">{roles.size}</Badge>}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ROLES.map((r) => (
                  <DropdownMenuItem key={r} onSelect={(e) => { e.preventDefault(); toggle(roles, r, setRoles); }}>
                    <span className={`mr-2 h-3 w-3 rounded-sm border ${roles.has(r) ? "bg-primary border-primary" : "border-border"}`} />
                    {r}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full">
                  Work mode {modes.size > 0 && <Badge className="ml-1.5 bg-primary text-primary-foreground">{modes.size}</Badge>}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {MODES.map((m) => (
                  <DropdownMenuItem key={m} onSelect={(e) => { e.preventDefault(); toggle(modes, m, setModes); }}>
                    <span className={`mr-2 h-3 w-3 rounded-sm border ${modes.has(m) ? "bg-primary border-primary" : "border-border"}`} />
                    {m}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full">
                  Match ≥ {minMatch}% <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {[0, 70, 80, 85, 90].map((n) => (
                  <DropdownMenuItem key={n} onSelect={() => setMinMatch(n)}>{n === 0 ? "Any" : `${n}%+`}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full">
                  Sort: {sort} <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setSort("match")}>Best match</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSort("cgpa")}>Highest CGPA</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSort("stars")}>Most GitHub stars</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSort("recent")}>Recently active</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {(roles.size > 0 || modes.size > 0 || minMatch > 0 || q) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => { setRoles(new Set()); setModes(new Set()); setMinMatch(0); setQ(""); }}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{filtered.length} of {richCandidates.length} candidates</span>
          {shortlisted.size > 0 && (
            <Badge className="bg-gold/15 text-gold hover:bg-gold/15">
              <Star className="mr-1 h-3 w-3 fill-gold" />{shortlisted.size} shortlisted
            </Badge>
          )}
        </div>
      </Card>

      {/* Candidate grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((c, i) => {
          const isShort = shortlisted.has(c.id);
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
            >
              <Card className="group p-5 transition hover:border-primary/40 hover:shadow-elegant">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Avatar className="h-14 w-14 ring-2 ring-primary/10">
                      <AvatarImage src={clearbit(c.universityDomain)} alt="" />
                      <AvatarFallback className="bg-primary/15 text-primary text-lg">{c.initials}</AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ring-2 ring-card">
                      {c.match}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-display text-lg font-semibold flex items-center gap-1.5 truncate">
                          <Star className="h-3.5 w-3.5 shrink-0 fill-gold text-gold" />{c.name}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">{c.headline}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-[10px]">{c.availability}</Badge>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3" />{c.university}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.location} · {c.workMode}</span>
                      <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{c.experience}</span>
                      {c.githubStars > 0 && (
                        <span className="flex items-center gap-1"><Github className="h-3 w-3" />{c.githubStars.toLocaleString()} ★</span>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {c.skills.map((s) => (
                        <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                      ))}
                    </div>

                    <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-2.5">
                      <p className="text-xs text-foreground/80">
                        <Sparkles className="mr-1 inline h-3 w-3 text-primary" />
                        <span className="font-medium">AI:</span> {c.aiSummary}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-3 text-xs">
                      <span className="text-muted-foreground">CGPA {c.cgpa}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">{c.expectedCtc}</span>
                    </div>

                    <Progress value={c.match} className="mt-2 h-1.5" />

                    <div className="mt-3 flex gap-2">
                      <Link to="/recruiter/candidate" className="flex-1">
                        <Button size="sm" variant="outline" className="w-full rounded-full">View profile</Button>
                      </Link>
                      <Button
                        size="sm"
                        onClick={() => toggleShortlist(c.id)}
                        className={`flex-1 rounded-full ${isShort ? "bg-gold text-gold-foreground hover:bg-gold/90" : "gradient-emerald text-white"}`}
                      >
                        <Star className={`mr-1 h-3 w-3 ${isShort ? "fill-current" : ""}`} />
                        {isShort ? "Shortlisted" : "Shortlist"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card className="p-12 text-center">
          <Search className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-semibold">No candidates match your filters</p>
          <p className="text-sm text-muted-foreground">Try widening your criteria.</p>
        </Card>
      )}
    </DashboardLayout>
  );
}
