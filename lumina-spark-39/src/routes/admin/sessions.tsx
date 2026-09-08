import { createFileRoute } from "@tanstack/react-router";
import { Sessions } from "../sessions";
export const Route = createFileRoute("/admin/sessions")({
  head: () => ({ meta: [{ title: "Sessions · LUMINA AI" }] }),
  component: Sessions,
});
