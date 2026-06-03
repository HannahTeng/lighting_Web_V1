import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublishedNewsBySlug } from "@/lib/admin/news";
import { dateShort } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getPublishedNewsBySlug(slug);
  if (!article) notFound();

  return (
    <article className="max-w-[760px] mx-auto px-6 md:px-10 pt-32 pb-24">
      <Link
        href="/journal"
        className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink-soft hover:text-ink transition-colors"
      >
        ← Journal
      </Link>

      <div className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-ink-soft mt-10 mb-3">
        {dateShort(article.published_at)}
      </div>
      <h1 className="font-serif text-[40px] md:text-[52px] leading-[1.05] tracking-[0.01em] mb-8">
        {article.title}
      </h1>

      {article.cover_image && (
        <div className="relative aspect-[16/9] rounded bg-bg-alt border border-line-soft overflow-hidden mb-10">
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 760px) 100vw, 760px"
          />
        </div>
      )}

      {article.body && (
        <div className="text-[16px] leading-[1.8] text-ink whitespace-pre-wrap">
          {article.body}
        </div>
      )}
    </article>
  );
}
