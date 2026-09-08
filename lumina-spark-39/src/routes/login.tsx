import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export function AuthShell({ title, subtitle, children, foot }: { title: string; subtitle: string; children: ReactNode; foot: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 gradient-emerald" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 backdrop-blur"><Sparkles className="h-4 w-4" /></div>
            <span className="font-display text-lg font-bold">LUMINA AI</span>
          </Link>
          <div>
            <h2 className="font-display text-4xl font-bold leading-tight">"The first product that made me feel actually <em className="not-italic text-gold">prepared</em>."</h2>
            <p className="mt-4 text-white/80">— Ananya M., now at Microsoft</p>
          </div>
          <div className="text-xs text-white/60">© {new Date().getFullYear()} LUMINA AI · Crafted for the next generation.</div>
        </div>
      </div>
      <div className="flex min-h-screen flex-col">
        <div className="flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div className="grid h-8 w-8 place-items-center rounded-xl gradient-emerald"><Sparkles className="h-4 w-4 text-white" /></div>
            <span className="font-display font-bold">LUMINA AI</span>
          </Link>
          <div className="ml-auto"><ThemeToggle /></div>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in · LUMINA AI" }] }),
  component: Login,
});

function Login() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your LUMINA workspace."
      foot={<>Don't have an account? <Link to="/register" className="font-semibold text-primary hover:underline">Create one</Link></>}
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="you@university.edu" /></div>
        <div className="space-y-2">
          <div className="flex justify-between"><Label htmlFor="pw">Password</Label><Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link></div>
          <Input id="pw" type="password" placeholder="••••••••" />
        </div>
        <Button className="w-full rounded-full gradient-emerald text-white shadow-elegant" size="lg">Sign in <ArrowRight className="ml-2 h-4 w-4" /></Button>
        <div className="flex items-center gap-3 py-2"><Separator className="flex-1" /><span className="text-xs text-muted-foreground">OR</span><Separator className="flex-1" /></div>
        <Button variant="outline" className="w-full rounded-full" size="lg">Continue with Google</Button>
      </form>
    </AuthShell>
  );
}
