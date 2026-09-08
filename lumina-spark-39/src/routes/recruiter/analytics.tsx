import { createFileRoute } from "@tanstack/react-router";
import { Analytics } from "../analytics";
export const Route = createFileRoute("/recruiter/analytics")({
  head: () => ({ meta: [{ title: "Recruiter Analytics · LUMINA AI" }] }),
  component: Analytics,
});
