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
        await sql`
          INSERT INTO orders (stripe_session_id, email, status, total_cents)
          VALUES (${session.id}, ${session.customer_details?.email ?? ""}, 'paid', ${session.amount_total ?? 0})
          ON CONFLICT (stripe_session_id) DO NOTHING
        `;
      } catch (e) {
        console.error("DB insert failed:", e);
      }
    }
  }

  return NextResponse.json({ received: true });
}
