import { createFileRoute } from "@tanstack/react-router";
import { Resume } from "../resume";
export const Route = createFileRoute("/student/resume")({
  head: () => ({ meta: [{ title: "Resume AI · LUMINA AI" }] }),
  component: Resume,
});
