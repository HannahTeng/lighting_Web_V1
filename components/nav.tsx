"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import CartDrawer from "./cart-drawer";

export default function Nav() {
  const { count } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-[14px] bg-[rgba(245,240,235,0.72)] border-b border-[rgba(60,58,54,0.06)]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-14 h-[52px] grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8">
          {/* brand */}
          <Link href="/" className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M16 3 L29 16 L16 29 L3 16 Z" />
              <path d="M16 3 L16 29 M3 16 L29 16 M8 8 L24 24 M8 24 L24 8" />
            </svg>
            <div>
              <div className="font-serif text-[19px] tracking-[0.01em] leading-none">Orikami</div>
              <div className="font-mono text-[9.5px] tracking-[0.2em] text-ink-soft uppercase">Studio · Kyoto</div>
            </div>
          </Link>

          {/* links */}
          <div className="hidden md:flex gap-7">
            {[
              { href: "/shop", label: "Shop" },
              { href: "/#how-it-folds", label: "How it folds" },
              { href: "/#founder", label: "Studio" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-ink relative group"
              >
                {label}
                <span className="absolute inset-x-0 bottom-0 h-px bg-ink scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>

          {/* cart */}
          <div className="justify-self-end flex gap-5 items-center">
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.16em] uppercase"
            >
              <span className="w-[5px] h-[5px] rounded-full bg-ink" />
              Cart {count > 0 && `· ${count}`}
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
