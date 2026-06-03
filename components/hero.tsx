"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const paperGroupRef = useRef<SVGGElement>(null);
  const creasesRef = useRef<SVGGElement>(null);
  const glowDiscRef = useRef<SVGCircleElement>(null);
  const cordRef = useRef<SVGLineElement>(null);
  const progFillRef = useRef<HTMLDivElement>(null);
  const scrollPctRef = useRef<HTMLDivElement>(null);
  const scrollLabelRef = useRef<HTMLDivElement>(null);
  const heroStageRef = useRef<HTMLDivElement>(null);
  const heroWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pg = paperGroupRef.current;
    const cr = creasesRef.current;
    const gd = glowDiscRef.current;
    const cord = cordRef.current;
    const pf = progFillRef.current;
    const sp = scrollPctRef.current;
    const sl = scrollLabelRef.current;
    const hs = heroStageRef.current;
    const hw = heroWrapRef.current;
    if (!pg || !cr || !gd || !cord || !pf || !sp || !sl || !hs || !hw) return;

    const NS = "http://www.w3.org/2000/svg";
    const N = 12;
    const petals: SVGPathElement[] = [];
    const creaseLines: SVGLineElement[] = [];

    for (let i = 0; i < N; i++) {
      const p = document.createElementNS(NS, "path");
      p.setAttribute("stroke", "#3C3A36");
      p.setAttribute("stroke-width", "0.35");
      p.setAttribute("stroke-linejoin", "round");
      pg.appendChild(p);
      petals.push(p);

      const l = document.createElementNS(NS, "line");
      l.setAttribute("stroke-dasharray", "120");
      l.setAttribute("stroke-dashoffset", "120");
      cr.appendChild(l);
      creaseLines.push(l);
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (t: number, a = 0, b = 1) => Math.max(a, Math.min(b, t));
    const ease = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    function render(progress: number) {
      const p = clamp(progress);
      const pleat = clamp((p - 0.18) / 0.42);
      const close = clamp((p - 0.55) / 0.3);
      const glow  = clamp((p - 0.78) / 0.22);

      const R     = lerp(75, 58, ease(close));
      const rimY  = lerp(0, 34, ease(close));
      const apexY = lerp(0, -46, ease(close));
      const pleatAmp = lerp(0, 14, ease(pleat));
      const faceFill   = `hsl(38,${lerp(28, 30, ease(pleat))}%,${lerp(86, 80, ease(close))}%)`;
      const shadowFill = `hsl(34,24%,${lerp(78, 68, ease(close))}%)`;

      cord!.setAttribute("opacity", ease(close).toFixed(2));
      cord!.setAttribute("y2", String(apexY));

      for (let i = 0; i < N; i++) {
        const a0   = (i / N) * Math.PI * 2 - Math.PI / 2;
        const a1   = ((i + 1) / N) * Math.PI * 2 - Math.PI / 2;
        const aMid = (a0 + a1) / 2;
        const rx0  = Math.cos(a0) * R, ry0 = Math.sin(a0) * R + rimY * 0.3;
        const rx1  = Math.cos(a1) * R, ry1 = Math.sin(a1) * R + rimY * 0.3;
        const rmR  = R - pleatAmp;
        const rmx  = Math.cos(aMid) * rmR;
        const rmy  = Math.sin(aMid) * rmR + rimY * 0.3;

        petals[i].setAttribute(
          "d",
          `M0,${apexY} L${rx0.toFixed(2)},${ry0.toFixed(2)} L${rmx.toFixed(2)},${rmy.toFixed(2)} L${rx1.toFixed(2)},${ry1.toFixed(2)} Z`
        );
        petals[i].setAttribute("fill", i % 2 === 0 ? faceFill : shadowFill);

        const cl = creaseLines[i];
        cl.setAttribute("x1", "0"); cl.setAttribute("y1", String(apexY));
        cl.setAttribute("x2", rmx.toFixed(2)); cl.setAttribute("y2", rmy.toFixed(2));
        cl.setAttribute("stroke-dashoffset", lerp(120, 0, clamp((p - 0.05) / 0.35)).toFixed(1));
        cl.setAttribute("opacity", (0.35 + 0.25 * ease(close)).toFixed(2));
      }

      gd!.setAttribute("opacity", (ease(glow) * 0.9).toFixed(2));
      const glowStops = gd!.closest("svg")?.querySelectorAll("#paperGlow stop");
      if (glowStops?.length) {
        glowStops[0].setAttribute("stop-opacity", (ease(glow) * 0.9).toFixed(2));
        glowStops[1].setAttribute("stop-opacity", (ease(glow) * 0.5).toFixed(2));
        glowStops[2].setAttribute("stop-opacity", "0");
      }
      hs!.style.background = `linear-gradient(180deg,#F5F0EB 0%,${glow > 0.3 ? "#EBDFCC" : "#EFE8E0"} 100%)`;
      pf!.style.transform = `scaleY(${p})`;
      sp!.textContent = String(Math.round(p * 100)).padStart(3, "0") + " / 100";
      sl!.textContent = p < 0.15 ? "Flat sheet" : p < 0.6 ? "Folding pleats" : p < 0.85 ? "Closing dome" : "Switched on";
    }

    function update() {
      const rect  = hw!.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      render(Math.max(0, Math.min(1, -rect.top / total)));
    }

    let raf = false;
    const onScroll = () => {
      if (raf) return;
      raf = true;
      requestAnimationFrame(() => { update(); raf = false; });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    render(0); update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={heroWrapRef} style={{ height: "500vh" }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          ref={heroStageRef}
          className="absolute inset-0 grid place-items-center"
          style={{ background: "linear-gradient(180deg,#F5F0EB 0%,#EFE8E0 100%)" }}
        >
          {/* SVG fold */}
          <div style={{ width: "min(78vmin,720px)", aspectRatio: "1" }} className="relative">
            <svg viewBox="-100 -100 200 200" className="w-full h-full overflow-visible" aria-hidden="true">
              <defs>
                <radialGradient id="paperGlow" cx="0.5" cy="0.5" r="0.6">
                  <stop offset="0%" stopColor="#FFE6B8" stopOpacity="0" />
                  <stop offset="60%" stopColor="#FFD18C" stopOpacity="0" />
                  <stop offset="100%" stopColor="#FFB063" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle ref={glowDiscRef} cx="0" cy="0" r="90" fill="url(#paperGlow)" opacity="0" />
              <line ref={cordRef} x1="0" y1="-140" x2="0" y2="-60" stroke="#6B655E" strokeWidth="0.6" opacity="0" />
              <g ref={paperGroupRef} />
              <g ref={creasesRef} stroke="#3C3A36" strokeWidth="0.3" strokeLinecap="round" fill="none" opacity="0.35" />
            </svg>
          </div>
        </div>

        {/* overlay text */}
        <div className="absolute inset-0 pointer-events-none grid" style={{ gridTemplateRows: "auto 1fr auto" }}>
          <div className="flex justify-between px-5 sm:px-14 pt-[60px] sm:pt-[88px] text-ink-soft">
            <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Folded Light Collection · 2026
            </span>
            <span className="hidden sm:block" style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Vol. 04 — Spring Index
            </span>
          </div>

          <div className="self-end px-5 sm:px-14 pb-1">
            <div className="eyebrow mb-4 sm:mb-7">Orikami Studio · Kyoto · Copenhagen</div>
            <h1
              className="leading-[0.92] tracking-[-0.025em] text-ink"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontWeight: 300,
                fontSize: "clamp(48px,11vw,168px)",
              }}
            >
              Folded
              <br />
              <em style={{ fontStyle: "italic", color: "var(--ink-soft)" }}>Light.</em>
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 px-5 sm:px-14 pb-10 sm:pb-14 items-end gap-6 sm:gap-14">
            <p className="hidden sm:block text-ink-soft text-sm leading-[1.65] max-w-xs">
              Sculptural paper lighting, shipped flat, folded by you. Designed in Kyoto. Finished by hand.
            </p>
            <div className="flex flex-col gap-2.5 items-center">
              <div ref={scrollPctRef} style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-soft)" }}>
                000 / 100
              </div>
              <div className="w-px h-12 bg-[rgba(60,58,54,0.12)] relative overflow-hidden">
                <div
                  ref={progFillRef}
                  className="absolute inset-x-0 top-0 bottom-0 bg-ink origin-top"
                  style={{ transform: "scaleY(0)" }}
                />
              </div>
              <div ref={scrollLabelRef} style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-soft)" }}>
                Scroll to fold
              </div>
            </div>
            <div className="hidden sm:block justify-self-end text-right">
              <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-soft)" }}>
                Chapter 01
              </div>
              <div
                className="mt-1.5"
                style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: 38, lineHeight: 1 }}
              >
                A sheet becomes a shade.
              </div>
            </div>
          </div>
        </div>

        {/* scroll hint */}
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none"
          style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink-soft)" }}
        >
          <span className="w-5 h-px bg-[var(--ink-soft)] animate-[drift_2.4s_ease-in-out_infinite]" />
          Scroll
          <span className="w-5 h-px bg-[var(--ink-soft)] animate-[drift_2.4s_ease-in-out_infinite]" />
        </div>
      </div>

      <style>{`
        @keyframes drift {
          0%,100% { transform:translateX(0); opacity:.5 }
          50%      { transform:translateX(6px); opacity:1 }
        }
      `}</style>
    </div>
  );
}
