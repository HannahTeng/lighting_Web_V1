export type Product = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  price_cents: number;
  description: string;
  paper: string;
  diameter: string;
  height: string;
  bulb: string;
  cord: string;
  weight: string;
  assembly_level: number;
  assembly_time: string;
  image: string;
  in_stock: boolean;
};

/* Static fallback — used on pages that can be statically rendered */
export const PRODUCTS: Product[] = [
  {
    id: 1,
    slug: "kirigami-pendant-60",
    name: "Kirigami Pendant 60",
    tagline: "Twelve facets. One sheet.",
    category: "Pendant",
    price_cents: 3999,
    description:
      "A twelve-sided paper dome hand-folded from a single sheet of Mino washi. The crease pattern gathers at the apex and opens downward into a soft, directional glow — diffuse enough to sit above a dining table, precise enough to suggest geometry.",
    paper: "Mino washi 45 g/m²",
    diameter: "600 mm",
    height: "420 mm",
    bulb: "E27 · 2700 K",
    cord: "2.5 m · Ink Black",
    weight: "0.4 kg",
    assembly_level: 2,
    assembly_time: "45 min",
    image: "/products/productA.jpeg",
    in_stock: true,
  },
  {
    id: 2,
    slug: "tsuru-table-light",
    name: "Tsuru Table Light",
    tagline: "A bird that becomes a lamp.",
    category: "Table",
    price_cents: 3999,
    description:
      "An origami crane perched on a brushed-brass arm, mounted on a travertine plinth. The translucent body diffuses a warm 2200K glow — part sculpture, part functional light. Entirely hand-assembled.",
    paper: "Shirokiku 38 g/m²",
    diameter: "320 mm wingspan",
    height: "580 mm",
    bulb: "LED · 2200 K",
    cord: "Brass braid · 1.8 m",
    weight: "1.2 kg",
    assembly_level: 3,
    assembly_time: "90 min",
    image: "/products/productB.jpeg",
    in_stock: true,
  },
  {
    id: 3,
    slug: "maru-globe",
    name: "Maru Globe",
    tagline: "A spiral folded into light.",
    category: "Table",
    price_cents: 3999,
    description:
      "A spherical origami globe whose surface is a single spiral crease radiating from the crown. Placed on a travertine tile, the Maru Globe turns any surface into a moment. The dark aluminium base grounds it.",
    paper: "Ogawa Heavy 65 g/m²",
    diameter: "280 mm",
    height: "310 mm",
    bulb: "E14 · 2400 K",
    cord: "Matte black · 1.5 m",
    weight: "0.9 kg",
    assembly_level: 2,
    assembly_time: "60 min",
    image: "/products/productC.jpeg",
    in_stock: true,
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function formatPrice(cents: number): string {
  return "$" + (cents / 100).toFixed(2);
}
