"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAtelier } from "@/lib/atelier-store";
import { cn } from "@/lib/utils";

export function NewsletterForm({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const { addNewsletter } = useAtelier();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(data.error);
      addNewsletter(email.trim().toLowerCase());
      setEmail("");
      toast.success(data.message ?? "You are on the list.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not join the list.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex flex-col gap-2 sm:flex-row",
        variant === "dark" && "[&_input]:border-cream/20 [&_input]:bg-ink [&_input]:text-cream",
      )}
    >
      <Input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Your email"
        aria-label="Email for the studio letters"
        className="h-10"
      />
      <Button
        type="submit"
        disabled={pending}
        variant={variant === "dark" ? "secondary" : "default"}
        className="h-10"
      >
        {pending ? "Sending…" : "Join the list"}
      </Button>
    </form>
  );
}
