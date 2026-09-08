import { createFileRoute } from "@tanstack/react-router";
import { MockInterview } from "../mock-interview";
export const Route = createFileRoute("/student/mock-interview")({
  head: () => ({ meta: [{ title: "Mock Interview · LUMINA AI" }] }),
  component: MockInterview,
});
