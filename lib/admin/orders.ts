import { getDb } from "@/lib/db";

export type Order = {
  id: number;
  stripe_session_id: string;
  email: string;
  status: string;
  total_jpy: number; // USD cents (see lib/admin/format.ts)
  created_at: string;
};

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number | null;
  quantity: number;
  price_jpy: number; // USD cents
  name: string | null;
  slug: string | null;
};

export const ORDER_STATUSES = [
  "pending",
  "paid",
  "fulfilled",
  "shipped",
  "refunded",
  "cancelled",
] as const;

export async function listOrders(): Promise<Order[]> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
  return rows as unknown as Order[];
}

export async function getOrder(
  id: number,
): Promise<{ order: Order; items: OrderItem[] } | null> {
  const sql = getDb();
  if (!sql) return null;
  const orders = await sql`SELECT * FROM orders WHERE id = ${id} LIMIT 1`;
  const order = orders[0] as unknown as Order | undefined;
  if (!order) return null;
  const items = await sql`
    SELECT oi.*, p.name, p.slug
    FROM order_items oi
    LEFT JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = ${id}
    ORDER BY oi.id
  `;
  return { order, items: items as unknown as OrderItem[] };
}
