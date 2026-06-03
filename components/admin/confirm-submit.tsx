"use client";

import { btnDanger } from "./ui";

/**
 * A submit button that asks for confirmation before allowing the parent
 * <form> (bound to a server action) to submit. Used for destructive actions.
 */
export default function ConfirmSubmit({
  children,
  message = "Are you sure?",
  className,
}: {
  children: React.ReactNode;
  message?: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={className ?? btnDanger}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
