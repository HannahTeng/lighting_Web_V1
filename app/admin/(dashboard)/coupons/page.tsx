import { listCoupons } from "@/lib/admin/coupons";
import { saveCoupon, toggleCoupon, deleteCoupon } from "@/app/admin/_actions/coupons";
import {
  PageHeader,
  Card,
  Table,
  Th,
  Td,
  EmptyRow,
  Badge,
  Field,
  Input,
  Select,
} from "@/components/admin/ui";
import SubmitButton from "@/components/admin/submit-button";
import ConfirmSubmit from "@/components/admin/confirm-submit";
import { usd } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

const rowAction =
  "font-mono text-[10px] tracking-[0.14em] uppercase text-ink-soft hover:text-ink transition-colors";

function describe(kind: string, amount: number): string {
  return kind === "percent" ? `${amount}% off` : `${usd(amount)} off`;
}

export default async function CouponsPage() {
  const coupons = await listCoupons();

  return (
    <>
      <PageHeader title="Coupons" subtitle={`${coupons.length} codes`} />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* create */}
        <Card className="p-5 h-fit">
          <h2 className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-soft mb-4">
            New coupon
          </h2>
          <form action={saveCoupon} className="space-y-4">
            <Field label="Code">
              <Input name="code" placeholder="WELCOME10" required />
            </Field>
            <Field label="Type">
              <Select name="kind" defaultValue="percent">
                <option value="percent">Percent (%)</option>
                <option value="fixed">Fixed (USD)</option>
              </Select>
            </Field>
            <Field label="Amount" hint="percent 1–100, or USD e.g. 5.00">
              <Input name="amount" type="number" step="0.01" min="0" required />
            </Field>
            <Field label="Max uses" hint="blank = unlimited">
              <Input name="max_uses" type="number" min="1" />
            </Field>
            <label className="flex items-center gap-2.5">
              <input
                type="checkbox"
                name="active"
                defaultChecked
                className="w-4 h-4 accent-[#3C3A36]"
              />
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-soft">
                Active
              </span>
            </label>
            <SubmitButton pendingLabel="Adding…">Add coupon</SubmitButton>
          </form>
        </Card>

        {/* list */}
        <div className="lg:col-span-2">
          <Table>
            <thead>
              <tr>
                <Th>Code</Th>
                <Th>Discount</Th>
                <Th>Uses</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <EmptyRow colSpan={5} label="No coupons yet" />
              ) : (
                coupons.map((c) => (
                  <tr key={c.id}>
                    <Td className="font-mono font-medium">{c.code}</Td>
                    <Td>{describe(c.kind, c.amount)}</Td>
                    <Td className="tabular-nums">
                      {c.used_count}
                      {c.max_uses != null ? ` / ${c.max_uses}` : ""}
                    </Td>
                    <Td>
                      {c.active ? (
                        <Badge tone="green">Active</Badge>
                      ) : (
                        <Badge tone="neutral">Off</Badge>
                      )}
                    </Td>
                    <Td className="text-right whitespace-nowrap">
                      <div className="flex gap-3 justify-end items-center">
                        <form action={toggleCoupon}>
                          <input type="hidden" name="id" value={c.id} />
                          <button className={rowAction}>
                            {c.active ? "Disable" : "Enable"}
                          </button>
                        </form>
                        <form action={deleteCoupon}>
                          <input type="hidden" name="id" value={c.id} />
                          <ConfirmSubmit
                            message={`Delete coupon ${c.code}?`}
                            className={`${rowAction} hover:text-red-700`}
                          >
                            Delete
                          </ConfirmSubmit>
                        </form>
                      </div>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}
