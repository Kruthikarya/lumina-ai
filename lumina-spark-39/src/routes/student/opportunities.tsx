import { createFileRoute } from "@tanstack/react-router";
import { Opportunities } from "../opportunities";
export const Route = createFileRoute("/student/opportunities")({
  head: () => ({ meta: [{ title: "Opportunities · LUMINA AI" }] }),
  component: Opportunities,
});
