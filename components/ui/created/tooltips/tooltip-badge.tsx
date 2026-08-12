import type { ComponentProps, ReactNode } from "react";
import { Badge } from "../../badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../tooltip";

interface TooltipBadgeProps {
  /** Forwarded to Badge */
  badgeProps?: ComponentProps<typeof Badge>;
  children: ReactNode;
  tooltipMessage: string;
}

export function TooltipBadge({
  children,
  badgeProps,
  tooltipMessage,
}: TooltipBadgeProps) {
  return (
    <Tooltip>
      <TooltipContent>{tooltipMessage}</TooltipContent>
      <TooltipTrigger asChild>
        <Badge {...badgeProps}>{children}</Badge>
      </TooltipTrigger>
    </Tooltip>
  );
}
