import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Geist_Mono,
  Noto_Sans_Symbols_2,
  Outfit,
} from "next/font/google";
import { AppShell } from "@/components/site/app-shell";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const symbols = Noto_Sans_Symbols_2({
  variable: "--font-symbols",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Atelier Eliza — natal charts and sittings",
    template: "%s · Atelier Eliza",
  },
  description:
    "A luminous studio for natal charts, sittings with Eliza, a family library of wheels, and letters with the Moon.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${cormorant.variable} ${geistMono.variable} ${symbols.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
