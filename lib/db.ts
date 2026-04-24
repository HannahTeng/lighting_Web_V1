import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let _sql: NeonQueryFunction<false, false> | null = null;

export function getDb(): NeonQueryFunction<false, false> | null {
  const url = process.env.DATABASE_URL;
  if (!url || url === "your_neon_connection_string_here") return null;
  if (!_sql) _sql = neon(url);
  return _sql;
}
