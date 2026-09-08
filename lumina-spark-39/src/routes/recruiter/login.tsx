import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2 } from "lucide-react";
import { RoleAuthShell } from "@/components/role-auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/recruiter/login")({
  head: () => ({ meta: [{ title: "Recruiter Sign-in · LUMINA AI" }] }),
  component: RecruiterLogin,
});

function RecruiterLogin() {
  return (
    <RoleAuthShell
      role="recruiter"
      title="Recruiter sign-in"
      subtitle="Discover top-ranked candidates with verified AI signals."
      foot={<>Hiring with us for the first time? <Link to="/recruiter/register" className="font-semibold text-primary hover:underline">Create recruiter account</Link></>}
    >
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href = "/recruiter/dashboard"; }}>
        <div className="space-y-2"><Label htmlFor="email">Work Email</Label><Input id="email" type="email" placeholder="you@company.com" required /></div>
        <div className="space-y-2">
          <div className="flex justify-between"><Label htmlFor="pw">Password</Label><Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link></div>
          <Input id="pw" type="password" placeholder="••••••••" required />
        </div>
        <Button className="w-full rounded-full gradient-emerald text-white shadow-elegant" size="lg" type="submit">Enter recruiter console <ArrowRight className="ml-2 h-4 w-4" /></Button>
        <div className="flex items-center gap-3 py-2"><Separator className="flex-1" /><span className="text-xs text-muted-foreground">OR</span><Separator className="flex-1" /></div>
        <Button variant="outline" className="w-full rounded-full" size="lg" type="button"><Building2 className="mr-2 h-4 w-4" />Continue with SSO</Button>
      </form>
    </RoleAuthShell>
  );
}
