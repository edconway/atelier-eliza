"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AtelierProvider } from "@/lib/atelier-store";
import { BookingDialog } from "@/components/booking/booking-dialog";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AtelierProvider>
      <TooltipProvider delayDuration={200}>
        <div className="flex min-h-full flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <BookingDialog />
        <Toaster />
      </TooltipProvider>
    </AtelierProvider>
  );
}
