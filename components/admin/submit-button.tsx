"use client";

import { useFormStatus } from "react-dom";
import { btnPrimary } from "./ui";

export default function SubmitButton({
  children,
  pendingLabel = "Saving…",
  className,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className ?? btnPrimary}>
      {pending ? pendingLabel : children}
    </button>
  );
}
