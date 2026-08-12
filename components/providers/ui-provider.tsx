import { ThemeProvider } from "./theme";
import type { ThemeProviderProps } from "next-themes";
import { Toaster } from "../components/ui/sonner";
import { TooltipProvider } from "../components/ui/tooltip";

type UiProviderProps = ThemeProviderProps & {};

export const UiProvider = ({ children, ...props }: UiProviderProps) => (
  <ThemeProvider {...props}>
    <TooltipProvider>{children}</TooltipProvider>
    <Toaster />
  </ThemeProvider>
);
