import Link from "next/link";
import { listOrders } from "@/lib/admin/orders";
import {
  PageHeader,
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

export default async function OrdersPage() {
  const orders = await listOrders();

  return (
    <>
      <PageHeader title="Orders" subtitle={`${orders.length} total`} />

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
          {orders.length === 0 ? (
            <EmptyRow colSpan={5} label="No orders yet" />
          ) : (
            orders.map((o) => (
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
    </>
  );
}
