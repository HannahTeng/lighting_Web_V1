/**
 * Display helpers for the admin UI.
 *
 * NOTE: price/total columns are named `*_jpy` for historical reasons but
 * actually store USD cents (e.g. 3999 = $39.99). We format them as USD.
 */

export function usd(cents: number | null | undefined): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format((cents ?? 0) / 100);
}

export function centsToDollars(cents: number | null | undefined): string {
  return ((cents ?? 0) / 100).toFixed(2);
}

export function dateShort(d: string | Date | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function dateTime(d: string | Date | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Slugify a title into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ── FormData helpers (shared by server actions) ─────────── */

export function str(fd: FormData, k: string): string {
  return String(fd.get(k) ?? "").trim();
}

export function int(fd: FormData, k: string): number {
  const n = parseInt(String(fd.get(k) ?? ""), 10);
  return Number.isFinite(n) ? n : 0;
}
