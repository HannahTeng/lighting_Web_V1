import Link from "next/link";
import { Field, Input, Textarea, btnGhost } from "@/components/admin/ui";
import SubmitButton from "@/components/admin/submit-button";
import { saveProduct } from "@/app/admin/_actions/products";
import { centsToDollars } from "@/lib/admin/format";
import type { Product } from "@/lib/admin/products";

export default function ProductForm({ product }: { product: Product | null }) {
  return (
    <form action={saveProduct} className="space-y-6 max-w-3xl">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Name">
          <Input name="name" defaultValue={product?.name ?? ""} required />
        </Field>
        <Field label="Slug" hint="lowercase-with-hyphens">
          <Input name="slug" defaultValue={product?.slug ?? ""} required />
        </Field>
      </div>

      <Field label="Tagline">
        <Input name="tagline" defaultValue={product?.tagline ?? ""} />
      </Field>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Category">
          <Input name="category" defaultValue={product?.category ?? ""} required />
        </Field>
        <Field label="Price (USD)" hint="e.g. 39.99">
          <Input
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product ? centsToDollars(product.price_jpy) : ""}
            required
          />
        </Field>
        <Field label="Image path" hint="/products/…jpeg">
          <Input name="image" defaultValue={product?.image ?? ""} required />
        </Field>
      </div>

      <Field label="Description">
        <Textarea name="description" rows={4} defaultValue={product?.description ?? ""} />
      </Field>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Paper">
          <Input name="paper" defaultValue={product?.paper ?? ""} />
        </Field>
        <Field label="Diameter">
          <Input name="diameter" defaultValue={product?.diameter ?? ""} />
        </Field>
        <Field label="Height">
          <Input name="height" defaultValue={product?.height ?? ""} />
        </Field>
        <Field label="Bulb">
          <Input name="bulb" defaultValue={product?.bulb ?? ""} />
        </Field>
        <Field label="Cord">
          <Input name="cord" defaultValue={product?.cord ?? ""} />
        </Field>
        <Field label="Weight">
          <Input name="weight" defaultValue={product?.weight ?? ""} />
        </Field>
        <Field label="Assembly level" hint="1–5">
          <Input
            name="assembly_level"
            type="number"
            min="0"
            max="5"
            defaultValue={product?.assembly_level ?? ""}
          />
        </Field>
        <Field label="Assembly time">
          <Input name="assembly_time" defaultValue={product?.assembly_time ?? ""} />
        </Field>
      </div>

      <label className="flex items-center gap-2.5">
        <input
          type="checkbox"
          name="in_stock"
          defaultChecked={product ? product.in_stock : true}
          className="w-4 h-4 accent-[#3C3A36]"
        />
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-soft">
          In stock
        </span>
      </label>

      <div className="flex gap-3 pt-2">
        <SubmitButton pendingLabel="Saving…">Save product</SubmitButton>
        <Link href="/admin/products" className={btnGhost}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
