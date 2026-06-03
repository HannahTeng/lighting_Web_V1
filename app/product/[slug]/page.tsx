import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, getProduct, formatPrice } from "@/lib/products";
import Reveal from "@/components/reveal";
import AddToCart from "@/components/add-to-cart";
import ProductCard from "@/components/product-card";
import Footer from "@/components/footer";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} — Orikami Studio`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = PRODUCTS.filter((p) => p.slug !== product.slug);

  return (
    <div className="pt-[52px]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-14 py-10 sm:py-16">

        {/* breadcrumb */}
        <nav
          className="flex gap-2.5 items-center mb-7"
          style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-soft)" }}
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="opacity-40">/</span>
          <Link href="/shop" className="hover:text-ink transition-colors">Shop</Link>
          <span className="opacity-40">/</span>
          <span style={{ color: "var(--ink)" }}>{product.name}</span>
        </nav>

        {/* main grid */}
        <div className="grid gap-10 sm:gap-16 items-start grid-cols-1 sm:grid-cols-[1.25fr_1fr]">

          {/* gallery */}
          <Reveal>
            <div className="relative aspect-[4/5] rounded-[4px] border border-[rgba(60,58,54,0.12)] overflow-hidden bg-bg-alt shadow-[0_1px_3px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.04)]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width:768px) 100vw, 60vw"
              />
              <div
                className="absolute bottom-4 left-4"
                style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-soft)" }}
              >
                FIG. 001 · {product.name}
              </div>
              <div
                className="absolute bottom-4 right-4"
                style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.14em", color: "var(--ink-soft)" }}
              >
                01 / 01
              </div>
            </div>
          </Reveal>

          {/* product info — sticky */}
          <Reveal delay={1}>
            <div className="sm:sticky sm:top-[80px] flex flex-col gap-6">
              {/* head */}
              <div>
                <div
                  className="mb-3.5"
                  style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-soft)" }}
                >
                  {product.category} · Folded Light Collection
                </div>
                <h1
                  className="leading-[1] tracking-[-0.015em]"
                  style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "clamp(28px,4.5vw,48px)" }}
                >
                  {product.name.split(" ").slice(0, -1).join(" ")}
                  <br />
                  <em className="italic">{product.name.split(" ").at(-1)}.</em>
                </h1>
                <div className="flex justify-between items-baseline pt-2.5">
                  <span style={{ fontFamily: "var(--font-cormorant)", fontSize: 28 }}>{formatPrice(product.price_cents)}</span>
                  <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-soft)" }}>
                    SKU · {product.slug.toUpperCase().slice(0, 12)}
                  </span>
                </div>
              </div>

              {/* description */}
              <p
                className="leading-[1.7] border-t border-b py-3"
                style={{ color: "var(--ink-soft)", fontSize: 14.5, borderColor: "var(--line)" }}
              >
                {product.description}
              </p>

              {/* assembly indicator */}
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-baseline">
                  <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" }}>Assembly Level</span>
                  <span style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: 15, color: "var(--ink-soft)" }}>
                    {product.assembly_time}
                  </span>
                </div>
                <div className="flex gap-1 items-center">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="flex-1 h-0.5 rounded-sm transition-colors"
                      style={{ background: n <= product.assembly_level ? "var(--ink)" : "var(--line)" }}
                    />
                  ))}
                </div>
                <div
                  style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-soft)" }}
                >
                  Scored creases · Brass collar · Pre-wired canopy
                </div>
              </div>

              {/* CTA */}
              <AddToCart product={product} />

              {/* specs */}
              <div
                className="grid gap-px mt-2"
                style={{ gridTemplateColumns: "repeat(2,1fr)", background: "var(--line)", border: "1px solid var(--line)" }}
              >
                {[
                  ["Diameter", product.diameter],
                  ["Height",   product.height],
                  ["Paper",    product.paper],
                  ["Bulb",     product.bulb],
                  ["Cord",     product.cord],
                  ["Weight",   product.weight],
                ].map(([k, v]) => (
                  <div key={k} className="bg-bg px-4 py-3.5">
                    <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 3 }}>{k}</div>
                    <div style={{ fontFamily: "var(--font-cormorant)", fontSize: 17 }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* downloads */}
              <div>
                <div
                  className="mb-1"
                  style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500 }}
                >
                  Downloads
                </div>
                <div
                  className="flex flex-col gap-px"
                  style={{ background: "var(--line)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
                >
                  {[
                    ["Assembly instructions", "PDF · 2.4 MB ↓"],
                    ["Technical drawing",     "PDF · 860 KB ↓"],
                    ["Material datasheet",    "PDF · 1.1 MB ↓"],
                  ].map(([name, meta]) => (
                    <div
                      key={name}
                      className="flex justify-between items-center px-4 py-3.5 bg-bg hover:bg-bg-alt transition-colors cursor-pointer"
                    >
                      <span style={{ fontFamily: "var(--font-cormorant)", fontSize: 17 }}>{name}</span>
                      <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-soft)" }}>{meta}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── RELATED ── */}
        <div className="mt-24 pt-16 border-t border-[rgba(60,58,54,0.06)]">
          <div className="grid gap-8 sm:gap-16 items-end mb-10 grid-cols-1 sm:grid-cols-[1fr_2fr]">
            <div>
              <div className="eyebrow mb-5">08 — Related</div>
              <h2
                className="leading-[0.98] tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: 44 }}
              >
                Quiet <em className="italic text-ink-soft">neighbours.</em>
              </h2>
            </div>
            <p className="text-ink-soft text-[14.5px] leading-[1.7] max-w-[460px]">
              More lamps from the same family — folded from the same paper, glowing at the same temperature.
            </p>
          </div>

          <div className="grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i + 1}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <Footer className="mt-16" />
    </div>
  );
}
