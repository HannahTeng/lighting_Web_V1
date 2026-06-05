import { cache } from "react";
import { getDb } from "@/lib/db";

export type Settings = {
  store_name: string;
  currency: string;
  support_email: string;
  footer_tagline: string;
  footer_meta: string;
  footer_location: string;
  footer_note: string;
};

export const DEFAULT_SETTINGS: Settings = {
  store_name: "Orikami Studio",
  currency: "USD",
  support_email: "",
  footer_tagline:
    "Sculptural paper lighting. Designed in Kyoto, assembled in Copenhagen, folded last by you.",
  footer_meta: "orikami.studio · est. 2021",
  footer_location: "京都 · København",
  footer_note: "Designed to arrive flat.",
};

/** Memoized per request — Footer and pages share one query. */
export const getSettings = cache(async (): Promise<Settings> => {
  const sql = getDb();
  if (!sql) return { ...DEFAULT_SETTINGS };
  const rows = await sql`SELECT key, value FROM settings`;
  const map: Settings = { ...DEFAULT_SETTINGS };
  for (const r of rows as unknown as { key: string; value: string }[]) {
    // The settings table also holds JSON blobs (e.g. home_content);
    // this guard keeps them out of the scalar settings map.
    if (r.key in map) (map as Record<string, string>)[r.key] = r.value;
  }
  return map;
});

/** Upsert key/value pairs in a single round-trip. */
export async function setSettings(entries: [string, string][]): Promise<void> {
  const sql = getDb();
  if (!sql) throw new Error("Database not configured");
  const keys = entries.map(([k]) => k);
  const values = entries.map(([, v]) => v);
  await sql`
    INSERT INTO settings (key, value)
    SELECT * FROM unnest(${keys}::text[], ${values}::text[])
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `;
}
