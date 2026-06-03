CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  tagline     TEXT,
  category    TEXT NOT NULL,
  price_jpy   INTEGER NOT NULL,
  description TEXT,
  paper       TEXT,
  diameter    TEXT,
  height      TEXT,
  bulb        TEXT,
  cord        TEXT,
  weight      TEXT,
  assembly_level INTEGER,
  assembly_time  TEXT,
  image       TEXT NOT NULL,
  in_stock    BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id                 SERIAL PRIMARY KEY,
  stripe_session_id  TEXT UNIQUE NOT NULL,
  email              TEXT NOT NULL,
  status             TEXT DEFAULT 'pending',
  total_jpy          INTEGER NOT NULL,
  created_at         TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id          SERIAL PRIMARY KEY,
  order_id    INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id  INTEGER REFERENCES products(id),
  quantity    INTEGER NOT NULL,
  price_jpy   INTEGER NOT NULL
);

INSERT INTO products (slug, name, tagline, category, price_jpy, description, paper, diameter, height, bulb, cord, weight, assembly_level, assembly_time, image) VALUES
('kirigami-pendant-60', 'Kirigami Pendant 60', 'Twelve facets. One sheet.', 'Pendant', 38400,
 'A twelve-sided paper dome hand-folded from a single sheet of Mino washi. The crease pattern gathers at the apex and opens downward into a soft, directional glow — diffuse enough to sit above a dining table, precise enough to suggest geometry.',
 'Mino washi 45 g/m²', '600 mm', '420 mm', 'E27 · 2700 K', '2.5 m · Ink Black', '0.4 kg', 2, '45 min', '/products/productA.jpeg'),

('tsuru-table-light', 'Tsuru Table Light', 'A bird that becomes a lamp.', 'Table', 48900,
 'An origami crane perched on a brushed-brass arm, mounted on a travertine plinth. The translucent body diffuses a warm 2200K glow — part sculpture, part functional light. Entirely hand-assembled.',
 'Shirokiku 38 g/m²', '320 mm wingspan', '580 mm', 'LED · 2200 K', 'Brass braid · 1.8 m', '1.2 kg', 3, '90 min', '/products/productB.jpeg'),

('maru-globe', 'Maru Globe', 'A spiral folded into light.', 'Table', 42700,
 'A spherical origami globe whose surface is a single spiral crease radiating from the crown. Placed on a travertine tile, the Maru Globe turns any surface into a moment. The dark aluminium base grounds it.',
 'Ogawa Heavy 65 g/m²', '280 mm', '310 mm', 'E14 · 2400 K', 'Matte black · 1.5 m', '0.9 kg', 2, '60 min', '/products/productC.jpeg')

ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- Admin backend tables
-- ─────────────────────────────────────────────────────────────

-- News / journal articles
CREATE TABLE IF NOT EXISTS news (
  id           SERIAL PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  excerpt      TEXT,
  body         TEXT,                  -- markdown / plain text
  cover_image  TEXT,
  status       TEXT DEFAULT 'draft',  -- draft | published
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Discount codes (amount = percent 1-100 when kind='percent', else USD cents)
CREATE TABLE IF NOT EXISTS coupons (
  id          SERIAL PRIMARY KEY,
  code        TEXT UNIQUE NOT NULL,
  kind        TEXT NOT NULL,          -- 'percent' | 'fixed'
  amount      INTEGER NOT NULL,
  active      BOOLEAN DEFAULT true,
  starts_at   TIMESTAMPTZ,
  ends_at     TIMESTAMPTZ,
  max_uses    INTEGER,
  used_count  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Lightweight key/value store settings
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);
