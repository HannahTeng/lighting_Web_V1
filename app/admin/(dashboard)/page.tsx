import Link from "next/link";
import { getDashboardStats } from "@/lib/admin/stats";
import { getSettings } from "@/lib/admin/settings";
import {
  PageHeader,
  StatCard,
  Card,
  Table,
  Th,
  Td,
  EmptyRow,
  Badge,
} from "@/components/admin/ui";
import { usd, dateShort } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, string> = {
  paid: "green",
  pending: "amber",
  fulfilled: "ink",
  shipped: "ink",
  refunded: "red",
  cancelled: "red",
};

export default async function OverviewPage() {
  const [stats, settings] = await Promise.all([
    getDashboardStats(),
    getSettings(),
  ]);

  return (
    <>
      <PageHeader title="Overview" subtitle={settings.store_name} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Revenue" value={usd(stats.revenue)} hint="Paid orders" />
        <StatCard label="Orders" value={stats.orders} />
        <StatCard
          label="Products"
          value={stats.products}
          hint={`${stats.outOfStock.length} out of stock`}
        />
        <StatCard label="Customers" value={stats.customers} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft mb-3">
            Recent orders
          </h2>
          <Table>
            <thead>
              <tr>
                <Th>Order</Th>
                <Th>Email</Th>
                <Th>Total</Th>
                <Th>Status</Th>
                <Th>Date</Th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length === 0 ? (
                <EmptyRow colSpan={5} label="No orders yet" />
              ) : (
                stats.recentOrders.map((o) => (
                  <tr key={o.id}>
                    <Td>
                      <Link href={`/admin/orders/${o.id}`} className="font-medium hover:underline">
                        #{o.id}
                      </Link>
                    </Td>
                    <Td className="text-ink-soft">{o.email || "—"}</Td>
                    <Td className="tabular-nums">{usd(o.total_jpy)}</Td>
                    <Td>
                      <Badge tone={STATUS_TONE[o.status] ?? "neutral"}>{o.status}</Badge>
                    </Td>
                    <Td className="text-ink-soft">{dateShort(o.created_at)}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        <div>
          <h2 className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft mb-3">
            Out of stock
          </h2>
          <Card className="p-5">
            {stats.outOfStock.length === 0 ? (
              <p className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-stone">
                Everything in stock
              </p>
            ) : (
              <ul className="space-y-2">
                {stats.outOfStock.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-[13px] hover:underline truncate"
                    >
                      {p.name}
                    </Link>
                    <Badge tone="amber">Out</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
