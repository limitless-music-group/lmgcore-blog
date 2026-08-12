"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "tailwind-variants";
import { marketingPaths } from "@/packages/shared/config/paths";
import { AppIcons } from "@/packages/ui/components/app-icons";
import { Badge } from "@/packages/ui/components/badge";
import { Button } from "@/packages/ui/components/button";
import { ModeToggle } from "@/packages/ui/components/mode-toggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/packages/ui/components/sheet";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tags", label: "Tags" },
  { href: "/authors", label: "Authors" },
  { href: marketingPaths.roadmap.getUrl(), label: "Roadmap" },
] as const;

function Brand() {
  return (
    <Link className="flex items-center gap-2" href="/" prefetch>
      <span className="flex size-7 items-center justify-center rounded-lg bg-foreground font-bold text-background text-sm">
        L
      </span>
      <span className="font-semibold text-lg tracking-tight">LMG Core</span>
      <Badge size="xs" variant="ghost">
        Blog
      </Badge>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-border/60 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Brand />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 sm:flex">
            {NAV_LINKS.map((link) => (
              <Link
                className={cn(
                  "rounded-md px-2 py-1.5 font-medium text-sm transition-colors",
                  isActive(link.href)
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <ModeToggle variant="switch" />
          <Button asChild className="hidden sm:inline-flex" size="lg">
            <Link href={marketingPaths.home.getUrl()}>Open app</Link>
          </Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                aria-label="Open menu"
                className="sm:hidden"
                size="icon"
                variant="ghost"
              >
                <AppIcons.Common.Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-72" side="right">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Brand />
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1 px-2">
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      className={cn(
                        "rounded-md px-3 py-2 font-medium text-sm transition-colors",
                        isActive(link.href)
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      )}
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Button asChild className="mt-3">
                    <Link href={marketingPaths.home.getUrl()}>Open app</Link>
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
