import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { RoleAuthShell } from "@/components/role-auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/student/login")({
  head: () => ({ meta: [{ title: "Student Sign-in · LUMINA AI" }] }),
  component: StudentLogin,
});

function StudentLogin() {
  return (
    <RoleAuthShell
      role="student"
      title="Welcome back, student"
      subtitle="Pick up your roadmap, mocks and applications."
      foot={<>New here? <Link to="/student/register" className="font-semibold text-primary hover:underline">Create student account</Link></>}
    >
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href = "/student/dashboard"; }}>
        <div className="space-y-2"><Label htmlFor="email">University Email</Label><Input id="email" type="email" placeholder="you@university.edu" required /></div>
        <div className="space-y-2">
          <div className="flex justify-between"><Label htmlFor="pw">Password</Label><Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link></div>
          <Input id="pw" type="password" placeholder="••••••••" required />
        </div>
        <Button className="w-full rounded-full gradient-emerald text-white shadow-elegant" size="lg" type="submit">Enter dashboard <ArrowRight className="ml-2 h-4 w-4" /></Button>
        <div className="flex items-center gap-3 py-2"><Separator className="flex-1" /><span className="text-xs text-muted-foreground">OR</span><Separator className="flex-1" /></div>
        <Button variant="outline" className="w-full rounded-full" size="lg" type="button">Continue with Google</Button>
      </form>
    </RoleAuthShell>
  );
}
