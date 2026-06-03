import { notFound } from "next/navigation";
import { getProduct } from "@/lib/admin/products";
import { PageHeader } from "@/components/admin/ui";
import ProductForm from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(parseInt(id, 10));
  if (!product) notFound();

  return (
    <>
      <PageHeader title={product.name} subtitle="Edit product" />
      <ProductForm product={product} />
    </>
  );
}
