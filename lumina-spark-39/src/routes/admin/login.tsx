import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { RoleAuthShell } from "@/components/role-auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Sign-in · LUMINA AI" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  return (
    <RoleAuthShell
      role="admin"
      title="Admin Control Center"
      subtitle="Restricted access. Sign in with your institution credentials."
      foot={<span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" />SSO + 2FA enforced for admin accounts.</span>}
    >
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href = "/admin/dashboard"; }}>
        <div className="space-y-2"><Label htmlFor="email">Institution Email</Label><Input id="email" type="email" placeholder="admin@institution.edu" required /></div>
        <div className="space-y-2"><Label htmlFor="pw">Password</Label><Input id="pw" type="password" placeholder="••••••••" required /></div>
        <div className="space-y-2"><Label htmlFor="otp">2FA Code</Label><Input id="otp" inputMode="numeric" placeholder="6-digit code" maxLength={6} required /></div>
        <Button className="w-full rounded-full gradient-emerald text-white shadow-elegant" size="lg" type="submit">Enter admin console <ArrowRight className="ml-2 h-4 w-4" /></Button>
        <p className="text-center text-xs text-muted-foreground">Admin accounts are provisioned by LUMINA support — no public sign-up.</p>
      </form>
    </RoleAuthShell>
  );
}
