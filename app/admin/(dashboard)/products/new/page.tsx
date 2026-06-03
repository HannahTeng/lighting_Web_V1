import { PageHeader } from "@/components/admin/ui";
import ProductForm from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <>
      <PageHeader title="New product" subtitle="Create a product" />
      <ProductForm product={null} />
    </>
  );
}
