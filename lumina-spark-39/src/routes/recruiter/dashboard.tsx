import { createFileRoute } from "@tanstack/react-router";
import { Recruiter } from "../recruiter";
export const Route = createFileRoute("/recruiter/dashboard")({
  head: () => ({ meta: [{ title: "Recruiter Dashboard · LUMINA AI" }] }),
  component: Recruiter,
});
