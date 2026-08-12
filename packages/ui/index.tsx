import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider } from "@/packages/ui/providers/theme";
import { Toaster } from "./components/sonner";
import { TooltipProvider } from "./components/tooltip";

type UiProviderProps = ThemeProviderProps & {};

export const UiProvider = ({ children, ...props }: UiProviderProps) => (
  <ThemeProvider {...props}>
    <TooltipProvider>{children}</TooltipProvider>
    <Toaster />
  </ThemeProvider>
);
