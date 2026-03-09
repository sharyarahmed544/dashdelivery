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

export const metadata: Metadata = {
  title: "Dash Delivery — UK & Europe's Fastest Courier",
  description: "From London to Lisbon, Edinburgh to Athens — Dash moves your parcels faster, smarter and safer.",
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
        <Cursor />
        <ThemeToggle />
        <Nav />
        {children}
      </body>
    </html>
  );
}
