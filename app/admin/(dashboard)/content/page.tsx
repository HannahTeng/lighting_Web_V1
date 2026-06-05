import { getHomeContent } from "@/lib/content";
import { listProducts } from "@/lib/admin/products";
import { saveHomeContent } from "@/app/admin/_actions/content";
import { PageHeader, Card, Field, Input, Textarea, Select, SectionTitle } from "@/components/admin/ui";
import SubmitButton from "@/components/admin/submit-button";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const [content, products] = await Promise.all([getHomeContent(), listProducts()]);

  return (
    <>
      <PageHeader
        title="Homepage"
        subtitle="Section copy — hero is not editable here"
      />

      <Card className="p-6 max-w-3xl">
        <form action={saveHomeContent} className="space-y-8">
          {/* ── Catalog ── */}
          <div className="space-y-4">
            <SectionTitle>02 — Catalog</SectionTitle>
            <Field label="Eyebrow">
              <Input name="catalog_eyebrow" defaultValue={content.catalog_eyebrow} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Heading">
                <Input name="catalog_heading" defaultValue={content.catalog_heading} />
              </Field>
              <Field label="Heading (italic part)">
                <Input name="catalog_heading_em" defaultValue={content.catalog_heading_em} />
              </Field>
            </div>
            <Field label="Intro">
              <Textarea name="catalog_intro" rows={3} defaultValue={content.catalog_intro} />
            </Field>
          </div>

          {/* ── Featured ── */}
          <div className="space-y-4">
            <SectionTitle>03 — Featured</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Featured product">
                <Select name="featured_slug" defaultValue={content.featured_slug}>
                  {products.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Eyebrow">
                <Input name="featured_eyebrow" defaultValue={content.featured_eyebrow} />
              </Field>
            </div>
            <Field label="Shipping note" hint="shown next to the price">
              <Input name="featured_note" defaultValue={content.featured_note} />
            </Field>
          </div>

          {/* ── Method ── */}
          <div className="space-y-4">
            <SectionTitle>04 — How it folds</SectionTitle>
            <Field label="Eyebrow">
              <Input name="method_eyebrow" defaultValue={content.method_eyebrow} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Heading">
                <Input name="method_heading" defaultValue={content.method_heading} />
              </Field>
              <Field label="Heading (italic part)">
                <Input name="method_heading_em" defaultValue={content.method_heading_em} />
              </Field>
            </div>
            <Field label="Intro">
              <Textarea name="method_intro" rows={3} defaultValue={content.method_intro} />
            </Field>
            {content.method_steps.map((s, i) => (
              <div key={i} className="grid sm:grid-cols-[160px_1fr] gap-4">
                <Field label={`Step 0${i + 1} title`}>
                  <Input name={`step${i + 1}_title`} defaultValue={s.title} />
                </Field>
                <Field label={`Step 0${i + 1} body`}>
                  <Textarea name={`step${i + 1}_body`} rows={2} defaultValue={s.body} />
                </Field>
              </div>
            ))}
          </div>

          {/* ── Founder ── */}
          <div className="space-y-4">
            <SectionTitle>Studio — The Maker</SectionTitle>
            <Field label="Eyebrow">
              <Input name="founder_eyebrow" defaultValue={content.founder_eyebrow} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Heading (line 1)">
                <Input name="founder_heading" defaultValue={content.founder_heading} />
              </Field>
              <Field label="Heading (line 2, italic)">
                <Input name="founder_heading_em" defaultValue={content.founder_heading_em} />
              </Field>
            </div>
            <Field label="Paragraph 1">
              <Textarea name="founder_para1" rows={4} defaultValue={content.founder_para1} />
            </Field>
            <Field label="Paragraph 2">
              <Textarea name="founder_para2" rows={2} defaultValue={content.founder_para2} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="TikTok handle">
                <Input name="tiktok_handle" defaultValue={content.tiktok_handle} />
              </Field>
              <Field label="TikTok URL">
                <Input name="tiktok_url" type="url" defaultValue={content.tiktok_url} />
              </Field>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {content.founder_stats.map((s, i) => (
                <div key={i} className="space-y-2">
                  <Field label={`Stat ${i + 1} number`}>
                    <Input name={`stat${i + 1}_num`} defaultValue={s.num} />
                  </Field>
                  <Field label={`Stat ${i + 1} label`}>
                    <Input name={`stat${i + 1}_label`} defaultValue={s.label} />
                  </Field>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-1">
            <SubmitButton pendingLabel="Saving…">Save homepage</SubmitButton>
          </div>
        </form>
      </Card>
    </>
  );
}
