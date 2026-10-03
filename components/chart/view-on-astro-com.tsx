"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ASTRO_COM_ADE_URL, astroComFormFields } from "@/lib/astro-com";
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
  const fields = astroComFormFields(chart.input);

  return (
    <form
      action={ASTRO_COM_ADE_URL}
      method="post"
      target="_blank"
      className={cn("w-full", className)}
    >
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <Button
        type="submit"
        variant={variant}
        size={size}
        className={cn("rounded-full", size === "default" && "w-full")}
        title="Opens Astro.com with this birth data so you can confirm the place and see their wheel"
      >
        {label}
        <ExternalLink data-icon="inline-end" />
      </Button>
    </form>
  );
}
