"use client";

import { log } from "@packages/observability/log";
import { AppIcons } from "@packages/ui/components/app-icons";
import { Button } from "@packages/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@packages/ui/components/tooltip";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "tailwind-variants";

export function CopyButton({
  copyValue,
  className,
}: {
  copyValue: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyToClipboard = useCallback(async () => {
    setCopied(true);

    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      toast.success(`Copied: ${copyValue}`);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Couldn't copy");
      log.error("Failed to copy: ", { err });
    }
  }, [copyValue]);

  const dark = resolvedTheme === "dark" ? "gray" : "blue";
  const color: "gray" | "blue" = mounted ? dark : "blue";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn("cursor-pointer", `text-${color}`, className)}
          onClick={copyToClipboard}
          size="default"
          variant="outline"
        >
          {copied ? "Copied" : "Copy"}{" "}
          {copied ? <AppIcons.Common.Check /> : <AppIcons.OneOff.Copy />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied" : "Copy"}</TooltipContent>
    </Tooltip>
  );
}
