'use client';

import { 
    ThemeProvider as NextThemeProvider,
    type ThemeProviderProps, 
} from "next-themes";

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => (
    <NextThemeProvider
        attribute={"class"}
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
        {...props}
    >
        {children}
    </NextThemeProvider>
)