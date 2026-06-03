import { getDb } from "@/lib/db";

/** Customers are derived by aggregating orders on email (no separate table). */
export type Customer = {
  email: string;
  orders: number;
  total_spent: number; // USD cents
  last_order: string;
  first_order: string;
};

export async function listCustomers(): Promise<Customer[]> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`
    SELECT
      email,
      COUNT(*)::int                    AS orders,
      COALESCE(SUM(total_jpy), 0)::int AS total_spent,
      MAX(created_at)                  AS last_order,
      MIN(created_at)                  AS first_order
    FROM orders
    WHERE email <> ''
    GROUP BY email
    ORDER BY total_spent DESC
  `;
  return rows as unknown as Customer[];
}
