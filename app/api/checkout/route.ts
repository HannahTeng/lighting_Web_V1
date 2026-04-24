import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import type { CartItem } from "@/lib/cart";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Payments not configured yet." },
      { status: 503 }
    );
  }

  const { items }: { items: CartItem[] } = await req.json();
  if (!items?.length) {
    return NextResponse.json({ error: "Empty cart" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    currency: "usd",
    line_items: items.map((item) => ({
      price_data: {
        currency: "usd",
        unit_amount: item.price_jpy, // stored as cents, e.g. 3999 = $39.99
        product_data: {
          name: item.name,
          images: [`${baseUrl}${item.image}`],
        },
      },
      quantity: item.quantity,
    })),
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${baseUrl}/shop`,
    payment_method_types: ["card"],
  });

  return NextResponse.json({ url: session.url });
}
