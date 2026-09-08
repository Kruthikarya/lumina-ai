import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { RoleAuthShell } from "@/components/role-auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/student/register")({
  head: () => ({ meta: [{ title: "Student Sign-up · LUMINA AI" }] }),
  component: StudentRegister,
});

function StudentRegister() {
  return (
    <RoleAuthShell
      role="student"
      title="Create your student account"
      subtitle="Start your placement journey in under a minute."
      foot={<>Already registered? <Link to="/student/login" className="font-semibold text-primary hover:underline">Sign in</Link></>}
    >
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href = "/student/dashboard"; }}>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2"><Label>First name</Label><Input placeholder="Aarav" required /></div>
          <div className="space-y-2"><Label>Last name</Label><Input placeholder="Sharma" required /></div>
        </div>
        <div className="space-y-2"><Label>University Email</Label><Input type="email" placeholder="you@university.edu" required /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2"><Label>College</Label><Input placeholder="e.g. RVCE" required /></div>
          <div className="space-y-2"><Label>Branch / Year</Label><Input placeholder="CSE · 3rd Year" required /></div>
        </div>
        <div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="At least 8 characters" required /></div>
        <Button className="w-full rounded-full gradient-emerald text-white shadow-elegant" size="lg" type="submit">Create student account <ArrowRight className="ml-2 h-4 w-4" /></Button>
        <p className="text-center text-xs text-muted-foreground">By signing up you agree to our Terms & Privacy.</p>
      </form>
    </RoleAuthShell>
  );
}
