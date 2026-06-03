import { CartProvider } from "@/lib/cart";
import Nav from "@/components/nav";

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
