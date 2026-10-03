"use client";

import { Button } from "@/components/ui/button";
import { useAtelier } from "@/lib/atelier-store";

export function BookButton({ label = "Request this sitting" }: { label?: string }) {
  const { setBookingOpen } = useAtelier();
  return (
    <Button variant="outline" onClick={() => setBookingOpen(true)}>
      {label}
    </Button>
  );
}
