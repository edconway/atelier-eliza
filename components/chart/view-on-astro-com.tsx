"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { NatalChart } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ViewOnAstroCom({
  chart,
  variant = "outline",
  size = "default",
  className,
  label = "View on Astro.com",
}: {
  chart: NatalChart;
  variant?: "outline" | "ghost" | "secondary";
  size?: "default" | "sm";
  className?: string;
  label?: string;
}) {
  const [pending, setPending] = useState(false);

  async function openOnAstroCom() {
    setPending(true);
    try {
      const response = await fetch("/api/astro-com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chart.input),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Astro.com did not open this chart.");
      }
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Astro.com could not open this chart.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn("rounded-full", size === "default" && "w-full", className)}
      onClick={openOnAstroCom}
      disabled={pending}
      title="Opens this birth data on Astro.com. They may ask you to register (free) before showing the wheel."
    >
      {pending ? "Opening Astro.com…" : label}
      <ExternalLink data-icon="inline-end" />
    </Button>
  );
}
