import { createFileRoute } from "@tanstack/react-router";
import { Admin } from "../admin";
export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard · LUMINA AI" }] }),
  component: Admin,
});
