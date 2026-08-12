import { DM_Mono, DM_Sans, DM_Serif_Display } from "next/font/google";
import { cn } from "tailwind-variants";

const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
});

const fontMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500"],
});

export const fonts = cn(
  `${fontSans.variable} ${fontSerif.variable} ${fontMono.variable}`,
  "touch-manipulation scroll-smooth font-sans antialiased"
);
