import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
        <>
          <Navbar />
          {children}
          <Footer />
        </>
  );
}
