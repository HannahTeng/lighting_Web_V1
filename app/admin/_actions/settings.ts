"use server";

import { revalidatePath } from "next/cache";
import { setSettings } from "@/lib/admin/settings";
import { str } from "@/lib/admin/format";

const KEYS = [
  "store_name",
  "currency",
  "support_email",
  "footer_tagline",
  "footer_meta",
  "footer_location",
  "footer_note",
] as const;

export async function saveSettings(formData: FormData): Promise<void> {
  await setSettings(KEYS.map((k) => [k, str(formData, k)]));
  revalidatePath("/admin/settings");
}
