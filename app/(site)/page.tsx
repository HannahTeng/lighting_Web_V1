import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/hero";
import Reveal from "@/components/reveal";
import Footer from "@/components/footer";
import { formatPrice } from "@/lib/products";
import { listProducts } from "@/lib/admin/products";
import { getHomeContent } from "@/lib/content";

/* ─── Category icons as inline SVGs ─── */
const CAT_ICONS = [
  { n: "01", count: "24", name: "Pendant\nLights", d: "M50 6 L50 32 M24 32 L50 32 L76 32 L82 58 L72 82 L28 82 L18 58 Z M50 32 L28 82 M50 32 L72 82 M18 58 L82 58" },
  { n: "02", count: "18", name: "Table\nLights",  d: "M30 40 L70 40 L78 66 L22 66 Z M40 66 L40 82 L60 82 L60 66 M36 82 L64 82 M30 40 L22 66 M70 40 L78 66 M50 40 L50 66" },
  { n: "03", count: "12", name: "Wall\nLights",   d: "M14 20 H24 V80 H14 Z M24 36 L66 36 L82 50 L66 64 L24 64 Z M24 36 L66 64 M24 64 L66 36 M44 36 L44 64" },
  { n: "04", count:  "9", name: "DIY\nKits",      d: "M16 18 H84 V82 H16 Z M16 18 L50 50 L84 18 M16 82 L50 50 L84 82 M16 50 L84 50" },
  { n: "05", count: "32", name: "Paper\nShades",  d: "M20 24 L80 24 L80 76 L60 84 L40 84 L20 76 Z M20 24 L40 84 M80 24 L60 84 M50 24 L50 84 M20 52 L80 52" },
  { n: "06", count: "14", name: "Accessories",    d: "M50 50 m-22 0 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0 m16 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M50 28 L50 18 M50 72 L50 82 M28 50 L18 50 M72 50 L82 50" },
];

export default async function HomePage() {
  const [content, products] = await Promise.all([getHomeContent(), listProducts()]);
  const featured =
    products.find((p) => p.slug === content.featured_slug) ?? products[0];
  return (
    <>
      {/* ── 01 HERO ── */}
      <Hero />

      {/* ── 02 CATALOG ── */}
      <section className="pb-20" id="catalog">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-14">
          <Reveal>
            <div className="grid gap-8 sm:gap-16 pt-16 sm:pt-[120px] pb-8 sm:pb-12 items-end grid-cols-1 sm:grid-cols-[1fr_2fr]">
              <div>
                <div className="eyebrow mb-5">{content.catalog_eyebrow}</div>
                <h2
                  className="leading-[0.98] tracking-[-0.02em]"
                  style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "clamp(44px,5.2vw,76px)" }}
                >
                  {content.catalog_heading} <em className="italic text-ink-soft">{content.catalog_heading_em}</em>
                </h2>
              </div>
              <p className="text-ink-soft text-[14.5px] leading-[1.7] max-w-[460px]">
                {content.catalog_intro}
              </p>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div
              className="grid gap-px grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
              style={{
                background: "var(--line)",
                borderTop: "1px solid var(--line)",
                borderBottom: "1px solid var(--line)",
              }}
            >
              {CAT_ICONS.map((c) => (
                <Link
                  key={c.n}
                  href="/shop"
                  className="group flex flex-col gap-8 sm:gap-[60px] min-h-[200px] sm:min-h-[340px] p-5 sm:p-7 bg-bg hover:bg-bg-alt transition-colors duration-300"
                >
                  <div className="flex justify-between items-start">
                    <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-soft)" }}>{c.n}</span>
                    <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink)", fontWeight: 500 }}>{c.count} items</span>
                  </div>
                  <div className="flex-1 grid place-items-center">
                    <svg viewBox="0 0 100 100" width={92} height={92} fill="none" stroke="currentColor" strokeWidth="0.9" opacity={0.85} aria-hidden="true">
                      {c.d.split(" M").map((seg, i) => (
                        <path key={i} d={(i === 0 ? "" : "M") + seg} />
                      ))}
                    </svg>
                  </div>
                  <div className="flex justify-between items-end">
                    <div style={{ fontFamily: "var(--font-cormorant)", fontSize: 20, letterSpacing: "-0.005em", lineHeight: 1.15, whiteSpace: "pre-line" }}>{c.name}</div>
                    <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: "var(--ink-soft)", letterSpacing: "0.12em" }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 03 FEATURED ── */}
      <section className="py-20" id="featured">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-14">
          <div className="grid gap-10 sm:gap-20 items-center grid-cols-1 sm:grid-cols-[1.1fr_1fr]">
            {/* image */}
            <Reveal>
              <div className="relative aspect-[4/5] rounded-[4px] border border-[rgba(60,58,54,0.12)] overflow-hidden bg-bg-alt">
                <Image
                  src={featured.image}
                  alt={featured.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 55vw"
                />
                <div
                  className="absolute bottom-4 left-4 flex gap-2.5 items-center uppercase"
                  style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: "var(--ink-soft)", letterSpacing: "0.14em" }}
                >
                  <span style={{ color: "var(--ink)" }}>FIG.</span>
                  001 — {featured.name}, Ash White
                </div>
              </div>
            </Reveal>

            {/* info */}
            <Reveal delay={1}>
              <div className="flex flex-col gap-7 pr-5">
                <div className="eyebrow">{content.featured_eyebrow}</div>
                <h3
                  className="leading-[1] tracking-[-0.02em]"
                  style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: 56 }}
                >
                  {featured.name.split(" ")[0]}
                  <br />
                  <em className="italic">{featured.name.split(" ").slice(1).join(" ")}</em>
                </h3>
                <p className="text-ink-soft leading-[1.7] max-w-[440px]">{featured.description}</p>

                {/* specs grid */}
                <div
                  className="grid gap-px"
                  style={{ gridTemplateColumns: "repeat(2,1fr)", background: "var(--line)", border: "1px solid var(--line)" }}
                >
                  {[
                    ["Diameter", featured.diameter],
                    ["Paper",    featured.paper],
                    ["Bulb",     featured.bulb],
                    ["Assembly", `${featured.assembly_time} · Level ${featured.assembly_level}`],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-bg px-4 py-4">
                      <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 4 }}>{k}</div>
                      <div style={{ fontFamily: "var(--font-cormorant)", fontSize: 20 }}>{v}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3.5 items-center">
                  <span style={{ fontFamily: "var(--font-cormorant)", fontSize: 32 }}>{formatPrice(featured.price_jpy)}</span>
                  <span
                    className="pl-3.5 border-l border-[rgba(60,58,54,0.12)]"
                    style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-soft)" }}
                  >
                    {content.featured_note}
                  </span>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Link
                    href={`/product/${featured.slug}`}
                    className="inline-flex items-center gap-3.5 px-7 py-4 bg-ink text-bg-alt rounded-sm hover:-translate-y-px hover:bg-[#2a2925] transition-all"
                    style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase" }}
                  >
                    View Details →
                  </Link>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-3.5 px-7 py-4 border border-[rgba(60,58,54,0.12)] rounded-sm hover:border-ink hover:bg-ink hover:text-bg-alt transition-all"
                    style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase" }}
                  >
                    Shop All
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 04 HOW IT FOLDS ── */}
      <section
        id="how-it-folds"
        className="py-20 border-t border-b"
        style={{ background: "var(--bg-alt)", borderColor: "var(--line-soft)" }}
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-14">
          <Reveal>
            <div className="grid gap-8 sm:gap-16 pt-0 pb-8 sm:pb-12 items-end grid-cols-1 sm:grid-cols-[1fr_2fr]">
              <div>
                <div className="eyebrow mb-5">{content.method_eyebrow}</div>
                <h2 className="leading-[0.98] tracking-[-0.02em]" style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "clamp(44px,5.2vw,76px)" }}>
                  {content.method_heading} <em className="italic text-ink-soft">{content.method_heading_em}</em>
                </h2>
              </div>
              <p className="text-ink-soft text-[14.5px] leading-[1.7] max-w-[460px]">
                {content.method_intro}
              </p>
            </div>
          </Reveal>

          <div className="grid gap-8 sm:gap-12 grid-cols-1 sm:grid-cols-3">
            {[
              {
                step: "01",
                svg: (
                  <svg viewBox="0 0 200 160" fill="none" aria-hidden="true">
                    <rect x="20" y="30" width="160" height="100" fill="#F4EADA" stroke="currentColor" strokeWidth="0.5"/>
                    <g stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 3" strokeLinecap="round">
                      <line x1="20" y1="80" x2="180" y2="80"/><line x1="100" y1="30" x2="100" y2="130"/>
                      <line x1="20" y1="30" x2="180" y2="130"/><line x1="180" y1="30" x2="20" y2="130"/>
                    </g>
                    <circle cx="100" cy="80" r="2" fill="currentColor"/>
                  </svg>
                ),
              },
              {
                step: "02",
                svg: (
                  <svg viewBox="0 0 200 160" fill="none" aria-hidden="true">
                    <g stroke="currentColor" strokeWidth="0.5">
                      <path d="M40 120 L70 40 L100 120 L130 40 L160 120 Z" fill="#F4EADA"/>
                      <path d="M40 120 L100 120 L70 40 Z" fill="#EADFC9"/>
                      <path d="M100 120 L160 120 L130 40 Z" fill="#EADFC9"/>
                      <line x1="55" y1="80" x2="115" y2="80" strokeDasharray="3 2"/>
                      <line x1="85" y1="80" x2="145" y2="80" strokeDasharray="3 2"/>
                    </g>
                  </svg>
                ),
              },
              {
                step: "03",
                svg: (
                  <svg viewBox="0 0 200 160" fill="none" aria-hidden="true">
                    <g stroke="currentColor" strokeWidth="0.5">
                      <ellipse cx="100" cy="90" rx="60" ry="38" fill="#F4EADA"/>
                      <path d="M100 52 L60 90 L100 128 L140 90 Z" fill="#EADFC9" opacity="0.8"/>
                      <line x1="100" y1="52" x2="100" y2="128"/>
                      <line x1="60" y1="90" x2="140" y2="90"/>
                      <line x1="72" y1="62" x2="128" y2="118"/>
                      <line x1="128" y1="62" x2="72" y2="118"/>
                      <line x1="100" y1="30" x2="100" y2="52" strokeWidth="0.3"/>
                    </g>
                  </svg>
                ),
              },
            ].map(({ step, svg }, i) => (
              <Reveal key={step} delay={i + 1}>
                <div className="flex flex-col gap-7">
                  <div
                    className="aspect-[5/4] bg-surface border border-[rgba(60,58,54,0.12)] rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] grid place-items-center overflow-hidden"
                  >
                    <div className="w-[72%] h-[72%]">{svg}</div>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-[rgba(60,58,54,0.12)] pb-2.5">
                    <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-soft)" }}>
                      Step {step}
                    </span>
                    <h4 style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: 30 }}>{content.method_steps[i]?.title}</h4>
                  </div>
                  <p className="text-ink-soft text-sm leading-[1.7]">{content.method_steps[i]?.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 09 FOUNDER STORY ── */}
      <section id="founder" className="py-[120px]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-14">
          <div className="grid gap-10 sm:gap-20 items-center grid-cols-1 sm:grid-cols-[1fr_1.1fr]">
            <Reveal>
              <div className="flex flex-col gap-6">
                <div className="eyebrow">{content.founder_eyebrow}</div>
                <h2
                  className="leading-[1.02] tracking-[-0.02em]"
                  style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "clamp(44px,5vw,72px)" }}
                >
                  {content.founder_heading}<br />
                  <em className="italic text-ink-soft">{content.founder_heading_em}</em>
                </h2>
                <p className="text-ink-soft leading-[1.7] max-w-[460px]">
                  {content.founder_para1}
                </p>
                <p className="text-ink-soft leading-[1.7] max-w-[460px]">
                  {content.founder_para2}
                </p>
                <a
                  href={content.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3.5 self-start px-7 py-4 border border-[rgba(60,58,54,0.12)] rounded-sm hover:border-ink hover:bg-ink hover:text-bg-alt transition-all"
                  style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.94a8.17 8.17 0 0 0 4.78 1.52V7.01a4.85 4.85 0 0 1-1.01-.32z"/>
                  </svg>
                  {content.tiktok_handle} →
                </a>

                {/* stats row */}
                <div className="grid grid-cols-3 gap-px mt-4" style={{ background: "var(--line)", border: "1px solid var(--line)" }}>
                  {content.founder_stats.map(({ num, label }) => (
                    <div key={label} className="bg-bg px-5 py-4">
                      <div style={{ fontFamily: "var(--font-cormorant)", fontSize: 32, lineHeight: 1 }}>{num}</div>
                      <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-soft)", marginTop: 4 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* TikTok embed card */}
            <Reveal delay={1}>
              <div
                className="relative rounded-[4px] overflow-hidden border border-[rgba(60,58,54,0.12)]"
                style={{ background: "var(--bg-alt)" }}
              >
                {/* faux phone mockup showing TikTok */}
                <div className="p-8 flex flex-col gap-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-ink grid place-items-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.94a8.17 8.17 0 0 0 4.78 1.52V7.01a4.85 4.85 0 0 1-1.01-.32z"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500 }}>{content.tiktok_handle}</div>
                      <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9.5, letterSpacing: "0.12em", color: "var(--ink-soft)", textTransform: "uppercase" }}>Orikami Studio · TikTok</div>
                    </div>
                  </div>

                  {/* video thumbnails grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {products.slice(0, 3).map((p, i) => (
                      <div
                        key={p.slug}
                        className="relative aspect-[9/16] rounded-sm overflow-hidden bg-bg"
                        style={{ border: "1px solid var(--line-soft)" }}
                      >
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-cover opacity-80"
                          sizes="120px"
                        />
                        <div className="absolute inset-0 flex items-end p-1.5">
                          <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 7, letterSpacing: "0.1em", color: "white", textTransform: "uppercase", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
                            {`Fold 00${i + 1}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center border-t border-[rgba(60,58,54,0.12)] pt-4">
                    <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-soft)" }}>
                      Process · Behind the fold
                    </span>
                    <a
                      href={content.tiktok_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink)" }}
                      className="hover:opacity-70 transition-opacity"
                    >
                      Follow →
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
