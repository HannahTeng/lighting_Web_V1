import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { findRedeemableCoupon } from "@/lib/admin/coupons";
import type { CartItem } from "@/lib/cart";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Payments not configured yet." },
      { status: 503 }
    );
  }

  const { items, couponCode }: { items: CartItem[]; couponCode?: string } =
    await req.json();
  if (!items?.length) {
    return NextResponse.json({ error: "Empty cart" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Resolve a discount from our own coupons table, then mint an ephemeral
  // Stripe coupon so the discount shows on the hosted checkout page.
  let discounts: { coupon: string }[] | undefined;
  let appliedCode = "";
  if (couponCode?.trim()) {
    const coupon = await findRedeemableCoupon(couponCode.trim());
    if (coupon) {
      const stripeCoupon = await stripe.coupons.create(
        coupon.kind === "percent"
          ? { percent_off: coupon.amount, duration: "once" }
          : { amount_off: coupon.amount, currency: "usd", duration: "once" }
      );
      discounts = [{ coupon: stripeCoupon.id }];
      appliedCode = coupon.code;
    }
  }

  // Compact line-item payload so the webhook can persist order_items.
  const itemsMeta = JSON.stringify(
    items.map((i) => ({ s: i.slug, q: i.quantity, p: i.price_jpy }))
  );

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
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
    discounts,
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/shop`,
    payment_method_types: ["card"],
    metadata: {
      coupon: appliedCode,
      // Stripe metadata values cap at 500 chars; fine for small carts.
      items: itemsMeta.length <= 500 ? itemsMeta : "",
    },
  });

  return NextResponse.json({ url: session.url });
}
