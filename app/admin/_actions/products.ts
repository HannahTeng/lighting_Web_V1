"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function str(fd: FormData, k: string): string {
  return String(fd.get(k) ?? "").trim();
}
function int(fd: FormData, k: string): number {
  const n = parseInt(String(fd.get(k) ?? ""), 10);
  return Number.isFinite(n) ? n : 0;
}
function dollarsToCents(fd: FormData, k: string): number {
  const n = parseFloat(String(fd.get(k) ?? "0"));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

export async function saveProduct(formData: FormData): Promise<void> {
  const sql = getDb();
  if (!sql) throw new Error("Database not configured");

  const id = int(formData, "id");
  const f = {
    slug: str(formData, "slug"),
    name: str(formData, "name"),
    tagline: str(formData, "tagline"),
    category: str(formData, "category"),
    price_jpy: dollarsToCents(formData, "price"),
    description: str(formData, "description"),
    paper: str(formData, "paper"),
    diameter: str(formData, "diameter"),
    height: str(formData, "height"),
    bulb: str(formData, "bulb"),
    cord: str(formData, "cord"),
    weight: str(formData, "weight"),
    assembly_level: int(formData, "assembly_level"),
    assembly_time: str(formData, "assembly_time"),
    image: str(formData, "image"),
    in_stock: formData.get("in_stock") === "on",
  };

  if (id) {
    await sql`
      UPDATE products SET
        slug = ${f.slug}, name = ${f.name}, tagline = ${f.tagline},
        category = ${f.category}, price_jpy = ${f.price_jpy},
        description = ${f.description}, paper = ${f.paper},
        diameter = ${f.diameter}, height = ${f.height}, bulb = ${f.bulb},
        cord = ${f.cord}, weight = ${f.weight},
        assembly_level = ${f.assembly_level}, assembly_time = ${f.assembly_time},
        image = ${f.image}, in_stock = ${f.in_stock}
      WHERE id = ${id}
    `;
  } else {
    await sql`
      INSERT INTO products
        (slug, name, tagline, category, price_jpy, description, paper,
         diameter, height, bulb, cord, weight, assembly_level, assembly_time,
         image, in_stock)
      VALUES
        (${f.slug}, ${f.name}, ${f.tagline}, ${f.category}, ${f.price_jpy},
         ${f.description}, ${f.paper}, ${f.diameter}, ${f.height}, ${f.bulb},
         ${f.cord}, ${f.weight}, ${f.assembly_level}, ${f.assembly_time},
         ${f.image}, ${f.in_stock})
    `;
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  const sql = getDb();
  if (!sql) throw new Error("Database not configured");
  const id = parseInt(String(formData.get("id")), 10);
  await sql`DELETE FROM products WHERE id = ${id}`;
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function toggleStock(formData: FormData): Promise<void> {
  const sql = getDb();
  if (!sql) throw new Error("Database not configured");
  const id = parseInt(String(formData.get("id")), 10);
  await sql`UPDATE products SET in_stock = NOT in_stock WHERE id = ${id}`;
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}
