import { getDb } from "@/lib/db";
import { PRODUCTS, type Product } from "@/lib/products";

export type { Product };

/** All products, newest first. Falls back to static seed when no DB. */
export async function listProducts(): Promise<Product[]> {
  const sql = getDb();
  if (!sql) return PRODUCTS;
  const rows = await sql`SELECT * FROM products ORDER BY id DESC`;
  return rows as unknown as Product[];
}

export async function getProduct(id: number): Promise<Product | null> {
  const sql = getDb();
  if (!sql) return PRODUCTS.find((p) => p.id === id) ?? null;
  const rows = await sql`SELECT * FROM products WHERE id = ${id} LIMIT 1`;
  return (rows[0] as unknown as Product) ?? null;
}
