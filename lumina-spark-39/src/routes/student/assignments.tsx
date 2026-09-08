import { createFileRoute } from "@tanstack/react-router";
import { Assignments } from "../assignments";
export const Route = createFileRoute("/student/assignments")({
  head: () => ({ meta: [{ title: "Assignments · LUMINA AI" }] }),
  component: Assignments,
});
