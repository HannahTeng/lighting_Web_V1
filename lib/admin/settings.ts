import { getDb } from "@/lib/db";

export type Settings = {
  store_name: string;
  currency: string;
  support_email: string;
};

export const DEFAULT_SETTINGS: Settings = {
  store_name: "Orikami Studio",
  currency: "USD",
  support_email: "",
};

export async function getSettings(): Promise<Settings> {
  const sql = getDb();
  if (!sql) return { ...DEFAULT_SETTINGS };
  const rows = await sql`SELECT key, value FROM settings`;
  const map: Settings = { ...DEFAULT_SETTINGS };
  for (const r of rows as unknown as { key: string; value: string }[]) {
    if (r.key in map) (map as Record<string, string>)[r.key] = r.value;
  }
  return map;
}
