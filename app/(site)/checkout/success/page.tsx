"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";

export default function SuccessPage() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen grid place-items-center" style={{ background: "var(--bg)" }}>
      <div className="max-w-md text-center flex flex-col items-center gap-8 px-8">
        {/* origami mark */}
        <svg width="48" height="48" viewBox="0 0 32 32" fill="none" stroke="#3C3A36" strokeWidth="1.2" aria-hidden="true">
          <path d="M16 3 L29 16 L16 29 L3 16 Z" />
          <path d="M16 3 L16 29 M3 16 L29 16 M8 8 L24 24 M8 24 L24 8" />
        </svg>

        <div>
          <div className="eyebrow justify-center mb-4">Order confirmed</div>
          <h1
            className="leading-[1.02] tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: 52 }}
          >
            Your light is<br />
            <em className="italic text-ink-soft">on its way.</em>
          </h1>
        </div>

        <p className="text-ink-soft leading-[1.7]">
          Thank you for your order. Your origami shade will arrive flat — ready to fold. A confirmation has been sent to your email.
        </p>

        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3.5 px-7 py-4 bg-ink text-bg-alt rounded-sm hover:bg-[#2a2925] transition-all"
            style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase" }}
          >
            Shop More →
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-3.5 px-7 py-4 border border-[rgba(60,58,54,0.12)] rounded-sm hover:border-ink transition-all"
            style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase" }}
          >
            Home
          </Link>
        </div>

        <div
          className="border-t pt-6 w-full"
          style={{ borderColor: "var(--line)", fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-soft)" }}
        >
          Ships flat · Folds in 45–90 min · Made in Kyoto
        </div>
      </div>
    </div>
  );
}
