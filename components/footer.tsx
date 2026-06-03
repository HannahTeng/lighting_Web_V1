export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`pt-20 pb-10 ${className}`}
      style={{ background: "var(--ink)", color: "#D7D2CA" }}
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-14">
        <div className="grid gap-8 sm:gap-12 pb-16 border-b border-white/[0.08] grid-cols-1 sm:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-6">
            <div style={{ fontFamily: "var(--font-cormorant)", fontSize: 32, color: "#EFE9E0" }}>Orikami Studio</div>
            <p style={{ color: "#A59E94", fontSize: 14, lineHeight: 1.65, maxWidth: 340 }}>
              Sculptural paper lighting. Designed in Kyoto, assembled in Copenhagen, folded last by you.
            </p>
            <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#A59E94" }}>
              orikami.studio · est. 2021
            </div>
          </div>
          {[
            { title: "Shop",    links: ["Pendants","Tables","Wall","DIY Kits","Paper Shades","Accessories"] },
            { title: "Studio",  links: ["Journal","Materials","Atelier visits","Trade program","Press kit"] },
            { title: "Support", links: ["Assembly guides","Shipping & returns","Care & repair","Contact","FAQ"] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h5 style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#EFE9E0", fontWeight: 500, marginBottom: 18 }}>
                {title}
              </h5>
              {links.map((l) => (
                <a
                  key={l}
                  href="#"
                  className="block py-1.5 text-[13.5px] transition-colors hover:text-[#EFE9E0]"
                  style={{ color: "#A59E94" }}
                >
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div
          className="pt-7 flex flex-wrap gap-y-2 justify-between"
          style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7B756C" }}
        >
          <span>© 2026 Orikami Studio</span>
          <span>京都 · København</span>
          <span>Designed to arrive flat.</span>
        </div>
      </div>
    </footer>
  );
}
