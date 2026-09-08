import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { RoleAuthShell } from "@/components/role-auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/recruiter/register")({
  head: () => ({ meta: [{ title: "Recruiter Sign-up · LUMINA AI" }] }),
  component: RecruiterRegister,
});

function RecruiterRegister() {
  return (
    <RoleAuthShell
      role="recruiter"
      title="Create your recruiter account"
      subtitle="Post roles, rank candidates, and run pipelines in minutes."
      foot={<>Already on LUMINA? <Link to="/recruiter/login" className="font-semibold text-primary hover:underline">Sign in</Link></>}
    >
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href = "/recruiter/dashboard"; }}>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2"><Label>Full name</Label><Input placeholder="Sara Kapoor" required /></div>
          <div className="space-y-2"><Label>Company</Label><Input placeholder="Stripe" required /></div>
        </div>
        <div className="space-y-2"><Label>Work email</Label><Input type="email" placeholder="you@company.com" required /></div>
        <div className="space-y-2"><Label>Hiring focus</Label><Input placeholder="e.g. SDE, Data, Product" /></div>
        <div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="At least 8 characters" required /></div>
        <Button className="w-full rounded-full gradient-emerald text-white shadow-elegant" size="lg" type="submit">Create recruiter account <ArrowRight className="ml-2 h-4 w-4" /></Button>
        <p className="text-center text-xs text-muted-foreground">Verification email sent to your work address.</p>
      </form>
    </RoleAuthShell>
  );
}
