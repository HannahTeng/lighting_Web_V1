"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/_actions/auth";

const GROUPS: {
  label?: string;
  items: { href: string; label: string; exact?: boolean }[];
}[] = [
  {
    // Top — no group label
    items: [{ href: "/admin", label: "Overview", exact: true }],
  },
  {
    label: "Catalog",
    items: [{ href: "/admin/products", label: "Products" }],
  },
  {
    label: "Sales",
    items: [
      { href: "/admin/orders", label: "Orders" },
      { href: "/admin/coupons", label: "Coupons" },
      { href: "/admin/customers", label: "Customers" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/content", label: "Homepage" },
      { href: "/admin/news", label: "News" },
    ],
  },
  {
    label: "System",
    items: [{ href: "/admin/settings", label: "Settings" }],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="w-60 shrink-0 border-r border-line bg-surface flex flex-col sticky top-0 h-screen">
      {/* brand */}
      <Link
        href="/admin"
        className="h-[52px] flex items-center gap-2.5 px-5 border-b border-line-soft shrink-0"
      >
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="#3C3A36" strokeWidth="1.2">
          <path d="M16 3 L29 16 L16 29 L3 16 Z" />
          <path d="M16 3 L16 29 M3 16 L29 16 M8 8 L24 24 M8 24 L24 8" />
        </svg>
        <div className="leading-none">
          <div className="font-serif text-[17px] tracking-[0.01em]">Orikami</div>
          <div className="font-mono text-[8.5px] tracking-[0.2em] text-stone uppercase mt-0.5">
            Admin
          </div>
        </div>
      </Link>

      {/* nav */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
        {GROUPS.map((g) => (
          <div key={g.label ?? g.items[0].href}>
            {g.label && (
              <div className="px-3 mb-2 font-mono text-[8.5px] tracking-[0.2em] uppercase text-stone">
                {g.label}
              </div>
            )}
            <ul className="space-y-0.5">
              {g.items.map((it) => (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    className={`block rounded-sm px-3 py-2 font-mono text-[10.5px] tracking-[0.12em] uppercase transition-colors ${
                      isActive(it.href, it.exact)
                        ? "bg-ink text-bg"
                        : "text-ink-soft hover:bg-sand/30 hover:text-ink"
                    }`}
                  >
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* footer */}
      <div className="border-t border-line-soft p-3 space-y-1 shrink-0">
        <Link
          href="/"
          className="block rounded-sm px-3 py-2 font-mono text-[10px] tracking-[0.12em] uppercase text-ink-soft hover:bg-sand/30 hover:text-ink transition-colors"
        >
          ← View store
        </Link>
        <form action={logoutAction}>
          <button className="w-full text-left rounded-sm px-3 py-2 font-mono text-[10px] tracking-[0.12em] uppercase text-ink-soft hover:bg-sand/30 hover:text-ink transition-colors">
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
