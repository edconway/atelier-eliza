"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAtelier } from "@/lib/atelier-store";
import { cn } from "@/lib/utils";
import { BalsamicMoon } from "@/components/site/balsamic-moon";

const links = [
  { href: "/about", label: "Eliza" },
  { href: "/chart/new", label: "Draw a chart" },
  { href: "/members", label: "Account" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { setBookingOpen, member } = useAtelier();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-heading text-[1.35rem] tracking-tight">
          <BalsamicMoon className="mr-1.5 inline-block size-5 align-[-3px] text-rose" />
          Eliza Pelham
        </Link>
        <nav className="hidden items-center gap-7 text-sm md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-muted-foreground transition-colors hover:text-rose",
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
          <Button size="sm" className="rounded-full px-4" onClick={() => setBookingOpen(true)}>
            Book
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
                className="mt-4 rounded-full"
                onClick={() => {
                  setOpen(false);
                  setBookingOpen(true);
                }}
              >
                Book
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
