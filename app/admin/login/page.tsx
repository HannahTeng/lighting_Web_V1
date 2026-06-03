"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/_actions/auth";
import { Field, Input, btnPrimary } from "@/components/admin/ui";

const INITIAL: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, INITIAL);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6 text-ink">
      <form
        action={formAction}
        className="w-full max-w-sm bg-surface border border-line rounded-md p-8"
      >
        <div className="flex items-center gap-2.5 mb-6">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none" stroke="#3C3A36" strokeWidth="1.2">
            <path d="M16 3 L29 16 L16 29 L3 16 Z" />
            <path d="M16 3 L16 29 M3 16 L29 16 M8 8 L24 24 M8 24 L24 8" />
          </svg>
          <div className="leading-none">
            <div className="font-serif text-[20px]">Orikami</div>
            <div className="font-mono text-[8.5px] tracking-[0.2em] text-stone uppercase mt-0.5">
              Admin
            </div>
          </div>
        </div>

        <h1 className="font-serif text-[26px] leading-none mb-1">Sign in</h1>
        <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-ink-soft mb-6">
          Enter the admin password
        </p>

        <Field label="Password">
          <Input name="password" type="password" autoFocus required />
        </Field>

        {state?.error && (
          <p className="mt-3 font-mono text-[10.5px] text-red-700">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className={`${btnPrimary} w-full mt-6`}
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
