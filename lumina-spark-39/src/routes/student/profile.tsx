import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  MapPin, Mail, Phone, Github, Linkedin, Globe, Award, GraduationCap,
  Briefcase, Sparkles, Trophy, BookOpen, Pencil,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SafeImage } from "@/components/safe-image";
import { clearbit } from "@/lib/real-data";
import { EditProfileDialog, ProfileCompletion, type ProfileData } from "@/components/edit-profile-dialog";
import { FeaturedProjectsShowcase } from "@/components/featured-projects-showcase";
import { useMockData, MOCK_KEYS } from "@/lib/mock-api";

export const Route = createFileRoute("/student/profile")({
  head: () => ({ meta: [{ title: "My Profile · LUMINA AI" }] }),
  component: Profile,
});

// Rough proficiency mapping — every chip counts equally within its group.
const SKILL_GROUPS: { key: keyof ProfileData; label: string; base: number }[] = [
  { key: "langs", label: "Programming Languages", base: 85 },
  { key: "frameworks", label: "Frameworks", base: 82 },
  { key: "databases", label: "Databases", base: 78 },
  { key: "cloud", label: "Cloud", base: 74 },
  { key: "aiSkills", label: "AI / ML", base: 76 },
];

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((n) => n[0]?.toUpperCase() ?? "").join("") || "AS";
}

function Profile() {
  const [p] = useMockData<ProfileData | null>(MOCK_KEYS.profile, null);
  // Fallback null-guard: dialog seeds this on first save; before then, show sensible placeholders.
  const d = p ?? ({
    avatar: "https://i.pravatar.cc/200?img=15",
    fullName: "Aarav Sharma",
    email: "aarav@lumina.ai",
    phone: "+91 98••• ••421",
    city: "Bengaluru", stateName: "Karnataka",
    about: "Full-stack engineer with a soft spot for product polish.",
    github: "#", linkedin: "#", portfolio: "#",
    college: "SJC Institute of Technology", university: "VTU",
    gradYear: "2026", cgpa: "9.1",
    langs: [], frameworks: [], databases: [], cloud: [], aiSkills: [], soft: [],
    experience: [], education: [], certs: [], achievements: [],
  } as unknown as ProfileData);

  const skills = SKILL_GROUPS
    .map((g) => {
      const chips = (d[g.key] as { label: string }[] | undefined) ?? [];
      const bonus = Math.min(chips.length, 6) * 2;
      const level = chips.length ? Math.min(96, g.base + bonus) : 0;
      return { name: g.label, level, count: chips.length };
    })
    .filter((s) => s.count > 0)
    .slice(0, 5);

  const missing: string[] = [];
  if (!d.avatar || d.avatar.includes("pravatar")) missing.push("Upload a real profile photo");
  if (!d.portfolio) missing.push("Add your portfolio URL");
  if (!(d.certs?.length)) missing.push("Add at least one certification");
  if (!(d.experience?.length)) missing.push("Add work experience");
  const filled = [d.fullName, d.email, d.phone, d.about, d.github, d.linkedin, d.portfolio, d.cgpa]
    .filter(Boolean).length;
  const percent = Math.min(100, Math.round((filled / 8) * 60 + (skills.length / 5) * 25 + ((d.certs?.length ? 1 : 0) + (d.experience?.length ? 1 : 0)) * 7.5));

  return (
    <DashboardLayout title="My Profile" subtitle="Your living portfolio — synced with resume, roadmap & GitHub.">
      {/* Header / Cover */}
      <Card className="overflow-hidden p-0">
        <div className="relative h-44 sm:h-56">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,oklch(0.55_0.15_165/0.55),transparent_55%),radial-gradient(circle_at_80%_70%,oklch(0.75_0.15_85/0.45),transparent_50%)]" />
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold backdrop-blur"
          >
            <Sparkles className="h-3 w-3 text-primary" /> Profile Strength · {percent}%
          </motion.div>
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-14 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <Avatar className="h-28 w-28 ring-4 ring-card">
                <AvatarImage src={d.avatar} />
                <AvatarFallback className="bg-primary/15 text-2xl text-primary">{initials(d.fullName)}</AvatarFallback>
              </Avatar>
              <div className="pb-1">
                <h2 className="font-display text-2xl font-bold">{d.fullName}</h2>
                <p className="text-sm text-muted-foreground">{d.college} · Class of {d.gradYear} · CGPA {d.cgpa}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {(d.city || d.stateName) && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {[d.city, d.stateName].filter(Boolean).join(", ")}</span>}
                  {d.email && <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {d.email}</span>}
                  {d.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {d.phone}</span>}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {d.github && <Button asChild variant="outline" size="sm" className="rounded-full"><a href={d.github} target="_blank" rel="noreferrer"><Github className="mr-1.5 h-3.5 w-3.5" />GitHub</a></Button>}
              {d.linkedin && <Button asChild variant="outline" size="sm" className="rounded-full"><a href={d.linkedin} target="_blank" rel="noreferrer"><Linkedin className="mr-1.5 h-3.5 w-3.5" />LinkedIn</a></Button>}
              {d.portfolio && <Button asChild variant="outline" size="sm" className="rounded-full"><a href={d.portfolio} target="_blank" rel="noreferrer"><Globe className="mr-1.5 h-3.5 w-3.5" />Portfolio</a></Button>}
              <EditProfileDialog
                trigger={
                  <Button size="sm" className="rounded-full gradient-emerald text-white shadow-elegant">
                    <Pencil className="mr-1.5 h-3.5 w-3.5" />Edit Profile
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <h3 className="font-display text-lg font-semibold">About</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
              {d.about || "Add a short bio from Edit Profile to introduce yourself to recruiters."}
            </p>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              <h3 className="font-display text-lg font-semibold">Experience</h3>
            </div>
            {d.experience?.length ? (
              <div className="space-y-5">
                {d.experience.map((e) => (
                  <div key={e.id} className="flex gap-4">
                    <SafeImage
                      src={clearbit(`${e.company.toLowerCase().replace(/\s+/g, "")}.com`)}
                      alt={e.company}
                      className="h-12 w-12 rounded-xl border border-border bg-white object-contain p-1.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <p className="font-semibold">{e.role || "Role"}</p>
                        <p className="text-xs text-muted-foreground">{e.duration}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{e.company}</p>
                      {e.description && <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No experience yet — add roles from Edit Profile.</p>
            )}
          </Card>

          <Card className="p-6">
            <FeaturedProjectsShowcase />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <ProfileCompletion percent={percent} missing={missing.length ? missing : ["Your profile is looking great!"]} />
          </Card>

          <Card className="p-6">
            <div className="mb-3 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              <h3 className="font-display text-lg font-semibold">Education</h3>
            </div>
            {d.education?.length ? (
              <div className="space-y-3">
                {d.education.map((ed) => (
                  <div key={ed.id} className="flex gap-3">
                    <SafeImage src={clearbit("sjbit.edu.in")} alt="" className="h-10 w-10 rounded-lg border border-border bg-white object-contain p-1" />
                    <div>
                      <p className="text-sm font-semibold">{ed.degree}</p>
                      <p className="text-xs text-muted-foreground">{ed.college} · {ed.year}</p>
                      <p className="mt-1 text-xs"><span className="font-semibold text-primary">{ed.score}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Add education from Edit Profile.</p>
            )}
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="font-display text-lg font-semibold">Top Skills</h3>
            </div>
            {skills.length ? (
              <div className="space-y-3">
                {skills.map((s) => (
                  <div key={s.name}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="font-medium">{s.name}</span>
                      <span className="text-muted-foreground">{s.level}%</span>
                    </div>
                    <Progress value={s.level} className="h-1.5" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Add skills in the Skills tab of Edit Profile.</p>
            )}
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <h3 className="font-display text-lg font-semibold">Certifications</h3>
            </div>
            {d.certs?.length ? (
              <div className="space-y-3">
                {d.certs.map((c) => (
                  <div key={c.id} className="flex items-center gap-3">
                    <SafeImage src={clearbit(`${c.org.toLowerCase().split(/\s+/)[0]}.com`)} alt="" className="h-8 w-8 rounded-md border border-border bg-white object-contain p-1" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.org} · {c.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No certifications yet.</p>
            )}
          </Card>

          <Card className="p-6">
            <div className="mb-3 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-gold" />
              <h3 className="font-display text-lg font-semibold">Achievements</h3>
            </div>
            {d.achievements?.length ? (
              <ul className="space-y-2 text-sm">
                {d.achievements.map((a) => (
                  <li key={a.id} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{a.title}{a.type ? ` · ${a.type}` : ""}{a.year ? ` · ${a.year}` : ""}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Add awards & recognitions from Edit Profile.</p>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
