"use client";

import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { useState } from "react";

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add({
      slug: product.slug,
      name: product.name,
      price_jpy: product.price_jpy,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button
      onClick={handleAdd}
      className="flex items-center justify-center gap-4 w-full py-4 bg-ink text-bg-alt font-mono text-[10.5px] tracking-[0.2em] uppercase rounded-sm hover:bg-[#2a2925] transition-all hover:-translate-y-px active:translate-y-0"
    >
      {added ? "Added ✓" : `Add to Cart · ${formatPrice(product.price_jpy)}`}
      {!added && <span className="inline-block transition-transform group-hover:translate-x-1">→</span>}
    </button>
  );
}
