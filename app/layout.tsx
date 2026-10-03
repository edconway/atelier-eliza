import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono, Noto_Sans_Symbols_2 } from "next/font/google";
import { AppShell } from "@/components/site/app-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
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
    "A studio in Bath where Eliza draws natal charts and sits with you over them. Keep a family library, book an hour, watch the films of sittings past.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${symbols.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
