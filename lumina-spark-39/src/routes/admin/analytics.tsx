import { createFileRoute } from "@tanstack/react-router";
import { Analytics } from "../analytics";
export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "Admin Analytics · LUMINA AI" }] }),
  component: Analytics,
});
