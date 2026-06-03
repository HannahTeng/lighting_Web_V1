import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder, ORDER_STATUSES } from "@/lib/admin/orders";
import { updateOrderStatus } from "@/app/admin/_actions/orders";
import {
  PageHeader,
  Card,
  Table,
  Th,
  Td,
  EmptyRow,
  Field,
  Select,
} from "@/components/admin/ui";
import SubmitButton from "@/components/admin/submit-button";
import { usd, dateTime } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getOrder(parseInt(id, 10));
  if (!data) notFound();
  const { order, items } = data;

  return (
    <>
      <PageHeader
        title={`Order #${order.id}`}
        subtitle={dateTime(order.created_at)}
        action={
          <Link href="/admin/orders" className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-soft hover:text-ink">
            ← All orders
          </Link>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Table>
            <thead>
              <tr>
                <Th>Item</Th>
                <Th>Qty</Th>
                <Th>Price</Th>
                <Th>Line</Th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <EmptyRow colSpan={4} label="No line items recorded" />
              ) : (
                items.map((it) => (
                  <tr key={it.id}>
                    <Td>
                      {it.slug ? (
                        <Link href={`/product/${it.slug}`} className="hover:underline">
                          {it.name ?? it.slug}
                        </Link>
                      ) : (
                        it.name ?? `Product #${it.product_id ?? "?"}`
                      )}
                    </Td>
                    <Td className="tabular-nums">{it.quantity}</Td>
                    <Td className="tabular-nums">{usd(it.price_jpy)}</Td>
                    <Td className="tabular-nums">{usd(it.price_jpy * it.quantity)}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        <div className="space-y-6">
          <Card className="p-5 space-y-4">
            <div>
              <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-stone">Total</div>
              <div className="font-serif text-[28px] tabular-nums">{usd(order.total_jpy)}</div>
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-stone">Email</div>
              <div className="text-[13px] break-all">{order.email || "—"}</div>
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-stone">Stripe session</div>
              <div className="text-[11px] font-mono break-all text-ink-soft">{order.stripe_session_id}</div>
            </div>
          </Card>

          <Card className="p-5">
            <form action={updateOrderStatus} className="space-y-3">
              <input type="hidden" name="id" value={order.id} />
              <Field label="Status">
                <Select name="status" defaultValue={order.status}>
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </Field>
              <SubmitButton pendingLabel="Updating…">Update status</SubmitButton>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
