import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AuthShell } from "./login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account · LUMINA AI" }] }),
  component: Register,
});

function Register() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Start your placement journey in under a minute."
      foot={<>Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link></>}
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2"><Label>First name</Label><Input placeholder="Aarav" /></div>
          <div className="space-y-2"><Label>Last name</Label><Input placeholder="Sharma" /></div>
        </div>
        <div className="space-y-2"><Label>University email</Label><Input type="email" placeholder="you@university.edu" /></div>
        <div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="At least 8 characters" /></div>
        <div className="space-y-2"><Label>I am a</Label>
          <div className="grid grid-cols-3 gap-2">
            {["Student", "Recruiter", "Admin"].map((r) => (
              <button key={r} type="button" className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium transition hover:border-primary hover:bg-primary/5">{r}</button>
            ))}
          </div>
        </div>
        <Button className="w-full rounded-full gradient-emerald text-white shadow-elegant" size="lg">Create account <ArrowRight className="ml-2 h-4 w-4" /></Button>
        <div className="flex items-center gap-3 py-2"><Separator className="flex-1" /><span className="text-xs text-muted-foreground">OR</span><Separator className="flex-1" /></div>
        <Button variant="outline" className="w-full rounded-full" size="lg">Continue with Google</Button>
        <p className="text-center text-xs text-muted-foreground">By creating an account you agree to our Terms & Privacy.</p>
      </form>
    </AuthShell>
  );
}
