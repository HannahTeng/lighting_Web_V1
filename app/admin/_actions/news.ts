"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/admin/format";

export async function saveNews(formData: FormData): Promise<void> {
  const sql = getDb();
  if (!sql) throw new Error("Database not configured");

  const id = parseInt(String(formData.get("id") ?? "0"), 10) || 0;
  const title = String(formData.get("title") ?? "").trim();
  const slug =
    String(formData.get("slug") ?? "").trim() || slugify(title);
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  const cover_image = String(formData.get("cover_image") ?? "").trim();
  const status = String(formData.get("status") ?? "draft");
  const published_at = status === "published" ? new Date().toISOString() : null;

  if (id) {
    await sql`
      UPDATE news SET
        slug = ${slug}, title = ${title}, excerpt = ${excerpt},
        body = ${body}, cover_image = ${cover_image}, status = ${status},
        published_at = ${published_at}
      WHERE id = ${id}
    `;
  } else {
    await sql`
      INSERT INTO news (slug, title, excerpt, body, cover_image, status, published_at)
      VALUES (${slug}, ${title}, ${excerpt}, ${body}, ${cover_image}, ${status}, ${published_at})
    `;
  }

  revalidatePath("/admin/news");
  redirect("/admin/news");
}

export async function deleteNews(formData: FormData): Promise<void> {
  const sql = getDb();
  if (!sql) throw new Error("Database not configured");
  const id = parseInt(String(formData.get("id")), 10);
  await sql`DELETE FROM news WHERE id = ${id}`;
  revalidatePath("/admin/news");
}
