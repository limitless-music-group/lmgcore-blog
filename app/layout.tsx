import NextTopLoader from "nextjs-toploader";
import type { ReactNode } from "react";
import { fonts } from "@/packages/ui/lib/fonts";
import { Providers } from "./providers";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      className={fonts}
      data-scroll-behavior="smooth"
      lang="en-US"
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <NextTopLoader showSpinner={false} />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
