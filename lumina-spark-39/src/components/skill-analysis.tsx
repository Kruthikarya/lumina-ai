import { useMemo, useState } from "react";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, LineChart, Line, CartesianGrid, Cell,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, TrendingUp, TrendingDown, Target, Award, AlertTriangle,
  BookOpen, Radar as RadarIcon, BarChart3, LineChart as LineIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Skill = {
  name: string;
  current: number;
  previous: number;
  recommendation: string;
};

const skillData: Skill[] = [
  { name: "Technical",       current: 88, previous: 74, recommendation: "Deepen system design with 2 case studies/week." },
  { name: "Communication",   current: 72, previous: 65, recommendation: "Practice STAR answers in mock interviews." },
  { name: "Problem Solving", current: 84, previous: 71, recommendation: "Solve 3 graph problems weekly on LeetCode." },
  { name: "Aptitude",        current: 79, previous: 68, recommendation: "Timed IndiaBix quant sets — 30 min/day." },
  { name: "Leadership",      current: 58, previous: 52, recommendation: "Lead one open-source PR review this month." },
  { name: "Teamwork",        current: 82, previous: 78, recommendation: "Contribute to a group hackathon build." },
  { name: "Creativity",      current: 68, previous: 60, recommendation: "Ship a weekend side-project prototype." },
  { name: "Industry Ready",  current: 76, previous: 61, recommendation: "Complete 2 recruiter mock interviews." },
];

const trendData = [
  { m: "Jan", technical: 62, communication: 55, problem: 60, industry: 51 },
  { m: "Feb", technical: 68, communication: 58, problem: 65, industry: 57 },
  { m: "Mar", technical: 71, communication: 62, problem: 70, industry: 62 },
  { m: "Apr", technical: 76, communication: 66, problem: 74, industry: 66 },
  { m: "May", technical: 82, communication: 69, problem: 78, industry: 70 },
  { m: "Jun", technical: 88, communication: 72, problem: 84, industry: 76 },
];

function scoreBand(v: number) {
  if (v >= 85) return { label: "Excellent", color: "oklch(0.7 0.16 155)", chip: "bg-emerald-500/15 text-emerald-500" };
  if (v >= 70) return { label: "Good",      color: "oklch(0.65 0.14 235)", chip: "bg-blue-500/15 text-blue-500" };
  if (v >= 55) return { label: "Improve",   color: "oklch(0.75 0.16 65)",  chip: "bg-orange-500/15 text-orange-500" };
  return       { label: "Critical",  color: "oklch(0.6 0.22 25)",   chip: "bg-red-500/15 text-red-500" };
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d: Skill = payload[0].payload;
  const delta = d.current - d.previous;
  const pct = ((delta / d.previous) * 100).toFixed(1);
  const band = scoreBand(d.current);
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-w-[220px] rounded-xl border border-border/60 bg-card/95 p-3 shadow-elegant backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-semibold">{d.name}</p>
        <Badge className={`${band.chip} border-0 text-[10px]`}>{band.label}</Badge>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        <div><p className="text-muted-foreground">Current</p><p className="font-bold text-base" style={{ color: band.color }}>{d.current}</p></div>
        <div><p className="text-muted-foreground">Previous</p><p className="font-bold text-base">{d.previous}</p></div>
      </div>
      <div className="mt-2 flex items-center gap-1 text-xs">
        {delta >= 0 ? <TrendingUp className="h-3 w-3 text-emerald-500" /> : <TrendingDown className="h-3 w-3 text-red-500" />}
        <span className={delta >= 0 ? "text-emerald-500" : "text-red-500"}>{delta >= 0 ? "+" : ""}{pct}%</span>
        <span className="text-muted-foreground">vs. last period</span>
      </div>
      <p className="mt-2 border-t border-border/50 pt-2 text-[11px] leading-relaxed text-muted-foreground">
        <Sparkles className="mr-1 inline h-3 w-3 text-primary" />{d.recommendation}
      </p>
    </motion.div>
  );
}

export function SkillAnalysis() {
  const [view, setView] = useState<"radar" | "bar" | "line">("radar");
  const [range, setRange] = useState("90");

  const strongest = useMemo(() => [...skillData].sort((a, b) => b.current - a.current)[0], []);
  const weakest   = useMemo(() => [...skillData].sort((a, b) => a.current - b.current)[0], []);
  const avg = Math.round(skillData.reduce((s, x) => s + x.current, 0) / skillData.length);
  const readiness = Math.min(100, avg + 4);

  return (
    <Card className="overflow-hidden p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-emerald text-white shadow-elegant">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">Skill Analysis</h3>
              <p className="text-xs text-muted-foreground">Multi-dimensional readiness — updated 2h ago</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="h-8 w-[150px] rounded-full text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 3 Months</SelectItem>
              <SelectItem value="180">Last 6 Months</SelectItem>
              <SelectItem value="all">Overall</SelectItem>
            </SelectContent>
          </Select>
          <Tabs value={view} onValueChange={(v) => setView(v as any)}>
            <TabsList className="h-8 rounded-full">
              <TabsTrigger value="radar" className="h-7 rounded-full px-3 text-xs"><RadarIcon className="mr-1 h-3 w-3" />Radar</TabsTrigger>
              <TabsTrigger value="bar" className="h-7 rounded-full px-3 text-xs"><BarChart3 className="mr-1 h-3 w-3" />Bar</TabsTrigger>
              <TabsTrigger value="line" className="h-7 rounded-full px-3 text-xs"><LineIcon className="mr-1 h-3 w-3" />Trend</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Chart */}
      <div className="relative mt-6 h-[340px]">
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_50%,oklch(0.72_0.14_160/0.08),transparent_65%)]" />
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35 }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              {view === "radar" ? (
                <RadarChart data={skillData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                  <defs>
                    <radialGradient id="radarFill">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-gold)" stopOpacity={0.2} />
                    </radialGradient>
                  </defs>
                  <PolarGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: "var(--color-foreground)", fontSize: 11, fontWeight: 500 }} />
                  <PolarRadiusAxis stroke="var(--color-border)" tick={{ fill: "var(--color-muted-foreground)", fontSize: 9 }} angle={90} domain={[0, 100]} />
                  <RTooltip content={<CustomTooltip />} />
                  <Radar
                    dataKey="current"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    fill="url(#radarFill)"
                    fillOpacity={0.7}
                    isAnimationActive
                    animationDuration={1200}
                  />
                  <Radar
                    dataKey="previous"
                    stroke="var(--color-gold)"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fill="var(--color-gold)"
                    fillOpacity={0.05}
                  />
                </RadarChart>
              ) : view === "bar" ? (
                <BarChart data={skillData} margin={{ top: 10, right: 20, bottom: 10, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} domain={[0, 100]} />
                  <RTooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-muted)", opacity: 0.3 }} />
                  <Bar dataKey="current" radius={[8, 8, 0, 0]} isAnimationActive animationDuration={1000}>
                    {skillData.map((s, i) => <Cell key={i} fill={scoreBand(s.current).color} />)}
                  </Bar>
                </BarChart>
              ) : (
                <LineChart data={trendData} margin={{ top: 10, right: 20, bottom: 10, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="m" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} domain={[40, 100]} />
                  <RTooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                  <Line type="monotone" dataKey="technical" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive animationDuration={1200} />
                  <Line type="monotone" dataKey="problem" stroke="var(--color-gold)" strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive animationDuration={1400} />
                  <Line type="monotone" dataKey="communication" stroke="oklch(0.65 0.14 235)" strokeWidth={2} dot={{ r: 3 }} isAnimationActive animationDuration={1600} />
                  <Line type="monotone" dataKey="industry" stroke="oklch(0.75 0.16 65)" strokeWidth={2} dot={{ r: 3 }} isAnimationActive animationDuration={1800} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* AI insights */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <InsightCard
          icon={Award} tone="emerald"
          label="Strongest Skill"
          value={strongest.name}
          hint={`${strongest.current}/100 · Top decile`}
        />
        <InsightCard
          icon={AlertTriangle} tone="orange"
          label="Focus Area"
          value={weakest.name}
          hint={weakest.recommendation}
        />
        <InsightCard
          icon={Target} tone="blue"
          label="Placement Readiness"
          value={`${readiness}%`}
          hint="Est. offer probability at Tier-1 recruiter"
        />
        <InsightCard
          icon={BookOpen} tone="gold"
          label="Recommended Next"
          value="System Design Primer"
          hint="4 hr · Gaurav Sen · YouTube"
        />
      </div>

      {/* Weekly nudge */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-4 flex items-start gap-3 rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/10 via-primary/5 to-gold/10 p-4"
      >
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div className="text-sm">
          <span className="font-semibold">This week: </span>
          <span className="text-muted-foreground">Ship 1 open-source PR + solve 5 medium DSA problems to push Leadership past 65 and unlock 2 new eligible companies.</span>
        </div>
        <Button size="sm" variant="outline" className="ml-auto shrink-0 rounded-full">Plan week</Button>
      </motion.div>
    </Card>
  );
}

function InsightCard({ icon: Icon, tone, label, value, hint }: any) {
  const toneMap: Record<string, string> = {
    emerald: "from-emerald-500/15 to-emerald-500/0 text-emerald-500",
    orange:  "from-orange-500/15 to-orange-500/0 text-orange-500",
    blue:    "from-blue-500/15 to-blue-500/0 text-blue-500",
    gold:    "from-gold/20 to-gold/0 text-gold",
  };
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br ${toneMap[tone]} p-4 transition hover:border-primary/30 hover:shadow-elegant`}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <p className="text-[10px] font-semibold uppercase tracking-wider">{label}</p>
      </div>
      <p className="mt-2 font-display text-lg font-bold leading-tight text-foreground">{value}</p>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{hint}</p>
    </motion.div>
  );
}
