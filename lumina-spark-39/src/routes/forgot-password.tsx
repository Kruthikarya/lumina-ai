import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "./login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password · LUMINA AI" }] }),
  component: Forgot,
});

function Forgot() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll email you a secure reset link."
      foot={<>Remembered it? <Link to="/login" className="font-semibold text-primary hover:underline">Back to sign in</Link></>}
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="you@university.edu" /></div>
        <Button className="w-full rounded-full gradient-emerald text-white shadow-elegant" size="lg">Send reset link</Button>
      </form>
    </AuthShell>
  );
}
