import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";
import { AppIcons } from "./app-icons";

function Spinner({ className, ...props }: ComponentProps<"svg">) {
  return (
    <AppIcons.Common.Loader
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      role="status"
      {...props}
    />
  );
}

export { Spinner };
