import type { Metadata } from "next";
import { Bebas_Neue, Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const syne = Syne({
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-dm",
  subsets: ["latin"],
});

import Cursor from "@/components/ui/Cursor";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Nav from "@/components/ui/Nav";
import ClientLayoutWrapper from "@/components/providers/ClientLayoutWrapper";

export const metadata: Metadata = {
  // ...
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bebasNeue.variable} ${syne.variable} ${dmSans.variable} antialiased`}
      >
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
