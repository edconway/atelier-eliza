"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAtelier } from "@/lib/atelier-store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/about", label: "Eliza" },
  { href: "/consultations", label: "Sittings" },
  { href: "/chart/new", label: "Draw a chart" },
  { href: "/journal", label: "Journal" },
  { href: "/members", label: "Atelier" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { setBookingOpen, member } = useAtelier();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-heading text-xl tracking-tight">
          Atelier <span className="italic text-gold">Eliza</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-muted-foreground transition-colors hover:text-foreground",
                pathname === link.href && "text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href={member ? "/members" : "/sign-in"}>
              {member ? member.name.split(" ")[0] : "Sign in"}
            </Link>
          </Button>
          <Button size="sm" onClick={() => setBookingOpen(true)}>
            Book a sitting
          </Button>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 pt-10">
            <nav className="flex flex-col gap-4 text-base">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-heading text-lg"
                >
                  {link.label}
                </Link>
              ))}
              <Button
                className="mt-4"
                onClick={() => {
                  setOpen(false);
                  setBookingOpen(true);
                }}
              >
                Book a sitting
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
