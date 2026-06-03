"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveSettings(formData: FormData): Promise<void> {
  const sql = getDb();
  if (!sql) throw new Error("Database not configured");

  const entries: [string, string][] = [
    ["store_name", String(formData.get("store_name") ?? "")],
    ["currency", String(formData.get("currency") ?? "USD")],
    ["support_email", String(formData.get("support_email") ?? "")],
  ];

  for (const [key, value] of entries) {
    await sql`
      INSERT INTO settings (key, value) VALUES (${key}, ${value})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `;
  }

  revalidatePath("/admin/settings");
}
