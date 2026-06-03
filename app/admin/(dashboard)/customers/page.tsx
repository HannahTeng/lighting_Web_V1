import { listCustomers } from "@/lib/admin/customers";
import {
  PageHeader,
  Table,
  Th,
  Td,
  EmptyRow,
} from "@/components/admin/ui";
import { usd, dateShort } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await listCustomers();

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} from orders`}
      />

      <Table>
        <thead>
          <tr>
            <Th>Email</Th>
            <Th>Orders</Th>
            <Th>Total spent</Th>
            <Th>First order</Th>
            <Th>Last order</Th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <EmptyRow colSpan={5} label="No customers yet" />
          ) : (
            customers.map((c) => (
              <tr key={c.email}>
                <Td className="font-medium">{c.email}</Td>
                <Td className="tabular-nums">{c.orders}</Td>
                <Td className="tabular-nums">{usd(c.total_spent)}</Td>
                <Td className="text-ink-soft">{dateShort(c.first_order)}</Td>
                <Td className="text-ink-soft">{dateShort(c.last_order)}</Td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  );
}
