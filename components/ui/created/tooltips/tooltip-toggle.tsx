import type { ComponentProps, ReactNode } from "react";
import { Toggle } from "../../toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../tooltip";

interface TooltipToggleProps {
  children: ReactNode;
  /** Forwarded to Toggle */
  toggleProps?: ComponentProps<typeof Toggle>;
  tooltipMessage: string;
}

export function TooltipToggle({
  children,
  toggleProps,
  tooltipMessage,
}: TooltipToggleProps) {
  return (
    <Tooltip>
      <TooltipContent>{tooltipMessage}</TooltipContent>
      <TooltipTrigger asChild>
        <Toggle {...toggleProps}>{children}</Toggle>
      </TooltipTrigger>
    </Tooltip>
  );
}
