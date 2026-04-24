import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group flex flex-col gap-3.5 cursor-pointer">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] border border-[rgba(60,58,54,0.12)] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.04)] bg-bg-alt">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute top-3 left-3 font-mono text-[9.5px] tracking-[0.14em] uppercase bg-bg-alt/90 text-ink px-2 py-1 rounded-[2px] border border-[rgba(60,58,54,0.08)]">
          {product.category}
        </span>
      </div>
      <div className="flex justify-between items-baseline">
        <div>
          <div className="font-serif text-[19px] leading-tight">{product.name}</div>
          <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-ink-soft mt-0.5">
            {product.paper}
          </div>
        </div>
        <div className="font-serif text-[19px] shrink-0">{formatPrice(product.price_jpy)}</div>
      </div>
    </Link>
  );
}
