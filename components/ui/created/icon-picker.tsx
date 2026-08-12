"use client";

import {
  AppIcons,
  icons,
  type LucideIcon,
} from "@packages/ui/components/app-icons";

import { Input } from "@packages/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@packages/ui/components/popover";
import { ScrollArea } from "@packages/ui/components/scroll-area";
import type { ChangeEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "tailwind-variants";

const COLOR_OPTIONS = [
  { className: "bg-violet-500", label: "Violet" },
  { className: "bg-indigo-500", label: "Indigo" },
  { className: "bg-blue-500", label: "Blue" },
  { className: "bg-sky-500", label: "Sky" },
  { className: "bg-teal-500", label: "Teal" },
  { className: "bg-emerald-500", label: "Emerald" },
  { className: "bg-green-500", label: "Green" },
  { className: "bg-amber-500", label: "Amber" },
  { className: "bg-orange-500", label: "Orange" },
  { className: "bg-red-500", label: "Red" },
  { className: "bg-rose-500", label: "Rose" },
  { className: "bg-pink-500", label: "Pink" },
  { className: "bg-fuchsia-500", label: "Fuchsia" },
  { className: "bg-stone-500", label: "Stone" },
];

const ALL_ICONS = Object.keys(icons).sort();
const PAGE_SIZE = 48;

export interface IconPickerWithColorProps {
  color: string;
  icon: string;
  onColorChangeAction: (color: string) => void;
  onIconChangeAction: (icon: string) => void;
  onResetAction: () => void;
}

export function getIcon(name: string): LucideIcon {
  return icons[name as keyof typeof icons] ?? icons.Layers;
}

function ColorSwatchButton({
  isSelected,
  label,
  onSelect,
  swatchClassName,
}: {
  isSelected: boolean;
  label: string;
  onSelect: (className: string) => void;
  swatchClassName: string;
}) {
  const handleClick = useCallback(
    () => onSelect(swatchClassName),
    [onSelect, swatchClassName]
  );

  return (
    <button
      aria-pressed={isSelected}
      className={cn(
        "flex size-7 items-center justify-center rounded-full border border-transparent transition",
        isSelected && "border-foreground/20 ring-2 ring-foreground/15"
      )}
      onClick={handleClick}
      title={label}
      type="button"
    >
      <span className={cn("size-5 rounded-full", swatchClassName)} />
    </button>
  );
}

function IconGridButton({
  iconName,
  isSelected,
  onSelect,
}: {
  iconName: string;
  isSelected: boolean;
  onSelect: (iconName: string) => void;
}) {
  const Icon = getIcon(iconName);
  const handleClick = useCallback(
    () => onSelect(iconName),
    [onSelect, iconName]
  );

  return (
    <button
      aria-pressed={isSelected}
      className={cn(
        "flex size-9 items-center justify-center rounded-md border border-transparent text-muted-foreground transition hover:bg-muted",
        isSelected && "bg-muted"
      )}
      onClick={handleClick}
      title={iconName}
      type="button"
    >
      <Icon className="size-4" />
    </button>
  );
}

export function IconPickerWithColor({
  icon,
  color,
  onIconChangeAction,
  onColorChangeAction,
  onResetAction,
}: IconPickerWithColorProps) {
  const [query, setQuery] = useState("");
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const filteredIcons = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) {
      return ALL_ICONS;
    }
    return ALL_ICONS.filter((name) => name.toLowerCase().includes(search));
  }, [query]);

  const displayedIcons = filteredIcons.slice(0, visibleCount);
  const hasMore = visibleCount < filteredIcons.length;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value),
    []
  );

  const handleColorSelect = useCallback(
    (className: string) => {
      onColorChangeAction(className);
      setIsColorOpen(false);
    },
    [onColorChangeAction]
  );

  useEffect(() => {
    const loader = loaderRef.current;
    if (!(loader && hasMore)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => prev + PAGE_SIZE);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loader);
    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <div className="p-3">
      <div className="flex items-center justify-between border-border border-b pb-2">
        <span className="font-semibold text-foreground text-sm">Icon</span>
        <button
          className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
          onClick={onResetAction}
          type="button"
        >
          Reset
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="relative flex-1">
          <AppIcons.OneOff.Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search icons"
            className="h-9 pl-8"
            onChange={handleSearchChange}
            placeholder="Search..."
            value={query}
          />
        </div>
        <Popover onOpenChange={setIsColorOpen} open={isColorOpen}>
          <PopoverTrigger asChild>
            <button
              aria-label="Choose color"
              className="flex size-9 items-center justify-center rounded-md border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
              type="button"
            >
              <span className={cn("size-4 rounded-full", color)} />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-64 rounded-lg p-3"
            side="bottom"
            sideOffset={8}
          >
            <div className="grid grid-cols-7 gap-2">
              {COLOR_OPTIONS.map((option) => (
                <ColorSwatchButton
                  isSelected={option.className === color}
                  key={option.label}
                  label={option.label}
                  onSelect={handleColorSelect}
                  swatchClassName={option.className}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <ScrollArea className="mt-3 h-56 rounded-md border border-border/60">
        <div className="grid grid-cols-8 gap-1.5 p-2">
          {displayedIcons.map((iconName) => (
            <IconGridButton
              iconName={iconName}
              isSelected={iconName === icon}
              key={iconName}
              onSelect={onIconChangeAction}
            />
          ))}
        </div>
        {hasMore && <div className="h-4" ref={loaderRef} />}
      </ScrollArea>
    </div>
  );
}
