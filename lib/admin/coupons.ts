import { getDb } from "@/lib/db";

export type Coupon = {
  id: number;
  code: string;
  kind: "percent" | "fixed";
  amount: number; // percent (1-100) or USD cents when kind='fixed'
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  max_uses: number | null;
  used_count: number;
  created_at: string;
};

export async function listCoupons(): Promise<Coupon[]> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`SELECT * FROM coupons ORDER BY created_at DESC`;
  return rows as unknown as Coupon[];
}

/**
 * Look up a coupon by code and return it only if currently redeemable
 * (active, within date window, under max_uses). Used at checkout.
 */
export async function findRedeemableCoupon(
  code: string,
): Promise<Coupon | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`
    SELECT * FROM coupons WHERE LOWER(code) = LOWER(${code}) LIMIT 1
  `;
  const c = rows[0] as unknown as Coupon | undefined;
  if (!c || !c.active) return null;
  const now = Date.now();
  if (c.starts_at && new Date(c.starts_at).getTime() > now) return null;
  if (c.ends_at && new Date(c.ends_at).getTime() < now) return null;
  if (c.max_uses != null && c.used_count >= c.max_uses) return null;
  return c;
}
