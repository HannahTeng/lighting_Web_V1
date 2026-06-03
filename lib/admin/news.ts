import { getDb } from "@/lib/db";

export type News = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  cover_image: string | null;
  status: string; // draft | published
  published_at: string | null;
  created_at: string;
};

export async function listNews(): Promise<News[]> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`SELECT * FROM news ORDER BY created_at DESC`;
  return rows as unknown as News[];
}

export async function getNews(id: number): Promise<News | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`SELECT * FROM news WHERE id = ${id} LIMIT 1`;
  return (rows[0] as unknown as News) ?? null;
}

/** Published articles for the public journal (newest first). */
export async function listPublishedNews(): Promise<News[]> {
  const sql = getDb();
  if (!sql) return [];
  const rows = await sql`
    SELECT * FROM news
    WHERE status = 'published'
    ORDER BY COALESCE(published_at, created_at) DESC
  `;
  return rows as unknown as News[];
}

/** A single published article by slug, for the public journal. */
export async function getPublishedNewsBySlug(slug: string): Promise<News | null> {
  const sql = getDb();
  if (!sql) return null;
  const rows = await sql`
    SELECT * FROM news WHERE slug = ${slug} AND status = 'published' LIMIT 1
  `;
  return (rows[0] as unknown as News) ?? null;
}
