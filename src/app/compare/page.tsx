"use client";

import Link from "next/link";
import { getProduct, money, roomLabels } from "@/lib/catalog";
import type { Product } from "@/lib/catalog";
import { useShop } from "@/store/shop";
import { useHydrated } from "@/hooks/useHydrated";
import { ProductArt } from "@/components/ProductArt";

// "suitability" is a rough floor-footprint bucket — good enough to guide a choice
const suitability = (p: Product) => {
  const area = (p.w * p.d) / 10000;
  return area < 0.5 ? "Small rooms" : area < 1.6 ? "Medium rooms" : "Large rooms";
};

export default function Compare() {
  const hydrated = useHydrated();
  const ids = useShop((s) => s.compare);
  const toggle = useShop((s) => s.toggleCompare);
  const list = hydrated ? ids.map(getProduct).filter((p): p is Product => !!p) : [];

  const rows: [string, (p: Product) => string][] = [
    ["Price", (p) => money(p.price)],
    ["Width", (p) => `${p.w} cm`],
    ["Depth", (p) => `${p.d} cm`],
    ["Height", (p) => `${p.h} cm`],
    ["Seating", (p) => (p.seats ? String(p.seats) : "—")],
    ["Materials", (p) => p.materials.map((m) => m.name).join(", ")],
    ["Colour options", (p) => String(p.colors.length)],
    ["Best for", (p) => p.rooms.slice(0, 2).map((r) => roomLabels[r]).join(", ")],
    ["Room suitability", suitability],
    ["Delivery", (p) => `${p.deliveryDays} days`],
    ["Sustainable", (p) => (p.eco ? "Yes" : "—")],
  ];

  // light highlight on the cheapest price and quickest delivery
  const cheapest = list.length ? Math.min(...list.map((p) => p.price)) : 0;
  const fastest = list.length ? Math.min(...list.map((p) => p.deliveryDays)) : 0;

  return (
    <div className="mx-auto max-w-[1300px] px-6 py-16 md:px-10">
      <p className="eyebrow">Compare</p>
      <h1 className="display mt-4 text-[clamp(2.4rem,6vw,5.5rem)]">Side by side.</h1>

      {list.length === 0 ? (
        <div className="py-24 text-center">
          <p className="display text-4xl">Nothing to compare yet.</p>
          <p className="mt-3 text-soft">Tap “+ Compare” on up to four pieces.</p>
          <Link href="/discover" className="btn btn-dark mt-8">Browse furniture</Link>
        </div>
      ) : (
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-40" />
                {list.map((p) => (
                  <th key={p.slug} className="p-3 align-top font-normal">
                    <div className="arch bg-sand/50 p-3"><ProductArt kind={p.kind} color={p.colors[0].hex} className="h-28 w-full" /></div>
                    <Link href={`/shop/${p.slug}`} className="display mt-3 block text-xl hover:text-clay">{p.name.replace("The ", "")}</Link>
                    <button onClick={() => toggle(p.slug)} className="mt-1 text-xs text-soft underline hover:text-clay">Remove</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([name, fn]) => (
                <tr key={name} className="border-t border-espresso/10">
                  <th className="eyebrow py-4 pr-4 align-top font-normal">{name}</th>
                  {list.map((p) => {
                    const val = fn(p);
                    const good = (name === "Price" && p.price === cheapest && list.length > 1) || (name === "Delivery" && p.deliveryDays === fastest && list.length > 1);
                    return (
                      <td key={p.slug} className={`p-3 text-sm ${good ? "font-medium text-clay" : ""}`}>{val}</td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
