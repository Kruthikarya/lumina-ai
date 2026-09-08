import { createFileRoute } from "@tanstack/react-router";
import { Candidate } from "../candidate";
export const Route = createFileRoute("/recruiter/candidate")({
  head: () => ({ meta: [{ title: "Candidate Profile · LUMINA AI" }] }),
  component: Candidate,
});
