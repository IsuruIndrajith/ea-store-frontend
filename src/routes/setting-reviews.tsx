import { createFileRoute, Outlet } from "@tanstack/react-router";

// Layout route — renders the listing (index) or a detail page (/$slug) via Outlet.
export const Route = createFileRoute("/setting-reviews")({
  component: () => <Outlet />,
});
