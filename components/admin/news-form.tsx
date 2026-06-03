import Link from "next/link";
import { Field, Input, Textarea, Select, btnGhost } from "@/components/admin/ui";
import SubmitButton from "@/components/admin/submit-button";
import { saveNews } from "@/app/admin/_actions/news";
import type { News } from "@/lib/admin/news";

export default function NewsForm({ article }: { article: News | null }) {
  return (
    <form action={saveNews} className="space-y-6 max-w-3xl">
      {article && <input type="hidden" name="id" value={article.id} />}

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Title">
          <Input name="title" defaultValue={article?.title ?? ""} required />
        </Field>
        <Field label="Slug" hint="leave blank to auto-generate">
          <Input name="slug" defaultValue={article?.slug ?? ""} />
        </Field>
      </div>

      <Field label="Cover image path" hint="/journal/…jpeg">
        <Input name="cover_image" defaultValue={article?.cover_image ?? ""} />
      </Field>

      <Field label="Excerpt">
        <Textarea name="excerpt" rows={2} defaultValue={article?.excerpt ?? ""} />
      </Field>

      <Field label="Body" hint="markdown or plain text">
        <Textarea name="body" rows={12} defaultValue={article?.body ?? ""} />
      </Field>

      <Field label="Status" className="max-w-xs">
        <Select name="status" defaultValue={article?.status ?? "draft"}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </Select>
      </Field>

      <div className="flex gap-3 pt-2">
        <SubmitButton pendingLabel="Saving…">Save article</SubmitButton>
        <Link href="/admin/news" className={btnGhost}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
