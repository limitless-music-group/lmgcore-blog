import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "tailwind-variants";
import { AppIcons } from "@/packages/ui/components/app-icons";

export function BackLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      className={cn(
        "group/button flex h-full w-fit shrink-0 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent bg-secondary bg-clip-padding px-2.5 font-medium text-secondary-foreground text-sm outline-none transition-all hover:bg-secondary/80 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      href={href}
      prefetch
    >
      <AppIcons.Directional.ChevronLeft className="size-4 hover:-translate-x-1" />
      {children}
    </Link>
  );
}
