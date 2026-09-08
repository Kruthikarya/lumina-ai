import { motion } from "framer-motion";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, FileText, Compass, Map, MessageSquare, ClipboardList,
  Users, UserCircle, ShieldCheck, CalendarClock, BarChart3, Bell, Search,
  Briefcase, Building2, GraduationCap, LogOut, Bot, Trophy, Microscope, User,
} from "lucide-react";
import type { ReactNode, ComponentType } from "react";
import { ThemeToggle } from "./theme-toggle";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LuminaLogo } from "./lumina-logo";
import { FloatingAssistant } from "./floating-assistant";

type Role = "student" | "recruiter" | "admin";

type NavItem = { to: string; icon: ComponentType<{ className?: string }>; label: string };

const navByRole: Record<Role, { groups: { label: string; items: NavItem[] }[]; user: { name: string; meta: string; initials: string }; badge: string }> = {
  student: {
    badge: "Student",
    user: { name: "Aarav Sharma", meta: "CS · Final Year", initials: "AS" },
    groups: [
      { label: "Workspace", items: [
        { to: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/student/profile", icon: User, label: "My Profile" },
        { to: "/student/resume", icon: FileText, label: "Resume AI" },
        { to: "/student/roadmap", icon: Map, label: "Career Roadmap" },
        { to: "/student/assistant", icon: Bot, label: "AI Assistant" },
      ]},
      { label: "Grow", items: [
        { to: "/student/opportunities", icon: Compass, label: "Opportunities" },
        { to: "/student/internships", icon: Briefcase, label: "Internships" },
        { to: "/student/hackathons", icon: Trophy, label: "Hackathons" },
        { to: "/student/research", icon: Microscope, label: "Research" },
      ]},
      { label: "Practice", items: [
        { to: "/student/mock-interview", icon: MessageSquare, label: "Mock Interview" },
        { to: "/student/assignments", icon: ClipboardList, label: "Assignments" },
      ]},
    ],
  },
  recruiter: {
    badge: "Recruiter",
    user: { name: "Sara Kapoor", meta: "Talent · Stripe", initials: "SK" },
    groups: [
      { label: "Hiring", items: [
        { to: "/recruiter/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/recruiter/candidates", icon: Users, label: "Candidates" },
        { to: "/recruiter/candidate", icon: UserCircle, label: "Profile View" },
        { to: "/recruiter/jobs", icon: Briefcase, label: "Job Postings" },
      ]},
      { label: "Insights", items: [
        { to: "/recruiter/analytics", icon: BarChart3, label: "Analytics" },
      ]},
    ],
  },
  admin: {
    badge: "Admin",
    user: { name: "Dr. R. Mehta", meta: "Placement Cell", initials: "RM" },
    groups: [
      { label: "Overview", items: [
        { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
      ]},
      { label: "Manage", items: [
        { to: "/admin/sessions", icon: CalendarClock, label: "Sessions" },
        { to: "/admin/students", icon: GraduationCap, label: "Students" },
        { to: "/admin/recruiters", icon: Building2, label: "Recruiters" },
        { to: "/admin/opportunities", icon: Briefcase, label: "Opportunities" },
      ]},
    ],
  },
};

function detectRole(pathname: string): Role {
  if (pathname.startsWith("/recruiter")) return "recruiter";
  if (pathname.startsWith("/admin")) return "admin";
  return "student";
}

export function DashboardLayout({ title, subtitle, children, role: roleProp }: { title: string; subtitle?: string; children: ReactNode; role?: Role }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const role = roleProp ?? detectRole(pathname);
  const config = navByRole[role];
  const loginHref = `/${role}/login`;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
        <Link to="/" className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <LuminaLogo size={36} className="h-9 w-9" />
          <span className="font-display text-lg font-bold">LUMINA <span className="gradient-text">AI</span></span>
        </Link>
        <div className="px-5 pt-4">
          <Badge className="gradient-emerald text-white border-0">{config.badge} Console</Badge>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {config.groups.map((g) => (
            <div key={g.label} className="mb-5">
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">{g.label}</p>
              <ul className="space-y-1">
                {g.items.map(({ to, icon: Icon, label }) => {
                  const active = pathname === to;
                  return (
                    <li key={to} className="relative">
                      {active && (
                        <motion.span
                          layoutId="sidebar-active"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          className="absolute inset-0 rounded-lg bg-sidebar-primary shadow-elegant"
                        />
                      )}
                      <Link
                        to={to}
                        className={
                          "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 " +
                          (active
                            ? "text-sidebar-primary-foreground"
                            : "text-sidebar-foreground/80 hover:translate-x-1 hover:bg-sidebar-accent hover:text-sidebar-foreground")
                        }
                      >
                        <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary/15 text-primary">{config.user.initials}</AvatarFallback></Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{config.user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{config.user.meta}</p>
            </div>
            <Link to={loginHref} title="Sign out" className="rounded-lg p-2 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <LuminaLogo size={32} className="h-8 w-8" />
              <span className="font-display text-base font-bold">LUMINA</span>
            </Link>
          </div>
          <div className="relative ml-auto hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search…" className="h-10 rounded-full bg-muted pl-10" />
          </div>
          <Badge variant="outline" className="hidden lg:inline-flex">
            <ShieldCheck className="mr-1 h-3 w-3 text-primary" />{config.badge}
          </Badge>
          <Button variant="ghost" size="icon" className="ml-auto md:ml-0 rounded-full"><Bell className="h-4 w-4" /></Button>
          <ThemeToggle />
          <Avatar className="h-9 w-9 lg:hidden"><AvatarFallback className="bg-primary/15 text-primary">{config.user.initials}</AvatarFallback></Avatar>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </motion.div>
          {children}
        </main>
      </div>
      {role === "student" && <FloatingAssistant />}
    </div>
  );
}
