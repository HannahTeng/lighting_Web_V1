import { CartProvider } from "@/lib/cart";
import Nav from "@/components/nav";

// The storefront is DB-backed (products, settings, homepage content) and
// rendered per request so admin edits are visible immediately.
export const dynamic = "force-dynamic";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
      </div>
    </CartProvider>
  );
}
