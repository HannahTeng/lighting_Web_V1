import Link from "next/link";
import Image from "next/image";
import { listPublishedNews } from "@/lib/admin/news";
import { dateShort } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Journal — Orikami Studio",
  description: "Notes on paper, light, and the slow craft of folding.",
};

export default async function JournalPage() {
  const articles = await listPublishedNews();

  return (
    <div className="max-w-[1100px] mx-auto px-6 md:px-14 pt-32 pb-24">
      <p className="eyebrow mb-4">Journal</p>
      <h1 className="font-serif text-[44px] md:text-[60px] leading-[1.02] tracking-[0.01em] mb-16">
        Notes from the studio
      </h1>

      {articles.length === 0 ? (
        <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-soft">
          No articles yet.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {articles.map((a) => (
            <Link key={a.id} href={`/journal/${a.slug}`} className="group block">
              <div className="relative aspect-[4/5] rounded bg-bg-alt border border-line-soft overflow-hidden mb-4">
                {a.cover_image && (
                  <Image
                    src={a.cover_image}
                    alt={a.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                )}
              </div>
              <div className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-ink-soft mb-1.5">
                {dateShort(a.published_at)}
              </div>
              <h2 className="font-serif text-[22px] leading-tight mb-1.5">{a.title}</h2>
              {a.excerpt && (
                <p className="text-[14px] text-ink-soft leading-relaxed">{a.excerpt}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
