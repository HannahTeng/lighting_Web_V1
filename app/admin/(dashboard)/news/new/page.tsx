import { PageHeader } from "@/components/admin/ui";
import NewsForm from "@/components/admin/news-form";

export default function NewArticlePage() {
  return (
    <>
      <PageHeader title="New article" subtitle="Create" />
      <NewsForm article={null} />
    </>
  );
}
