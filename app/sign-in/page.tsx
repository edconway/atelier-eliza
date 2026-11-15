"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAtelier } from "@/lib/atelier-store";

export default function SignInPage() {
  const { member, signIn } = useAtelier();
  const router = useRouter();
  const [name, setName] = useState(member?.name ?? "");
  const [email, setEmail] = useState(member?.email ?? "");

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    signIn({ name: name.trim(), email: email.trim().toLowerCase() });
    router.push("/members");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <p className="text-xs uppercase tracking-[0.28em] text-gold-ink">
        Members
      </p>
      <h1 className="mt-4 font-heading text-4xl">Your account</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Charts and recordings are stored in this browser for now. A name and
        email label them as yours.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Enter the account
        </Button>
      </form>
      <button
        type="button"
        className="mt-4 text-sm text-gold-ink underline"
        onClick={() => {
          signIn({ name: "Guest", email: "guest@example.com" });
          router.push("/members");
        }}
      >
        Open as a guest
      </button>
      <p className="mt-8 text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/chart/new" className="text-gold-ink underline">
          Draw a chart
        </Link>{" "}
        first if you like.
      </p>
    </div>
  );
}
