import type { Metadata } from "next";
import ProductCard from "@/components/product-card";
import Reveal from "@/components/reveal";
import Footer from "@/components/footer";
import { listProducts } from "@/lib/admin/products";

export const metadata: Metadata = {
  title: "Shop — Orikami Studio",
  description: "Browse all Orikami origami lighting — pendants, table lights, and DIY kits.",
};

export default async function ShopPage() {
  const products = await listProducts();
  return (
    <div className="pt-[52px]" style={{ background: "var(--bg-alt)" }}>
      <div className="max-w-[1440px] mx-auto px-5 sm:px-14">
        {/* header */}
        <div
          className="flex flex-col gap-3 sm:flex-row sm:gap-0 sm:justify-between sm:items-end py-8 border-b"
          style={{ borderColor: "var(--line)" }}
        >
          <div>
            <div className="eyebrow mb-3.5">07 — Shop · All Lights</div>
            <h1
              className="leading-[1] tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "clamp(28px,5.5vw,56px)" }}
            >
              Pendants &amp; <em className="italic text-ink-soft">Suspension.</em>
            </h1>
          </div>
          <div className="text-right">
            <div
              style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 6 }}
            >
              {products.length} items
            </div>
            <div
              style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink)", fontWeight: 500 }}
            >
              Sort · Newest ↓
            </div>
          </div>
        </div>

        {/* grid */}
        <div className="py-10 pb-24">
          <div
            className="grid gap-y-8 gap-x-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {products.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) + 1}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
