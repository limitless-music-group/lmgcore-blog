import type { ComponentProps, ReactNode } from "react";
import { Button } from "../../button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../tooltip";

interface TooltipButtonProps {
  /** Forwarded to the root DropdownMenu (open, onOpenChange…). */
  buttonProps?: ComponentProps<typeof Button>;
  children: ReactNode;
  /** Forwarded to DropdownMenuContent (align, side, sideOffset, className…). */
  tooltipMessage: string;
}

export function TooltipButton({
  buttonProps,
  children,
  tooltipMessage,
}: TooltipButtonProps) {
  return (
    <Tooltip>
      <TooltipContent>{tooltipMessage}</TooltipContent>
      <TooltipTrigger asChild>
        <Button {...buttonProps}>{children}</Button>
      </TooltipTrigger>
    </Tooltip>
  );
}
