import type { ComponentProps, ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../tooltip";

interface TooltipDropdownMenuProps {
  children: ReactNode;
  /** Forwarded to DropdownMenuContent (align, side, sideOffset, className…). */
  contentProps?: ComponentProps<typeof DropdownMenuContent>;
  dropdownMenuTrigger: ReactNode;
  /** Forwarded to the root DropdownMenu (open, onOpenChange…). */
  menuProps?: Omit<ComponentProps<typeof DropdownMenu>, "children" | "modal">;
  tooltipMessage: string;
  triggerProps?: ComponentProps<typeof DropdownMenuTrigger>;
}

export function TooltipDropdownMenu({
  children,
  tooltipMessage,
  dropdownMenuTrigger,
  contentProps,
  menuProps,
  triggerProps,
}: TooltipDropdownMenuProps) {
  return (
    // modal={false}: keep outside-clicks from being swallowed by the dismiss
    // layer so clicking a sibling trigger opens it in one click (no latch /
    // double-click between adjacent menus).
    <DropdownMenu modal={false} {...menuProps}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild {...triggerProps}>
            {dropdownMenuTrigger}
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>{tooltipMessage}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent {...contentProps}>{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}
