import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Github, ExternalLink, FileText, Play, Download, Bookmark,
  Share2, Star, Eye, Heart, GitFork, MessageSquare, Users, Clock, Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { clearbit } from "@/lib/real-data";
import { SafeImage } from "@/components/safe-image";
import { mockGet, mockSet, mockPeek, MOCK_KEYS } from "@/lib/mock-api";

export type ShowcaseProject = {
  title: string;
  description: string;
  cover: string;
  logoDomain: string;
  stack: string[];
  category: "AI" | "Web" | "Mobile" | "Cloud" | "DevOps" | "Security" | "IoT" | "Data";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  status: "Completed" | "Ongoing";
  openSource: boolean;
  github: string;
  demo?: string;
  docs?: string;
  video?: string;
  likes: number;
  views: number;
  stars: number;
  forks: number;
  comments: number;
  completion: number;
  team: number;
  duration: string;
  updated: string;
  trending?: boolean;
};

import { unsplash } from "@/lib/real-data";
const cover = (id: string) => unsplash(id, 1000);


export const showcaseProjects: ShowcaseProject[] = [
  { title: "AI Resume Analyzer", description: "ATS-grade resume scoring with keyword gap analysis powered by Gemini.", cover: cover("1517048676732-d65bc937f952"), logoDomain: "google.com", stack: ["Next.js", "Gemini", "Tailwind"], category: "AI", difficulty: "Intermediate", status: "Completed", openSource: true, github: "#", demo: "#", docs: "#", video: "#", likes: 1240, views: 18400, stars: 1200, forks: 210, comments: 84, completion: 100, team: 3, duration: "6 weeks", updated: "2d", trending: true },
  { title: "Campus Placement Intelligence", description: "Predictive analytics platform for TPO cells with recruiter-fit scoring.", cover: cover("1551288049-bebda4e38f71"), logoDomain: "linkedin.com", stack: ["React", "FastAPI", "PostgreSQL", "scikit-learn"], category: "Data", difficulty: "Advanced", status: "Ongoing", openSource: true, github: "#", demo: "#", likes: 890, views: 12300, stars: 560, forks: 92, comments: 41, completion: 78, team: 5, duration: "4 months", updated: "5h", trending: true },
  { title: "Smart Attendance System", description: "Face-recognition attendance with GPS geofencing and Aadhaar OTP fallback.", cover: cover("1573164713988-8665fc963095"), logoDomain: "microsoft.com", stack: ["React Native", "OpenCV", "Firebase"], category: "Mobile", difficulty: "Intermediate", status: "Completed", openSource: false, github: "#", demo: "#", video: "#", likes: 720, views: 9800, stars: 420, forks: 68, comments: 30, completion: 100, team: 4, duration: "2 months", updated: "1w" },
  { title: "Interview Preparation AI", description: "Voice-first mock interviewer with real-time STAR-answer coaching.", cover: cover("1519389950473-47ba0277781c"), logoDomain: "openai.com", stack: ["Next.js", "OpenAI", "Whisper", "Vercel"], category: "AI", difficulty: "Advanced", status: "Ongoing", openSource: true, github: "#", demo: "#", likes: 1580, views: 22100, stars: 1400, forks: 240, comments: 112, completion: 65, team: 2, duration: "3 months", updated: "1d", trending: true },
  { title: "AI Mock Interview Assistant", description: "Adaptive DSA + behavioral rounds with instant rubric feedback.", cover: cover("1522071820081-009f0129c71c"), logoDomain: "anthropic.com", stack: ["Vue", "Claude API", "Supabase"], category: "AI", difficulty: "Advanced", status: "Completed", openSource: true, github: "#", demo: "#", likes: 640, views: 8900, stars: 380, forks: 55, comments: 27, completion: 100, team: 2, duration: "8 weeks", updated: "3d" },
  { title: "Career Roadmap Generator", description: "Personalized 12-month growth plans mapped to real recruiter demand.", cover: cover("1454165804606-c3d57bc86b40"), logoDomain: "coursera.org", stack: ["Remix", "OpenAI", "MongoDB"], category: "AI", difficulty: "Intermediate", status: "Completed", openSource: false, github: "#", demo: "#", likes: 512, views: 7300, stars: 310, forks: 42, comments: 22, completion: 100, team: 3, duration: "5 weeks", updated: "2w" },
  { title: "Job Recommendation Engine", description: "Vector-search matcher pairing profiles to 40k live openings.", cover: cover("1521737604893-d14cc237f11d"), logoDomain: "linkedin.com", stack: ["Python", "pgvector", "FastAPI"], category: "Data", difficulty: "Advanced", status: "Ongoing", openSource: true, github: "#", demo: "#", likes: 430, views: 6100, stars: 260, forks: 38, comments: 19, completion: 55, team: 4, duration: "3 months", updated: "6h" },
  { title: "AI Skill Gap Analyzer", description: "Benchmark your stack against 12 recruiter personas in seconds.", cover: cover("1552664730-d307ca884978"), logoDomain: "amazon.com", stack: ["Next.js", "Gemini", "Neon"], category: "AI", difficulty: "Intermediate", status: "Completed", openSource: true, github: "#", demo: "#", likes: 820, views: 11200, stars: 490, forks: 76, comments: 44, completion: 100, team: 2, duration: "6 weeks", updated: "4d" },
  { title: "Smart Library Management", description: "RFID-based issuance system with fine automation & digital catalog.", cover: cover("1481627834876-b7833e8f5570"), logoDomain: "figma.com", stack: ["React", "Node.js", "MySQL"], category: "Web", difficulty: "Beginner", status: "Completed", openSource: false, github: "#", demo: "#", likes: 210, views: 3400, stars: 140, forks: 22, comments: 11, completion: 100, team: 3, duration: "4 weeks", updated: "3w" },
  { title: "Expense Tracker", description: "Zero-config PWA with SMS-scraper for auto-categorised spends.", cover: cover("1554224155-6726b3ff858f"), logoDomain: "stripe.com", stack: ["Svelte", "Dexie", "Vercel"], category: "Web", difficulty: "Beginner", status: "Completed", openSource: true, github: "#", demo: "#", likes: 380, views: 5100, stars: 220, forks: 34, comments: 15, completion: 100, team: 1, duration: "3 weeks", updated: "1w" },
  { title: "Personal Finance Dashboard", description: "Plaid-powered net-worth cockpit with goal-based investing insights.", cover: cover("1579621970563-ebec7560ff3e"), logoDomain: "plaid.com", stack: ["Next.js", "Plaid", "Prisma"], category: "Web", difficulty: "Intermediate", status: "Ongoing", openSource: false, github: "#", demo: "#", likes: 610, views: 8200, stars: 360, forks: 51, comments: 26, completion: 82, team: 2, duration: "2 months", updated: "12h" },
  { title: "Hospital Management System", description: "OPD/IPD/pharmacy stack with WhatsApp alerts and ABHA integration.", cover: cover("1587351021759-3e566b6af7cc"), logoDomain: "cloudflare.com", stack: ["Angular", "Spring Boot", "Postgres"], category: "Web", difficulty: "Advanced", status: "Completed", openSource: false, github: "#", demo: "#", likes: 340, views: 4900, stars: 190, forks: 30, comments: 18, completion: 100, team: 6, duration: "5 months", updated: "2w" },
  { title: "E-Commerce Platform", description: "Headless commerce reference build with UPI, Shiprocket & OpenAI search.", cover: cover("1483985988355-763728e1935b"), logoDomain: "shopify.com", stack: ["Next.js", "Medusa", "Stripe"], category: "Web", difficulty: "Advanced", status: "Completed", openSource: true, github: "#", demo: "#", likes: 980, views: 14500, stars: 720, forks: 110, comments: 56, completion: 100, team: 4, duration: "4 months", updated: "1d", trending: true },
  { title: "Food Delivery App", description: "Rider-side offline-first Flutter app with dynamic ETA modelling.", cover: cover("1504674900247-0877df9cc836"), logoDomain: "zomato.com", stack: ["Flutter", "Firebase", "Mapbox"], category: "Mobile", difficulty: "Intermediate", status: "Completed", openSource: false, github: "#", demo: "#", likes: 460, views: 6700, stars: 280, forks: 40, comments: 21, completion: 100, team: 3, duration: "10 weeks", updated: "1w" },
  { title: "Ride Sharing Platform", description: "Uber-style dispatcher with surge pricing simulator for research.", cover: cover("1449965408869-eaa3f722e40d"), logoDomain: "uber.com", stack: ["React Native", "Go", "Redis"], category: "Mobile", difficulty: "Advanced", status: "Ongoing", openSource: true, github: "#", demo: "#", likes: 720, views: 9800, stars: 420, forks: 64, comments: 33, completion: 48, team: 5, duration: "6 months", updated: "8h" },
  { title: "Employee Management System", description: "Role-based HRMS with payroll, PF, leave calendars and audit trails.", cover: cover("1497366216548-37526070297c"), logoDomain: "workday.com", stack: ["React", "Django", "Postgres"], category: "Web", difficulty: "Intermediate", status: "Completed", openSource: false, github: "#", demo: "#", likes: 280, views: 4100, stars: 170, forks: 24, comments: 14, completion: 100, team: 4, duration: "3 months", updated: "3w" },
  { title: "DevOps CI/CD Dashboard", description: "Unified pipeline observability across GitHub, GitLab, Jenkins and ArgoCD.", cover: cover("1518770660439-4636190af475"), logoDomain: "github.com", stack: ["Next.js", "Go", "ClickHouse"], category: "DevOps", difficulty: "Advanced", status: "Completed", openSource: true, github: "#", demo: "#", likes: 690, views: 9200, stars: 410, forks: 62, comments: 29, completion: 100, team: 3, duration: "3 months", updated: "6d" },
  { title: "Cloud Cost Optimizer", description: "Right-sizing recommendations for AWS/GCP with FinOps scorecards.", cover: cover("1451187580459-43490279c0fa"), logoDomain: "aws.amazon.com", stack: ["Python", "Terraform", "Grafana"], category: "Cloud", difficulty: "Advanced", status: "Ongoing", openSource: false, github: "#", demo: "#", likes: 540, views: 7400, stars: 320, forks: 47, comments: 24, completion: 71, team: 3, duration: "3 months", updated: "1d" },
  { title: "AI Chatbot", description: "RAG assistant for college portals — indexes 10k PDFs in minutes.", cover: cover("1531746790731-6c087fecd65a"), logoDomain: "openai.com", stack: ["Next.js", "LangChain", "Pinecone"], category: "AI", difficulty: "Intermediate", status: "Completed", openSource: true, github: "#", demo: "#", likes: 1120, views: 16800, stars: 890, forks: 148, comments: 67, completion: 100, team: 2, duration: "6 weeks", updated: "3d", trending: true },
  { title: "Fraud Detection System", description: "Real-time transaction scoring with graph anomaly detection.", cover: cover("1563986768609-322da13575f3"), logoDomain: "razorpay.com", stack: ["Python", "Kafka", "Neo4j"], category: "Security", difficulty: "Advanced", status: "Completed", openSource: false, github: "#", demo: "#", likes: 470, views: 6300, stars: 290, forks: 41, comments: 22, completion: 100, team: 4, duration: "4 months", updated: "2w" },
  { title: "Face Recognition Attendance", description: "Edge-deployed on Jetson Nano with anti-spoof liveness checks.", cover: cover("1526374965328-7f61d4dc18c5"), logoDomain: "nvidia.com", stack: ["Python", "OpenCV", "TensorRT"], category: "AI", difficulty: "Advanced", status: "Completed", openSource: true, github: "#", demo: "#", likes: 380, views: 5400, stars: 240, forks: 33, comments: 17, completion: 100, team: 2, duration: "8 weeks", updated: "2w" },
  { title: "Weather Forecast AI", description: "Hyperlocal 6-hour nowcasting using ERA5 + ConvLSTM ensemble.", cover: cover("1561484930-998b6a7b22e8"), logoDomain: "openweathermap.org", stack: ["PyTorch", "FastAPI", "Redis"], category: "Data", difficulty: "Advanced", status: "Ongoing", openSource: true, github: "#", demo: "#", likes: 260, views: 3700, stars: 160, forks: 20, comments: 11, completion: 62, team: 2, duration: "3 months", updated: "9h" },
  { title: "Smart Agriculture Platform", description: "IoT-driven irrigation with soil-sensor mesh and yield prediction.", cover: cover("1500382017468-9049fed747ef"), logoDomain: "johndeere.com", stack: ["Arduino", "MQTT", "React"], category: "IoT", difficulty: "Intermediate", status: "Completed", openSource: false, github: "#", demo: "#", likes: 310, views: 4300, stars: 190, forks: 28, comments: 13, completion: 100, team: 4, duration: "10 weeks", updated: "1w" },
  { title: "Blood Bank Management", description: "Live inventory + donor SOS with UPI-based Rewards for repeat donors.", cover: cover("1615461066841-6116e61058f4"), logoDomain: "redcross.org", stack: ["React", "Node.js", "MongoDB"], category: "Web", difficulty: "Intermediate", status: "Completed", openSource: true, github: "#", demo: "#", likes: 220, views: 3100, stars: 140, forks: 19, comments: 10, completion: 100, team: 3, duration: "6 weeks", updated: "2w" },
];



const categories = ["All", "AI", "Web", "Mobile", "Cloud", "DevOps", "Security", "IoT", "Data"] as const;

export function FeaturedProjectsShowcase() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [sort, setSort] = useState("popular");
  const [q, setQ] = useState("");
  const [bookmarked, setBookmarked] = useState<Set<string>>(
    () => new Set(mockPeek<string[]>(MOCK_KEYS.bookmarks, [])),
  );

  useEffect(() => {
    mockGet<string[]>(MOCK_KEYS.bookmarks, []).then((ids) => setBookmarked(new Set(ids)));
  }, []);

  const filtered = useMemo(() => {
    let list = [...showcaseProjects];
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(s) || p.stack.some((t) => t.toLowerCase().includes(s)));
    }
    if (sort === "popular") list.sort((a, b) => b.likes - a.likes);
    if (sort === "newest") list.sort((a, b) => a.updated.localeCompare(b.updated));
    if (sort === "rated") list.sort((a, b) => b.stars - a.stars);
    if (sort === "trending") list.sort((a, b) => Number(!!b.trending) - Number(!!a.trending));
    return list;
  }, [category, sort, q]);

  const toggle = (t: string) => {
    setBookmarked((prev) => {
      const n = new Set(prev);
      n.has(t) ? n.delete(t) : n.add(t);
      // fire and forget — mock API persists to localStorage
      void mockSet(MOCK_KEYS.bookmarks, Array.from(n));
      return n;
    });
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold">Featured Projects</h3>
          <p className="text-sm text-muted-foreground">Production-ready builds — curated from the LUMINA community.</p>
        </div>
        <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects, stack…" className="h-9 rounded-full pl-9" />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-9 w-[150px] rounded-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rated">Highest Rated</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
              category === c
                ? "border-primary bg-primary text-primary-foreground shadow-elegant"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div layout className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
        {filtered.map((p, i) => {
          const isBookmarked = bookmarked.has(p.title);
          return (
            <motion.div
              key={p.title}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: Math.min(i * 0.03, 0.4) }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:border-primary/40 hover:shadow-elegant"
            >
              {/* Gradient border on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 via-transparent to-gold/20 opacity-0 blur-sm transition group-hover:opacity-100" />

              {/* Cover */}
              <div className="relative h-40 overflow-hidden">
                <SafeImage src={p.cover} alt={p.title} seed={p.title} label={p.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                  <Badge className="border-0 bg-background/85 text-[10px] text-foreground backdrop-blur">{p.category}</Badge>
                  <Badge className={`border-0 text-[10px] backdrop-blur ${p.difficulty === "Advanced" ? "bg-red-500/90 text-white" : p.difficulty === "Intermediate" ? "bg-orange-500/90 text-white" : "bg-emerald-500/90 text-white"}`}>{p.difficulty}</Badge>
                  {p.openSource && <Badge className="border-0 bg-blue-500/90 text-[10px] text-white backdrop-blur">OSS</Badge>}
                  {p.trending && <Badge className="border-0 bg-gradient-to-r from-primary to-gold text-[10px] text-white backdrop-blur"><Sparkles className="mr-1 h-2.5 w-2.5" />Trending</Badge>}
                </div>

                <button
                  onClick={() => toggle(p.title)}
                  aria-label="Bookmark project"
                  className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/85 text-foreground backdrop-blur transition hover:bg-background active:scale-90"
                >
                  <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "pop-once fill-gold text-gold" : ""}`} />
                </button>

                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <SafeImage src={clearbit(p.logoDomain)} alt="" seed={p.logoDomain} label={p.logoDomain} className="h-8 w-8 rounded-lg border border-white/20 bg-white object-contain p-1" />
                  <div className="text-white">
                    <p className="text-[10px] uppercase tracking-wider text-white/70">{p.status}</p>
                    <p className="text-xs font-semibold">{p.completion}% complete</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="relative p-4">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-display font-semibold leading-tight">{p.title}</h4>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {p.stack.slice(0, 4).map((s) => (
                    <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                  ))}
                </div>

                {/* Metrics */}
                <div className="mt-4 grid grid-cols-5 gap-1 text-[10px] text-muted-foreground">
                  <Metric icon={Heart} value={p.likes} />
                  <Metric icon={Eye} value={p.views} />
                  <Metric icon={Star} value={p.stars} />
                  <Metric icon={GitFork} value={p.forks} />
                  <Metric icon={MessageSquare} value={p.comments} />
                </div>

                <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{p.team}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{p.duration}</span>
                  <span>Updated {p.updated} ago</span>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <Button size="sm" variant="outline" className="h-8 rounded-full text-xs" asChild><a href={p.github}><Github className="mr-1 h-3 w-3" />Code</a></Button>
                  {p.demo && <Button size="sm" className="h-8 rounded-full gradient-emerald text-xs text-white" asChild><a href={p.demo}><ExternalLink className="mr-1 h-3 w-3" />Demo</a></Button>}
                  {p.docs && <Button size="sm" variant="ghost" className="h-8 w-8 rounded-full p-0"><FileText className="h-3.5 w-3.5" /></Button>}
                  {p.video && <Button size="sm" variant="ghost" className="h-8 w-8 rounded-full p-0"><Play className="h-3.5 w-3.5" /></Button>}
                  <Button size="sm" variant="ghost" className="h-8 w-8 rounded-full p-0"><Download className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="ghost" className="ml-auto h-8 w-8 rounded-full p-0"><Share2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </motion.div>
          );
        })}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="mt-12 text-center text-sm text-muted-foreground">No projects match those filters yet.</div>
      )}
    </div>
  );
}

function Metric({ icon: Icon, value }: any) {
  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
  return (
    <span className="flex items-center gap-1"><Icon className="h-3 w-3" />{fmt(value)}</span>
  );
}
