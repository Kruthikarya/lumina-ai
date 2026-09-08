import { Link } from "@tanstack/react-router";
import { Github, Twitter, Linkedin } from "lucide-react";
import { LuminaLogo } from "./lumina-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <LuminaLogo size={36} className="h-9 w-9" />
              <span className="font-display text-lg font-bold">LUMINA <span className="gradient-text">AI</span></span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              The AI ecosystem for student growth, opportunity intelligence and placement readiness.
            </p>
          </div>
          {[
            { title: "Product", items: [["Student Dashboard", "/dashboard"], ["Resume AI", "/resume"], ["Mock Interview", "/mock-interview"], ["Roadmap", "/roadmap"]] },
            { title: "For Teams", items: [["Recruiter", "/recruiter"], ["Admin", "/admin"], ["Sessions", "/sessions"], ["Analytics", "/analytics"]] },
            { title: "Company", items: [["About", "/"], ["Careers", "/"], ["Privacy", "/"], ["Terms", "/"]] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground/80">{col.title}</h4>
              <ul className="mt-4 space-y-2 text-sm">
                {col.items.map(([label, to]) => (
                  <li key={label}><Link to={to} className="text-muted-foreground transition hover:text-foreground">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} LUMINA AI. Crafted for the next generation.</p>
          <div className="flex gap-3">
            <a className="rounded-full p-2 hover:bg-accent" href="#"><Twitter className="h-4 w-4" /></a>
            <a className="rounded-full p-2 hover:bg-accent" href="#"><Github className="h-4 w-4" /></a>
            <a className="rounded-full p-2 hover:bg-accent" href="#"><Linkedin className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
