import { notFound } from "next/navigation";
import { getNews } from "@/lib/admin/news";
import { PageHeader } from "@/components/admin/ui";
import NewsForm from "@/components/admin/news-form";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getNews(parseInt(id, 10));
  if (!article) notFound();

  return (
    <>
      <PageHeader title={article.title} subtitle="Edit article" />
      <NewsForm article={article} />
    </>
  );
}
