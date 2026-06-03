import type { Metadata } from "next";
import ProductCard from "@/components/product-card";
import Reveal from "@/components/reveal";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop — Orikami Studio",
  description: "Browse all Orikami origami lighting — pendants, table lights, and DIY kits.",
};

export default function ShopPage() {
  return (
    <div className="pt-[52px]" style={{ background: "var(--bg-alt)" }}>
      <div className="max-w-[1440px] mx-auto px-14">
        {/* header */}
        <div
          className="flex justify-between items-end py-8 border-b"
          style={{ borderColor: "var(--line)" }}
        >
          <div>
            <div className="eyebrow mb-3.5">07 — Shop · All Lights</div>
            <h1
              className="leading-[1] tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: 56 }}
            >
              Pendants &amp; <em className="italic text-ink-soft">Suspension.</em>
            </h1>
          </div>
          <div className="text-right">
            <div
              style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 6 }}
            >
              {PRODUCTS.length} items
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
            className="grid gap-y-8 gap-x-6"
            style={{ gridTemplateColumns: "repeat(3,1fr)" }}
          >
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) + 1}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* footer strip */}
      <footer style={{ background: "var(--ink)", color: "#D7D2CA" }} className="pt-20 pb-10">
        <div className="max-w-[1440px] mx-auto px-14">
          <div className="grid gap-12 pb-16 border-b border-white/[0.08]" style={{ gridTemplateColumns: "1.3fr repeat(3,1fr)" }}>
            <div className="flex flex-col gap-6">
              <div style={{ fontFamily: "var(--font-cormorant)", fontSize: 32, color: "#EFE9E0" }}>Orikami Studio</div>
              <p style={{ color: "#A59E94", fontSize: 14, lineHeight: 1.65, maxWidth: 340 }}>
                Sculptural paper lighting. Designed in Kyoto, assembled in Copenhagen, folded last by you.
              </p>
            </div>
            {[
              { title: "Shop",    links: ["Pendants","Tables","Wall","DIY Kits"] },
              { title: "Studio",  links: ["Journal","Materials","Atelier visits"] },
              { title: "Support", links: ["Assembly guides","Shipping & returns","Contact"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h5 style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#EFE9E0", fontWeight: 500, marginBottom: 18 }}>{title}</h5>
                {links.map((l) => (
                  <a key={l} href="#" className="block py-1.5 text-[13.5px]" style={{ color: "#A59E94" }}>{l}</a>
                ))}
              </div>
            ))}
          </div>
          <div className="pt-7 flex justify-between" style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7B756C" }}>
            <span>© 2026 Orikami Studio</span><span>京都 · København</span><span>Designed to arrive flat.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
