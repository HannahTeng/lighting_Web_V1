import Stripe from "stripe";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.startsWith("sk_test_...")) return null;
  return new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
}
