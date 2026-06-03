"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(formData: FormData): Promise<void> {
  const sql = getDb();
  if (!sql) throw new Error("Database not configured");
  const id = parseInt(String(formData.get("id")), 10);
  const status = String(formData.get("status") ?? "pending");
  await sql`UPDATE orders SET status = ${status} WHERE id = ${id}`;
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
}
