import Link from "next/link";
import { listNews } from "@/lib/admin/news";
import {
  PageHeader,
  Table,
  Th,
  Td,
  EmptyRow,
  Badge,
  LinkButton,
} from "@/components/admin/ui";
import { dateShort } from "@/lib/admin/format";
import { deleteNews } from "@/app/admin/_actions/news";
import ConfirmSubmit from "@/components/admin/confirm-submit";

export const dynamic = "force-dynamic";

const rowAction =
  "font-mono text-[10px] tracking-[0.14em] uppercase text-ink-soft hover:text-ink transition-colors";

export default async function NewsPage() {
  const articles = await listNews();

  return (
    <>
      <PageHeader
        title="News"
        subtitle={`${articles.length} articles`}
        action={<LinkButton href="/admin/news/new">+ New article</LinkButton>}
      />

      <Table>
        <thead>
          <tr>
            <Th>Title</Th>
            <Th>Status</Th>
            <Th>Published</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {articles.length === 0 ? (
            <EmptyRow colSpan={4} label="No articles yet" />
          ) : (
            articles.map((a) => (
              <tr key={a.id}>
                <Td>
                  <Link href={`/admin/news/${a.id}`} className="font-medium hover:underline">
                    {a.title}
                  </Link>
                  <div className="text-ink-soft text-[11px] font-mono">{a.slug}</div>
                </Td>
                <Td>
                  {a.status === "published" ? (
                    <Badge tone="green">Published</Badge>
                  ) : (
                    <Badge tone="amber">Draft</Badge>
                  )}
                </Td>
                <Td className="text-ink-soft">{dateShort(a.published_at)}</Td>
                <Td className="text-right whitespace-nowrap">
                  <div className="flex gap-3 justify-end items-center">
                    <Link href={`/admin/news/${a.id}`} className={rowAction}>
                      Edit
                    </Link>
                    <form action={deleteNews}>
                      <input type="hidden" name="id" value={a.id} />
                      <ConfirmSubmit
                        message={`Delete "${a.title}"?`}
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
