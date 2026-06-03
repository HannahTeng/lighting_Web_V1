import { getDb } from "@/lib/db";
import type { Order } from "@/lib/admin/orders";

export type DashboardStats = {
  products: number;
  orders: number;
  customers: number;
  revenue: number; // USD cents, paid orders only
  outOfStock: { id: number; name: string }[];
  recentOrders: Order[];
};

const EMPTY: DashboardStats = {
  products: 0,
  orders: 0,
  customers: 0,
  revenue: 0,
  outOfStock: [],
  recentOrders: [],
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const sql = getDb();
  if (!sql) return EMPTY;

  const [products, orders, revenue, customers, outOfStock, recentOrders] =
    await Promise.all([
      sql`SELECT COUNT(*)::int AS n FROM products`,
      sql`SELECT COUNT(*)::int AS n FROM orders`,
      sql`SELECT COALESCE(SUM(total_jpy), 0)::int AS n FROM orders WHERE status = 'paid'`,
      sql`SELECT COUNT(DISTINCT email)::int AS n FROM orders WHERE email <> ''`,
      sql`SELECT id, name FROM products WHERE in_stock = false ORDER BY id DESC`,
      sql`SELECT * FROM orders ORDER BY created_at DESC LIMIT 8`,
    ]);

  return {
    products: (products[0] as { n: number }).n,
    orders: (orders[0] as { n: number }).n,
    revenue: (revenue[0] as { n: number }).n,
    customers: (customers[0] as { n: number }).n,
    outOfStock: outOfStock as unknown as { id: number; name: string }[],
    recentOrders: recentOrders as unknown as Order[],
  };
}
