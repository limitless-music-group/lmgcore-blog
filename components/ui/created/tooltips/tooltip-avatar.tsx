import type { ComponentProps, ReactNode } from "react";
import { Avatar } from "../../avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../tooltip";

interface TooltipAvatarProps {
  /** Forwarded to Avatar */
  avatarProps?: ComponentProps<typeof Avatar>;
  children: ReactNode;
  tooltipMessage: string;
}

export function TooltipAvatar({
  avatarProps,
  children,
  tooltipMessage,
}: TooltipAvatarProps) {
  return (
    <Tooltip>
      <TooltipContent>{tooltipMessage}</TooltipContent>
      <TooltipTrigger asChild>
        <Avatar {...avatarProps}>{children}</Avatar>
      </TooltipTrigger>
    </Tooltip>
  );
}
