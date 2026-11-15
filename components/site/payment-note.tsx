"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function PaymentNote() {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-md">
      <Button
        type="button"
        variant="outline"
        className="rounded-full px-6"
        onClick={() => setOpen((value) => !value)}
      >
        Payment
      </Button>
      {open ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Eliza sends payment details after she confirms the consultation. She
          can take a bank transfer or a card payment.
        </p>
      ) : null}
    </div>
  );
}
