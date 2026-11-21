"use client";

import Link from "next/link";
import { getProduct, money } from "@/lib/catalog";
import type { Product } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { useShop } from "@/store/shop";
import { useHydrated } from "@/hooks/useHydrated";

export default function Wishlist() {
  const hydrated = useHydrated();
  const wishlist = useShop((s) => s.wishlist);
  const addToCart = useShop((s) => s.addToCart);
  const list = hydrated ? wishlist.map(getProduct).filter((p): p is Product => !!p) : [];
  const total = list.reduce((n, p) => n + p.price, 0);

  return (
    <div className="mx-auto max-w-[1500px] px-6 py-16 md:px-10">
      <p className="eyebrow">My collection</p>
      <h1 className="display mt-4 text-[clamp(2.4rem,6vw,5.5rem)]">Saved for later.</h1>

      {list.length === 0 ? (
        <div className="py-24 text-center">
          <p className="display text-4xl">Nothing saved yet.</p>
          <Link href="/discover" className="btn btn-dark mt-8">Start exploring</Link>
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <p className="text-soft">{list.length} pieces · {money(total)} together</p>
            <button
              onClick={() => list.forEach((p) => addToCart({ slug: p.slug, color: p.colors[0].name, material: p.materials[0].name }))}
              className="btn btn-clay !py-2.5"
            >
              Turn into a bag
            </button>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((p) => <ProductCard key={p.slug} p={p} />)}
          </div>
        </>
      )}
    </div>
  );
}
