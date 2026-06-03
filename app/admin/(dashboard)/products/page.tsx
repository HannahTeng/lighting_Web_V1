import Link from "next/link";
import { listProducts } from "@/lib/admin/products";
import {
  PageHeader,
  Table,
  Th,
  Td,
  EmptyRow,
  Badge,
  LinkButton,
} from "@/components/admin/ui";
import { usd } from "@/lib/admin/format";
import { deleteProduct, toggleStock } from "@/app/admin/_actions/products";
import ConfirmSubmit from "@/components/admin/confirm-submit";

export const dynamic = "force-dynamic";

const rowAction =
  "font-mono text-[10px] tracking-[0.14em] uppercase text-ink-soft hover:text-ink transition-colors";

export default async function ProductsPage() {
  const products = await listProducts();

  return (
    <>
      <PageHeader
        title="Products"
        subtitle={`${products.length} items`}
        action={<LinkButton href="/admin/products/new">+ New product</LinkButton>}
      />

      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Category</Th>
            <Th>Price</Th>
            <Th>Status</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <EmptyRow colSpan={5} label="No products yet" />
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <Td>
                  <Link href={`/admin/products/${p.id}`} className="font-medium hover:underline">
                    {p.name}
                  </Link>
                  <div className="text-ink-soft text-[11px] font-mono">{p.slug}</div>
                </Td>
                <Td>{p.category}</Td>
                <Td className="tabular-nums">{usd(p.price_jpy)}</Td>
                <Td>
                  {p.in_stock ? (
                    <Badge tone="green">In stock</Badge>
                  ) : (
                    <Badge tone="amber">Out</Badge>
                  )}
                </Td>
                <Td className="text-right whitespace-nowrap">
                  <div className="flex gap-3 justify-end items-center">
                    <form action={toggleStock}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className={rowAction}>Toggle</button>
                    </form>
                    <Link href={`/admin/products/${p.id}`} className={rowAction}>
                      Edit
                    </Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <ConfirmSubmit
                        message={`Delete "${p.name}"? This cannot be undone.`}
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
    </>
  );
}
