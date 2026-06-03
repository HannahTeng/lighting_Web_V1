"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveCoupon(formData: FormData): Promise<void> {
  const sql = getDb();
  if (!sql) throw new Error("Database not configured");

  const id = parseInt(String(formData.get("id") ?? "0"), 10) || 0;
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const kind = String(formData.get("kind") ?? "percent");
  const rawAmount = parseFloat(String(formData.get("amount") ?? "0")) || 0;
  // percent stored as-is (1-100); fixed stored as USD cents
  const amount =
    kind === "fixed" ? Math.round(rawAmount * 100) : Math.round(rawAmount);
  const active = formData.get("active") === "on";
  const maxRaw = String(formData.get("max_uses") ?? "").trim();
  const max_uses = maxRaw ? parseInt(maxRaw, 10) : null;

  if (!code) throw new Error("Coupon code is required");

  if (id) {
    await sql`
      UPDATE coupons SET
        code = ${code}, kind = ${kind}, amount = ${amount},
        active = ${active}, max_uses = ${max_uses}
      WHERE id = ${id}
    `;
  } else {
    await sql`
      INSERT INTO coupons (code, kind, amount, active, max_uses)
      VALUES (${code}, ${kind}, ${amount}, ${active}, ${max_uses})
    `;
  }

  revalidatePath("/admin/coupons");
}

export async function toggleCoupon(formData: FormData): Promise<void> {
  const sql = getDb();
  if (!sql) throw new Error("Database not configured");
  const id = parseInt(String(formData.get("id")), 10);
  await sql`UPDATE coupons SET active = NOT active WHERE id = ${id}`;
  revalidatePath("/admin/coupons");
}

export async function deleteCoupon(formData: FormData): Promise<void> {
  const sql = getDb();
  if (!sql) throw new Error("Database not configured");
  const id = parseInt(String(formData.get("id")), 10);
  await sql`DELETE FROM coupons WHERE id = ${id}`;
  revalidatePath("/admin/coupons");
}
