import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mic, Sparkles, Play, Code2, Filter, Clock, ListChecks, Building2, User, UserRound } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SafeImage } from "@/components/safe-image";
import { interviewHistory } from "@/lib/mock-data";
import { VoiceInterviewDialog } from "@/components/voice-interview-dialog";
import { CodingInterviewDialog } from "@/components/coding-interview-dialog";
import { useMockData, MOCK_KEYS } from "@/lib/mock-api";
import type { ProfileData } from "@/components/edit-profile-dialog";
import {
  COMPANIES, ROLES, DIFFICULTIES, INTERVIEW_TYPES, RECOMMENDED,
  companyLogo, findCompany, codingFocus,
} from "@/lib/interview-data";
import type { Gender } from "@/components/interviewer-avatar";

export const Route = createFileRoute("/mock-interview")({
  head: () => ({
    meta: [
      { title: "AI Mock Interview Simulator · LUMINA AI" },
      { name: "description", content: "Practice company-specific mock interviews with an animated AI interviewer, voice rounds and live coding challenges." },
      { property: "og:title", content: "AI Mock Interview Simulator · LUMINA AI" },
      { property: "og:description", content: "Company-specific AI interviews with voice, avatar and live coding rounds." },
    ],
  }),
  component: MockInterview,
});

export function MockInterview() {
  const [profile] = useMockData<ProfileData | null>(MOCK_KEYS.profile, null);

  const [company, setCompany] = useState("Google");
  const [role, setRole] = useState<string>(ROLES[0]);
  const [difficulty, setDifficulty] = useState<string>("Intermediate");
  const [type, setType] = useState<string>("Technical");
  const [gender, setGender] = useState<Gender>("male");

  const [voiceOpen, setVoiceOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);

  const [fCompany, setFCompany] = useState("All");
  const [fRole, setFRole] = useState("All");
  const [fDiff, setFDiff] = useState("All");
  const [fType, setFType] = useState("All");

  const resume = profile ? {
    name: profile.fullName,
    role: profile.objective?.split(/[.·—-]/)[0]?.slice(0, 60),
    college: profile.college,
    company,
    skills: [
      ...(profile.langs || []),
      ...(profile.frameworks || []),
      ...(profile.aiSkills || []),
    ].map((c) => c.label),
  } : undefined;

  const config = { company, role, difficulty, type, gender };

  const filtered = useMemo(() => RECOMMENDED.filter((r) =>
    (fCompany === "All" || r.company === fCompany) &&
    (fRole === "All" || r.role === fRole) &&
    (fDiff === "All" || r.difficulty === fDiff) &&
    (fType === "All" || r.type === fType)
  ), [fCompany, fRole, fDiff, fType]);

  function startFrom(r: typeof RECOMMENDED[number]) {
    setCompany(r.company); setRole(r.role); setDifficulty(r.difficulty); setType(r.type);
    setVoiceOpen(true);
  }

  const focus = codingFocus(company, role);

  return (
    <DashboardLayout title="AI Mock Interview" subtitle="A realistic, company-specific interview simulator with a live AI interviewer.">
      {/* Customize */}
      <Card className="relative overflow-hidden p-6">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" />
            <h3 className="font-display text-lg font-semibold">Customize your interview</h3>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Company">
              <Select value={company} onValueChange={setCompany}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {COMPANIES.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Job role">
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Difficulty">
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Interview type">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INTERVIEW_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border/60 p-1">
              {([["male", User], ["female", UserRound]] as const).map(([g, Icon]) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${gender === g ? "gradient-emerald text-white shadow-elegant" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Icon className="h-3.5 w-3.5" />{g === "male" ? "Male AI interviewer" : "Female AI interviewer"}
                </button>
              ))}
            </div>

            <Button onClick={() => setVoiceOpen(true)} className="rounded-full gradient-emerald text-white shadow-elegant">
              <Mic className="mr-1.5 h-4 w-4" /> Start voice interview
            </Button>
            <Button onClick={() => setCodeOpen(true)} variant="outline" className="rounded-full">
              <Code2 className="mr-1.5 h-4 w-4" /> Start coding round
            </Button>

            <div className="ml-auto hidden flex-wrap gap-1.5 lg:flex">
              {focus.slice(0, 4).map((f) => <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>)}
            </div>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold"><Filter className="h-4 w-4 text-primary" />Recommended interviews</div>
        <div className="ml-auto flex flex-wrap gap-2">
          <FilterSelect value={fCompany} onChange={setFCompany} options={Array.from(new Set(RECOMMENDED.map((r) => r.company)))} label="Company" all="All companies" />
          <FilterSelect value={fRole} onChange={setFRole} options={Array.from(new Set(RECOMMENDED.map((r) => r.role)))} label="Role" all="All roles" />
          <FilterSelect value={fDiff} onChange={setFDiff} options={[...DIFFICULTIES]} label="Difficulty" all="All levels" />
          <FilterSelect value={fType} onChange={setFType} options={[...INTERVIEW_TYPES]} label="Type" all="All types" />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((r, i) => {
          const logo = companyLogo(findCompany(r.company)?.domain || "");
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.4) }}
              whileHover={{ y: -4 }}
            >
              <Card className="group h-full p-5 transition hover:border-primary/40 hover:shadow-elegant">
                <div className="flex items-center gap-3">
                  {logo
                    ? <SafeImage src={logo} alt={r.company} className="h-10 w-10 rounded-xl bg-white p-1.5" />
                    : <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Building2 className="h-4 w-4" /></div>}
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{r.company}</p>
                    <p className="truncate text-xs text-muted-foreground">{r.role}</p>
                  </div>
                  <Badge className="ml-auto bg-gold/15 text-gold hover:bg-gold/15">{r.match}% match</Badge>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-[10px]">{r.difficulty}</Badge>
                  <Badge variant="outline" className="text-[10px]">{r.type}</Badge>
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><ListChecks className="h-3 w-3" />{r.questions} questions</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{r.minutes} min</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {r.skills.slice(0, 4).map((s) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                </div>

                <Progress value={r.match} className="mt-4 h-1.5" />

                <div className="mt-4 flex gap-2">
                  <Button size="sm" onClick={() => startFrom(r)} className="flex-1 rounded-full gradient-emerald text-white">
                    <Play className="mr-1.5 h-3 w-3" />Start
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => {
                    setCompany(r.company); setRole(r.role); setDifficulty(r.difficulty); setCodeOpen(true);
                  }}>
                    <Code2 className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <Card className="p-8 text-center text-sm text-muted-foreground sm:col-span-2 xl:col-span-3">
            No interviews match those filters.
          </Card>
        )}
      </div>

      {/* History */}
      <Card className="mt-8 p-6">
        <h3 className="font-display text-lg font-semibold">Interview History</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border"><th className="py-3 text-left">Type</th><th className="text-left">Date</th><th className="text-left">Duration</th><th className="text-right">Score</th></tr>
            </thead>
            <tbody>
              {interviewHistory.map((h) => (
                <tr key={h.type + h.date} className="border-b border-border last:border-0">
                  <td className="py-3 font-medium">{h.type}</td>
                  <td className="text-muted-foreground">{h.date}</td>
                  <td className="text-muted-foreground">{h.duration}</td>
                  <td className="text-right"><Badge className={h.score >= 80 ? "bg-success/15 text-success hover:bg-success/15" : h.score >= 70 ? "bg-gold/15 text-gold hover:bg-gold/15" : "bg-warning/15 text-warning hover:bg-warning/15"}>{h.score}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <VoiceInterviewDialog open={voiceOpen} onOpenChange={setVoiceOpen} topic={type} resume={resume} config={config} />
      <CodingInterviewDialog open={codeOpen} onOpenChange={setCodeOpen} company={company} role={role} difficulty={difficulty} gender={gender} />
    </DashboardLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function FilterSelect({ value, onChange, options, label, all }: { value: string; onChange: (v: string) => void; options: string[]; label: string; all: string }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 w-[150px] rounded-full text-xs"><SelectValue placeholder={label} /></SelectTrigger>
      <SelectContent className="max-h-72">
        <SelectItem value="All">{all}</SelectItem>
        {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}
