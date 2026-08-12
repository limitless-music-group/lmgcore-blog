import type { ReactNode } from "react";

// Sanity Studio is a fully client-rendered SPA — the root layout's Navbar
// uses usePathname() with no Suspense boundary, which blocks the static
// shell Cache Components expects. Opting out here (not on the root layout)
// keeps every other route's static-shell validation intact.
export const instant = false;

export default function StudioLayout({ children }: { children: ReactNode }) {
  return children;
}
