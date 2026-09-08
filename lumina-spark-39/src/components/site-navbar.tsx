import { Link } from "@tanstack/react-router";
import { Menu, GraduationCap, Building2, ShieldCheck, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { LuminaLogo } from "./lumina-logo";
import {
  Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/student/opportunities", label: "Opportunities" },
  { to: "#colleges", label: "Colleges" },
  { to: "#features", label: "Features" },
];

const portals = [
  { to: "/student/login", icon: GraduationCap, label: "Student Portal", desc: "Resume, roadmap, mocks" },
  { to: "/recruiter/login", icon: Building2, label: "Recruiter Portal", desc: "Ranked candidates" },
  { to: "/admin/login", icon: ShieldCheck, label: "Admin Portal", desc: "Institution control" },
];

export function SiteNavbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <LuminaLogo size={36} className="h-9 w-9" />
          <span className="font-display text-lg font-bold tracking-tight">
            LUMINA <span className="gradient-text">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            l.to.startsWith("#") ? (
              <a key={l.to} href={l.to} className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground">{l.label}</a>
            ) : (
              <Link key={l.to} to={l.to} className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground">{l.label}</Link>
            )
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                Sign in <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Choose your portal</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {portals.map((p) => (
                <DropdownMenuItem key={p.to} asChild>
                  <Link to={p.to} className="flex items-start gap-3 py-2">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><p.icon className="h-4 w-4" /></div>
                    <div><p className="text-sm font-semibold">{p.label}</p><p className="text-xs text-muted-foreground">{p.desc}</p></div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/student/register" className="hidden sm:block">
            <Button size="sm" className="rounded-full gradient-emerald text-white shadow-elegant hover:opacity-90">Get started</Button>
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader><SheetTitle>LUMINA AI</SheetTitle></SheetHeader>
              <div className="mt-6 flex flex-col gap-1">
                {navLinks.map((l) => (
                  l.to.startsWith("#") ? (
                    <a key={l.to} href={l.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent">{l.label}</a>
                  ) : (
                    <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent">{l.label}</Link>
                  )
                ))}
                <p className="mt-4 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Portals</p>
                {portals.map((p) => (
                  <Link key={p.to} to={p.to} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent">
                    <p.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{p.label}</span>
                  </Link>
                ))}
                <Link to="/student/register" onClick={() => setOpen(false)} className="mt-3 rounded-lg gradient-emerald px-3 py-2 text-center text-sm font-semibold text-white">Get started free</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
