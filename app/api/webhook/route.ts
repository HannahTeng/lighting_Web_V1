import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getDb } from "@/lib/db";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const body   = await req.text();
  const sig    = req.headers.get("stripe-signature") ?? "";
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not set" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown";
    return NextResponse.json({ error: `Webhook: ${msg}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const sql = getDb();
    if (sql) {
      try {
        // Insert the order. RETURNING id is empty on conflict, making the
        // whole handler idempotent under Stripe retries.
        const inserted = await sql`
          INSERT INTO orders (stripe_session_id, email, status, total_jpy)
          VALUES (${session.id}, ${session.customer_details?.email ?? ""}, 'paid', ${session.amount_total ?? 0})
          ON CONFLICT (stripe_session_id) DO NOTHING
          RETURNING id
        `;
        const orderId = (inserted[0] as { id: number } | undefined)?.id;

        if (orderId) {
          // Persist line items from the compact metadata payload.
          const itemsRaw = session.metadata?.items;
          if (itemsRaw) {
            try {
              const items = JSON.parse(itemsRaw) as {
                s: string;
                q: number;
                p: number;
              }[];
              for (const it of items) {
                const prod = await sql`SELECT id FROM products WHERE slug = ${it.s} LIMIT 1`;
                const productId = (prod[0] as { id: number } | undefined)?.id ?? null;
                await sql`
                  INSERT INTO order_items (order_id, product_id, quantity, price_jpy)
                  VALUES (${orderId}, ${productId}, ${it.q}, ${it.p})
                `;
              }
            } catch (e) {
              console.error("order_items insert failed:", e);
            }
          }

          // Count a coupon redemption.
          const coupon = session.metadata?.coupon;
          if (coupon) {
            await sql`
              UPDATE coupons SET used_count = used_count + 1
              WHERE LOWER(code) = LOWER(${coupon})
            `;
          }
        }
      } catch (e) {
        console.error("DB insert failed:", e);
      }
    }
  }

  return NextResponse.json({ received: true });
}
