import { cache } from "react";
import { getDb } from "@/lib/db";

/** Editable homepage copy. Headings are split into a plain part and an
 *  italic tail (`heading` + `heading_em`) to preserve the editorial style. */
export type HomeContent = {
  featured_slug: string;
  catalog_eyebrow: string;
  catalog_heading: string;
  catalog_heading_em: string;
  catalog_intro: string;
  featured_eyebrow: string;
  featured_note: string;
  method_eyebrow: string;
  method_heading: string;
  method_heading_em: string;
  method_intro: string;
  method_steps: { title: string; body: string }[];
  founder_eyebrow: string;
  founder_heading: string;
  founder_heading_em: string;
  founder_para1: string;
  founder_para2: string;
  tiktok_handle: string;
  tiktok_url: string;
  founder_stats: { num: string; label: string }[];
};

/** Mirrors the copy previously hardcoded in app/(site)/page.tsx — the
 *  storefront and admin agree on this when the settings key is absent. */
export const DEFAULT_HOME_CONTENT: HomeContent = {
  featured_slug: "kirigami-pendant-60",
  catalog_eyebrow: "02 — The Catalog",
  catalog_heading: "Browse by",
  catalog_heading_em: "form.",
  catalog_intro:
    "Six families, one material sensibility. Each shade is flat-packed and folded by the owner — a last step by hand before it takes its place in the room.",
  featured_eyebrow: "03 — Featured · New Season",
  featured_note: "Ships flat · 1–2 weeks",
  method_eyebrow: "04 — The Method",
  method_heading: "How it",
  method_heading_em: "folds.",
  method_intro:
    "Every lamp arrives as a flat, scored sheet. Three moves — a valley, a mountain, a seam — turn it into volume. No glue. No tools. No rush.",
  method_steps: [
    {
      title: "Score.",
      body: "Unroll the sheet and line up the valley creases. Each is pre-scored, so the paper knows where to bend. Trace them with a bone folder to deepen the memory.",
    },
    {
      title: "Fold.",
      body: "Alternate mountain and valley along each rib. The flat sheet rises into a pleated tower. Work slowly — the paper remembers speed.",
    },
    {
      title: "Close.",
      body: "Seat the brass collar into the apex, thread the cord, and let the bottom relax open. Hang it — and the shade finds its own silhouette.",
    },
  ],
  founder_eyebrow: "Studio · The Maker",
  founder_heading: "Paper is the",
  founder_heading_em: "first material.",
  founder_para1:
    "Jasen Zhang has been folding paper since childhood — first cranes, then tessellations, then light. Every Orikami shade begins as a single square, scored by hand, shaped over weeks of iteration. No software. No CNC. Just paper, patience, and a bone folder.",
  founder_para2:
    "Follow the studio's process on TikTok — from flat sheet to finished shade, every fold documented.",
  tiktok_handle: "@jasenzhangorigami",
  tiktok_url: "https://www.tiktok.com/@jasenzhangorigami",
  founder_stats: [
    { num: "12+", label: "Years folding" },
    { num: "200+", label: "Unique patterns" },
    { num: "3", label: "Papers, sourced in Japan" },
  ],
};

export const HOME_CONTENT_KEY = "home_content";

/** Stored JSON merged over defaults, so missing keys never break the page.
 *  Memoized per request. */
export const getHomeContent = cache(async (): Promise<HomeContent> => {
  const sql = getDb();
  if (!sql) return { ...DEFAULT_HOME_CONTENT };
  const rows = await sql`SELECT value FROM settings WHERE key = ${HOME_CONTENT_KEY} LIMIT 1`;
  const raw = (rows[0] as { value: string } | undefined)?.value;
  if (!raw) return { ...DEFAULT_HOME_CONTENT };
  try {
    return { ...DEFAULT_HOME_CONTENT, ...(JSON.parse(raw) as Partial<HomeContent>) };
  } catch {
    return { ...DEFAULT_HOME_CONTENT };
  }
});
