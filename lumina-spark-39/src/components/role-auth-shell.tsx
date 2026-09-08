import { Link } from "@tanstack/react-router";
import { Sparkles, GraduationCap, Building2, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { ThemeToggle } from "./theme-toggle";

type Role = "student" | "recruiter" | "admin";

const meta: Record<Role, { label: string; tagline: string; icon: typeof Sparkles; quote: string; author: string }> = {
  student: {
    label: "Student",
    tagline: "Score your resume, run mocks, and discover opportunities tailored to you.",
    icon: GraduationCap,
    quote: "I went from rejected to a Microsoft offer in 8 weeks. LUMINA showed me exactly what to fix.",
    author: "Ananya M. · Microsoft",
  },
  recruiter: {
    label: "Recruiter",
    tagline: "Ranked candidates with verified signals. No more resume guesswork.",
    icon: Building2,
    quote: "Match accuracy is uncanny. We saved 12+ hours per role with LUMINA's AI ranking.",
    author: "Sara K. · Stripe",
  },
  admin: {
    label: "Admin",
    tagline: "Run your placement cell from a single AI-powered control room.",
    icon: ShieldCheck,
    quote: "We replaced four spreadsheets with one dashboard. Recruiter conversion up 38%.",
    author: "Vikram R. · Placement Cell",
  },
};

export function RoleAuthShell({ role, title, subtitle, children, foot }: { role: Role; title: string; subtitle: string; children: ReactNode; foot: ReactNode }) {
  const m = meta[role];
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 gradient-emerald" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.18),transparent_55%)]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 translate-x-1/4 translate-y-1/4 rounded-full bg-gold/40 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 backdrop-blur"><Sparkles className="h-4 w-4" /></div>
              <span className="font-display text-lg font-bold">LUMINA AI</span>
            </Link>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <m.icon className="h-3.5 w-3.5" />{m.label} Portal
            </div>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/70">For {m.label.toLowerCase()}s</p>
            <h2 className="mt-3 font-display text-4xl font-bold leading-tight">{m.tagline}</h2>
            <blockquote className="mt-8 border-l-2 border-gold/80 pl-4 text-sm italic text-white/85">"{m.quote}"</blockquote>
            <p className="mt-2 text-xs text-white/60">— {m.author}</p>
          </div>
          <div className="text-xs text-white/60">© {new Date().getFullYear()} LUMINA AI</div>
        </div>
      </div>
      <div className="flex min-h-screen flex-col">
        <div className="flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div className="grid h-8 w-8 place-items-center rounded-xl gradient-emerald"><Sparkles className="h-4 w-4 text-white" /></div>
            <span className="font-display font-bold">LUMINA AI</span>
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:inline">Wrong portal?</span>
            <Link to="/" className="hidden text-xs font-semibold text-primary hover:underline sm:inline">Switch role</Link>
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <m.icon className="h-3 w-3" /> {m.label} Sign-in
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-8">{children}</div>
            <div className="mt-6 text-sm text-muted-foreground">{foot}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
