import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { fonts } from "@/packages/ui/lib/fonts";
import { Providers } from "./providers";

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
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
