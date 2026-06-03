"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, remove, setQty, total, count } = useCart();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  async function checkout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, couponCode: couponCode.trim() || undefined }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout coming soon — payments will be live shortly.");
      }
    } catch {
      alert("Checkout coming soon — payments will be live shortly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* overlay */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-ink/20 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* drawer */}
      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-[420px] z-50 bg-bg flex flex-col shadow-xl transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart"
      >
        {/* header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[rgba(60,58,54,0.12)]">
          <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-ink">
            Cart · {count} {count === 1 ? "item" : "items"}
          </span>
          <button onClick={onClose} className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-soft hover:text-ink transition-colors">
            Close ×
          </button>
        </div>

        {/* items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {items.length === 0 ? (
            <p className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-ink-soft text-center pt-16">
              Your cart is empty.
            </p>
          ) : (
            items.map((item) => (
              <div key={item.slug} className="flex gap-4 items-start">
                <div className="relative w-20 h-20 flex-shrink-0 rounded bg-bg-alt border border-[rgba(60,58,54,0.12)] overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-[17px] leading-tight">{item.name}</div>
                  <div className="font-mono text-[10px] tracking-[0.12em] text-ink-soft uppercase mt-0.5">
                    {formatPrice(item.price_jpy)}
                  </div>
                  <div className="flex items-center gap-3 mt-2.5">
                    <div className="flex items-center border border-[rgba(60,58,54,0.12)] rounded-sm">
                      <button
                        onClick={() => setQty(item.slug, item.quantity - 1)}
                        className="w-11 h-11 font-mono text-sm hover:bg-bg-alt transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-mono text-xs">{item.quantity}</span>
                      <button
                        onClick={() => setQty(item.slug, item.quantity + 1)}
                        className="w-11 h-11 font-mono text-sm hover:bg-bg-alt transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => remove(item.slug)}
                      className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-ink-soft hover:text-ink transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="font-serif text-[17px] shrink-0">
                  {formatPrice(item.price_jpy * item.quantity)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* footer */}
        {items.length > 0 && (
          <div className="px-8 py-6 border-t border-[rgba(60,58,54,0.12)] space-y-4">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Discount code"
              className="w-full px-3 py-2.5 rounded-sm bg-bg-alt border border-[rgba(60,58,54,0.12)] font-mono text-[11px] tracking-[0.12em] uppercase text-ink outline-none focus:border-ink/40 transition-colors placeholder:text-stone"
            />
            <div className="flex justify-between items-baseline">
              <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-ink-soft">Total</span>
              <span className="font-serif text-[28px]">{formatPrice(total)}</span>
            </div>
            <button
              onClick={checkout}
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 py-4 bg-ink text-bg-alt font-mono text-[10.5px] tracking-[0.2em] uppercase rounded-sm hover:bg-[#2a2925] transition-colors disabled:opacity-50"
            >
              {loading ? "Redirecting…" : "Checkout via Stripe →"}
            </button>
            <p className="font-mono text-[9.5px] tracking-[0.12em] text-ink-soft text-center">
              Secure checkout · Stripe · JPY
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
