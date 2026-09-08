import { createFileRoute } from "@tanstack/react-router";
import { Opportunities } from "../opportunities";
export const Route = createFileRoute("/admin/opportunities")({
  head: () => ({ meta: [{ title: "Opportunity Management · LUMINA AI" }] }),
  component: Opportunities,
});
