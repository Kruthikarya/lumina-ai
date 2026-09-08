import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "../dashboard";
export const Route = createFileRoute("/student/dashboard")({
  head: () => ({ meta: [{ title: "Student Dashboard · LUMINA AI" }] }),
  component: Dashboard,
});
