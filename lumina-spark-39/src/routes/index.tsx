import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Sparkles, Brain, Target, Briefcase, GraduationCap,
  ArrowRight, CheckCircle2, Zap, Users, ShieldCheck, Star, Bot, FileText, Map, Trophy, Rocket,
} from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { CollegeMarquee } from "@/components/college-marquee";
import { RecruiterGrid } from "@/components/recruiter-marquee";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LUMINA AI — Student growth, opportunity & placement intelligence" },
      { name: "description", content: "An AI ecosystem that scores resumes, surfaces opportunities, runs mock interviews, and matches students with recruiters." },
      { property: "og:title", content: "LUMINA AI" },
      { property: "og:description", content: "AI-powered student growth & placement readiness platform." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Brain, title: "AI Resume Intelligence", desc: "Instant scoring, skill extraction and ATS-friendly rewrites tailored per role." },
  { icon: Target, title: "Placement Readiness", desc: "A live readiness score combining projects, mocks and skill depth." },
  { icon: Briefcase, title: "Opportunity Engine", desc: "Internships, hackathons, scholarships & research surfaced with match scores." },
  { icon: Zap, title: "AI Mock Interviews", desc: "Behavioral, DSA and system design rounds with structured feedback in seconds." },
  { icon: Map, title: "Career Roadmaps", desc: "Personalized quarter-by-quarter milestones so every student knows the next move." },
  { icon: Users, title: "Recruiter Match", desc: "Recruiters see ranked candidates with verified skill signals, not raw resumes." },
];

const aiCapabilities = [
  { icon: FileText, label: "Resume Parsing", color: "bg-primary/10 text-primary" },
  { icon: Target, label: "Skill Gap Analysis", color: "bg-gold/15 text-gold" },
  { icon: Map, label: "Roadmap Generation", color: "bg-primary/10 text-primary" },
  { icon: Briefcase, label: "Opportunity Matching", color: "bg-gold/15 text-gold" },
  { icon: Bot, label: "Career Chat Assistant", color: "bg-primary/10 text-primary" },
  { icon: ShieldCheck, label: "Eligibility Prediction", color: "bg-gold/15 text-gold" },
];

const journey = [
  { n: "01", icon: FileText, title: "Upload your resume", desc: "We extract skills, projects and intent in seconds." },
  { n: "02", icon: Target, title: "Get your scores", desc: "Resume score, placement readiness and skill gap map." },
  { n: "03", icon: Rocket, title: "Follow your roadmap", desc: "AI-curated learning, projects, mocks and applications." },
  { n: "04", icon: Trophy, title: "Land the offer", desc: "Recruiters discover you with verified, ranked signals." },
];


const testimonials = [
  { name: "Ananya M.", role: "SWE Intern @ Microsoft", quote: "LUMINA's readiness score told me exactly where I was weak. Two months later I converted my dream offer." },
  { name: "Vikram R.", role: "Placement Cell, IIT-X", quote: "We replaced four spreadsheets with one dashboard. Recruiter conversion is up 38% this season." },
  { name: "Sara K.", role: "Recruiter @ Stripe", quote: "Ranked candidates with verified signals saved us 12+ hours per role. The match accuracy is uncanny." },
];

function Counter({ to, suffix = "", duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, { duration, ease: "easeOut", onUpdate: (n) => setV(Math.round(n)) });
    return controls.stop;
  }, [inView, to, duration, mv]);
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>;
}

const animatedStats = [
  { v: 120000, suffix: "+", l: "Students Guided" },
  { v: 8400, suffix: "+", l: "Opportunities Listed" },
  { v: 45000, suffix: "+", l: "Mock Interviews Conducted" },
  { v: 312000, suffix: "+", l: "Skills Recommended" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-[300px] w-[500px] rounded-full bg-gold/15 blur-3xl" />
        </div>
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-primary hover:bg-primary/15">
              <Sparkles className="mr-1.5 h-3 w-3" /> AI-powered placement OS · v2
            </Badge>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Your path to a <span className="gradient-text">dream offer,</span> illuminated.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              LUMINA is the AI operating system for student growth — scoring resumes, surfacing opportunities,
              running interviews and matching you with recruiters who actually fit.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/student/register"><Button size="lg" className="rounded-full gradient-emerald text-white hover:opacity-90 shadow-elegant">Start as student <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
              <Link to="/recruiter/login"><Button size="lg" variant="outline" className="rounded-full">I'm a recruiter</Button></Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" />Free for students</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" />No credit card</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" />Connects with Gemini · OpenRouter · HF</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative">
            <Card className="glass shadow-elegant relative overflow-hidden p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Placement Readiness</p>
                  <p className="mt-1 font-display text-5xl font-bold gradient-text">87<span className="text-2xl text-muted-foreground">/100</span></p>
                </div>
                <div className="grid h-16 w-16 place-items-center rounded-full gradient-emerald">
                  <ShieldCheck className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {[["Resume score", 92], ["Mock interview avg", 84], ["Skill depth", 78], ["Project quality", 88]].map(([k, v]) => (
                  <div key={k as string}>
                    <div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">{k}</span><span className="font-semibold">{v}</span></div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 1.2, delay: 0.3 }} className="h-full gradient-emerald" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-card/60 p-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-gold/15 text-gold"><GraduationCap className="h-5 w-5" /></div>
                  <div>
                    <p className="text-sm font-semibold">Eligible for 14 companies</p>
                    <p className="text-xs text-muted-foreground">Google · Stripe · Figma · 11 more</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Card>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -right-6 -top-6 hidden rounded-2xl bg-gold p-4 shadow-elegant sm:block">
              <Sparkles className="h-5 w-5 text-gold-foreground" />
            </motion.div>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -bottom-4 -left-4 hidden rounded-xl bg-card p-3 shadow-elegant ring-1 ring-border sm:flex sm:items-center sm:gap-2">
              <Bot className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">AI ranking: top 6%</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* COLLEGE MARQUEE */}
      <section id="colleges" className="border-y border-border/60 bg-card/30 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Trusted by leading engineering institutions</p>
        </div>
        <div className="mt-6">
          <CollegeMarquee />
        </div>
      </section>

      {/* ANIMATED STATS */}
      <section className="border-b border-border/60 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {animatedStats.map((s, i) => (
            <motion.div key={s.l} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Card className="p-6 text-center">
                <p className="font-display text-4xl font-bold gradient-text"><Counter to={s.v} suffix={s.suffix} /></p>
                <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-b border-border/60 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="rounded-full">Features</Badge>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">Built for the next generation of <span className="gradient-text">talent</span></h2>
            <p className="mt-4 text-muted-foreground">Everything a student, a placement cell and a recruiter need — finally in one product.</p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
                <Card className="group h-full p-6 transition hover:shadow-elegant hover:border-primary/30">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition group-hover:gradient-emerald group-hover:text-white">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI CAPABILITIES SHOWCASE */}
      <section className="border-b border-border/60 bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="outline" className="rounded-full"><Sparkles className="mr-1 h-3 w-3 text-gold" />AI inside</Badge>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">Ten AI workflows, <span className="gradient-text">one platform</span></h2>
              <p className="mt-4 text-muted-foreground">
                Each module is built to plug into your favorite free AI provider — Google Gemini,
                OpenRouter or HuggingFace — so your stack stays open.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Gemini", "OpenRouter", "HuggingFace"].map((p) => (
                  <Badge key={p} className="bg-primary/10 text-primary hover:bg-primary/15">{p}</Badge>
                ))}
              </div>
              <Link to="/student/assistant" className="mt-6 inline-flex"><Button className="rounded-full gradient-emerald text-white">Try the AI assistant <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {aiCapabilities.map((c, i) => (
                <motion.div key={c.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                  <Card className="flex items-center gap-3 p-4">
                    <div className={`grid h-10 w-10 place-items-center rounded-xl ${c.color}`}><c.icon className="h-4 w-4" /></div>
                    <span className="text-sm font-semibold">{c.label}</span>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PLACEMENT JOURNEY */}
      <section className="border-b border-border/60 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="rounded-full">Placement Readiness Journey</Badge>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">From resume to <span className="gradient-text">offer letter</span></h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {journey.map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                <Card className="relative h-full overflow-hidden p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-5xl font-bold text-primary/15">{s.n}</span>
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><s.icon className="h-4 w-4" /></div>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RECRUITING COMPANIES */}
      <section className="border-b border-border/60 bg-card/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="rounded-full">Hiring partners</Badge>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">Recruiting on LUMINA</h2>
            <p className="mt-3 text-muted-foreground">From early-stage startups to Fortune 500s.</p>
          </div>
          <div className="mt-10">
            <RecruiterGrid />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-b border-border/60 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="rounded-full">Loved by students & teams</Badge>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">A platform people <span className="gradient-text">recommend</span></h2>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                <Card className="h-full p-6">
                  <div className="flex gap-0.5 text-gold">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}</div>
                  <p className="mt-4 text-sm leading-relaxed">"{t.quote}"</p>
                  <div className="mt-6 border-t border-border pt-4">
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { v: "98%", l: "Resume-score lift in 30 days" },
              { v: "+38%", l: "Recruiter conversion this season" },
              { v: "4.9/5", l: "Average student rating" },
            ].map((s) => (
              <Card key={s.l} className="p-6 text-center">
                <p className="font-display text-3xl font-bold gradient-text">{s.v}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.l}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <Card className="relative overflow-hidden p-10 sm:p-16">
            <div className="pointer-events-none absolute inset-0 gradient-emerald opacity-95" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="relative text-white">
              <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Ready to be discovered?</h2>
              <p className="mt-4 max-w-xl text-white/85">Join 120,000+ students turning potential into offers — and the recruiters discovering them.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/student/register"><Button size="lg" className="rounded-full bg-white text-primary hover:bg-white/90">Create student account</Button></Link>
                <Link to="/recruiter/login"><Button size="lg" variant="outline" className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10">Recruiter login</Button></Link>
                <Link to="/admin/login"><Button size="lg" variant="outline" className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10">Admin login</Button></Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
