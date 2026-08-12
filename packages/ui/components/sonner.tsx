"use client";

import { useTheme } from "next-themes";
import type { CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { AppIcons } from "./app-icons";
import { Spinner } from "./spinner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      className="toaster group"
      icons={{
        error: <AppIcons.OneOff.OctagonX className="size-4" />,
        info: <AppIcons.Common.Info className="size-4" />,
        loading: <Spinner />,
        success: <AppIcons.OneOff.CircleCheck className="size-4" />,
        warning: <AppIcons.OneOff.TriangleAlert className="size-4" />,
      }}
      richColors={true}
      style={
        {
          "--border-radius": "var(--radius)",
          "--normal-bg": "var(--popover)",
          "--normal-border": "var(--border)",
          "--normal-text": "var(--popover-foreground)",
        } as CSSProperties
      }
      theme={theme as ToasterProps["theme"]}
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
      visibleToasts={3}
    />
  );
};

export { Toaster };
