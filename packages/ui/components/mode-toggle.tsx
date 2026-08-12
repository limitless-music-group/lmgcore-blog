"use client";

import { useTheme } from "next-themes";
import type { ComponentType } from "react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "tailwind-variants";
import { Button } from "@/packages/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/packages/ui/components/dropdown-menu";
import { AppIcons } from "./app-icons";

const THEMES = [
  { icon: AppIcons.OneOff.Sun, label: "Light", value: "light" },
  { icon: AppIcons.OneOff.Moon, label: "Dark", value: "dark" },
  { icon: AppIcons.OneOff.Monitor, label: "System", value: "system" },
] as const;

/** One dropdown-variant theme option — memoizes its select handler against
 * its own value instead of recreating a closure in the parent's `.map()`. */
function ThemeMenuItem({
  label,
  onSelect,
  value,
}: {
  label: string;
  onSelect: (value: string) => void;
  value: string;
}) {
  const handleClick = useCallback(() => onSelect(value), [onSelect, value]);
  return <DropdownMenuItem onClick={handleClick}>{label}</DropdownMenuItem>;
}

/** One switch-variant theme button — same memoization reasoning. */
function ThemeSwitchButton({
  active,
  icon: Icon,
  label,
  onSelect,
  value,
}: {
  active: boolean;
  icon: ComponentType<{ className?: string }>;
  label: string;
  onSelect: (value: string) => void;
  value: string;
}) {
  const handleClick = useCallback(() => onSelect(value), [onSelect, value]);

  return (
    <button
      aria-label={label}
      className={cn(
        "flex items-center justify-center rounded-sm p-1 transition-colors",
        active
          ? "bg-accent text-muted-foreground"
          : "text-muted-foreground hover:text-muted-foreground"
      )}
      onClick={handleClick}
      type="button"
    >
      <Icon className="size-3.5" />
    </button>
  );
}

export function ModeToggle({ variant }: { variant?: "dropdown" | "switch" }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="lg" variant="secondary">
            <AppIcons.OneOff.Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <AppIcons.OneOff.Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {THEMES.map(({ value, label }) => (
            <ThemeMenuItem
              key={value}
              label={label}
              onSelect={setTheme}
              value={value}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex w-fit items-center space-x-1 rounded-md border border-muted-foreground/20 p-1">
      {THEMES.map(({ value, icon, label }) => (
        <ThemeSwitchButton
          active={mounted && theme === value}
          icon={icon}
          key={value}
          label={label}
          onSelect={setTheme}
          value={value}
        />
      ))}
    </div>
  );
}
