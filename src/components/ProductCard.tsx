"use client";

import Link from "next/link";
import { useState } from "react";
import { money } from "@/lib/catalog";
import type { Product } from "@/lib/catalog";
import { useShop } from "@/store/shop";
import { useHydrated } from "@/hooks/useHydrated";
import { ProductArt } from "./ProductArt";

export function ProductCard({ p, tone = "#E7DFCF" }: { p: Product; tone?: string }) {
  const [ci, setCi] = useState(0);
  const hydrated = useHydrated();
  const wished = useShop((s) => s.wishlist.includes(p.slug));
  const toggleWish = useShop((s) => s.toggleWish);
  const compared = useShop((s) => s.compare.includes(p.slug));
  const toggleCompare = useShop((s) => s.toggleCompare);

  return (
    <article className="group">
      <div className="arch relative overflow-hidden" style={{ background: tone }}>
        <Link href={`/shop/${p.slug}`} className="block">
          <ProductArt kind={p.kind} color={p.colors[ci].hex} className="aspect-[4/3] w-full transition duration-700 group-hover:scale-105" />
        </Link>
        <button
          onClick={() => toggleWish(p.slug)}
          aria-label="Save to wishlist"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-ivory/80 text-lg backdrop-blur transition hover:bg-clay hover:text-ivory"
        >
          {hydrated && wished ? "♥" : "♡"}
        </button>
        <button
          onClick={() => toggleCompare(p.slug)}
          className={`absolute bottom-4 left-4 rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-widest backdrop-blur transition ${
            hydrated && compared ? "bg-clay text-ivory" : "bg-ivory/80 hover:bg-espresso hover:text-ivory"
          }`}
        >
          {hydrated && compared ? "Comparing" : "+ Compare"}
        </button>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <Link href={`/shop/${p.slug}`} className="display text-2xl hover:text-clay">
            {p.name.replace("The ", "")}
          </Link>
          <p className="mt-1 text-sm text-soft">{p.tagline}</p>
        </div>
        <p className="whitespace-nowrap pt-1 text-sm">{money(p.price)}</p>
      </div>
      <div className="mt-3 flex gap-2">
        {p.colors.map((c, i) => (
          <button
            key={c.name}
            title={c.name}
            aria-label={c.name}
            onClick={() => setCi(i)}
            className={`h-4 w-4 rounded-full border transition ${i === ci ? "scale-125 border-espresso" : "border-espresso/20"}`}
            style={{ background: c.hex }}
          />
        ))}
      </div>
    </article>
  );
}
