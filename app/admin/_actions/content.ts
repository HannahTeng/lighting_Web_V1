"use server";

import { revalidatePath } from "next/cache";
import { setSettings } from "@/lib/admin/settings";
import { str } from "@/lib/admin/format";
import { DEFAULT_HOME_CONTENT, HOME_CONTENT_KEY, type HomeContent } from "@/lib/content";

export async function saveHomeContent(formData: FormData): Promise<void> {
  const content: HomeContent = {
    featured_slug: str(formData, "featured_slug"),
    catalog_eyebrow: str(formData, "catalog_eyebrow"),
    catalog_heading: str(formData, "catalog_heading"),
    catalog_heading_em: str(formData, "catalog_heading_em"),
    catalog_intro: str(formData, "catalog_intro"),
    featured_eyebrow: str(formData, "featured_eyebrow"),
    featured_note: str(formData, "featured_note"),
    products_eyebrow: str(formData, "products_eyebrow"),
    products_heading: str(formData, "products_heading"),
    products_heading_em: str(formData, "products_heading_em"),
    method_eyebrow: str(formData, "method_eyebrow"),
    method_heading: str(formData, "method_heading"),
    method_heading_em: str(formData, "method_heading_em"),
    method_intro: str(formData, "method_intro"),
    method_steps: DEFAULT_HOME_CONTENT.method_steps.map((_, i) => ({
      title: str(formData, `step${i + 1}_title`),
      body: str(formData, `step${i + 1}_body`),
    })),
    founder_eyebrow: str(formData, "founder_eyebrow"),
    founder_heading: str(formData, "founder_heading"),
    founder_heading_em: str(formData, "founder_heading_em"),
    founder_para1: str(formData, "founder_para1"),
    founder_para2: str(formData, "founder_para2"),
    tiktok_handle: str(formData, "tiktok_handle"),
    tiktok_url: str(formData, "tiktok_url"),
    founder_stats: DEFAULT_HOME_CONTENT.founder_stats.map((_, i) => ({
      num: str(formData, `stat${i + 1}_num`),
      label: str(formData, `stat${i + 1}_label`),
    })),
  };

  await setSettings([[HOME_CONTENT_KEY, JSON.stringify(content)]]);

  revalidatePath("/");
  revalidatePath("/admin/content");
}
