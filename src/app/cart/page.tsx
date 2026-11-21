"use client";

import Link from "next/link";
import { useState } from "react";
import { getProduct, money, priceFor } from "@/lib/catalog";
import { useShop } from "@/store/shop";
import { useHydrated } from "@/hooks/useHydrated";
import { ProductArt } from "@/components/ProductArt";

// a few honest, simple rules — we don't want to push things nobody needs
function suggestions(slugs: string[]) {
  const kinds = new Set(slugs.map((s) => getProduct(s)?.kind));
  const out: { slug: string; why: string }[] = [];
  const add = (slug: string, why: string) => {
    if (!slugs.includes(slug) && getProduct(slug)) out.push({ slug, why });
  };
  if (kinds.has("sofa") && !kinds.has("coffeeTable")) add("kora-coffee-table", "A coffee table finishes a sofa and keeps drinks off the floor.");
  if (kinds.has("sofa") && !kinds.has("rug")) add("dune-rug", "A rug anchors the seating area and softens the room.");
  if (kinds.has("bed") && !kinds.has("nightstand")) add("nell-nightstand", "Every bed wants somewhere to put a glass of water.");
  if (kinds.has("diningTable") && !kinds.has("chair")) add("pello-chair", "Your table will need chairs to go with it.");
  if (kinds.has("armchair") && !kinds.has("floorLamp")) add("ember-floor-lamp", "A reading chair works better with its own light.");
  return out.slice(0, 2);
}

export default function Cart() {
  const hydrated = useHydrated();
  const { cart, setQty, removeLine, clearCart, addToCart, budget, setBudget } = useShop();
  const [promo, setPromo] = useState("");

  const lines = hydrated
    ? cart.map((l, i) => ({ l, i, p: getProduct(l.slug)! })).filter((x) => x.p)
    : [];

  const subtotal = lines.reduce((n, { l, p }) => n + priceFor(p, l.material) * l.qty, 0);
  // simple, transparent discount ladder; shown clearly so there are no surprises
  const bundlePct = lines.length >= 3 ? 0.05 : 0;
  const promoPct = promo.trim().toUpperCase() === "WELCOME10" ? 0.1 : 0;
  const discount = subtotal * Math.max(bundlePct, promoPct);
  const total = subtotal - discount;
  const longest = Math.max(0, ...lines.map(({ p }) => p.deliveryDays));
  const over = budget > 0 && total > budget ? Math.round(((total - budget) / budget) * 100) : 0;
  const tips = suggestions(lines.map((x) => x.l.slug));

  if (hydrated && lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="display text-5xl">Your bag is empty.</h1>
        <p className="mt-4 text-soft">Your home starts with a single piece.</p>
        <Link href="/discover" className="btn btn-dark mt-8">Discover furniture</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1300px] px-6 py-16 md:px-10">
      <p className="eyebrow">Your bag</p>
      <h1 className="display mt-4 text-[clamp(2.4rem,6vw,5rem)]">Almost home.</h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ul className="divide-y divide-espresso/10 border-y border-espresso/10">
            {lines.map(({ l, i, p }) => {
              const swatch = p.colors.find((c) => c.name === l.color) ?? p.colors[0];
              return (
                <li key={`${l.slug}${l.color}${l.material}`} className="flex gap-5 py-6">
                  <div className="arch w-32 shrink-0 bg-sand/50 p-2 md:w-44">
                    <ProductArt kind={p.kind} color={swatch.hex} className="w-full" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link href={`/shop/${p.slug}`} className="display text-2xl hover:text-clay">{p.name}</Link>
                      <p className="mt-1 text-xs text-soft">{l.color} · {l.material} · {p.w} × {p.d} × {p.h} cm</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-espresso/20 text-sm">
                        <button className="h-9 w-9" onClick={() => (l.qty > 1 ? setQty(i, l.qty - 1) : removeLine(i))} aria-label="Fewer">−</button>
                        <span className="w-7 text-center">{l.qty}</span>
                        <button className="h-9 w-9" onClick={() => setQty(i, l.qty + 1)} aria-label="More">+</button>
                      </div>
                      <div className="text-right">
                        <p>{money(priceFor(p, l.material) * l.qty)}</p>
                        <button onClick={() => removeLine(i)} className="text-xs text-soft underline hover:text-clay">Remove</button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {tips.length > 0 && (
            <div className="mt-10">
              <p className="eyebrow mb-4">Might complete the room</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {tips.map((t) => {
                  const p = getProduct(t.slug)!;
                  return (
                    <div key={t.slug} className="arch flex gap-4 bg-sand/40 p-4">
                      <ProductArt kind={p.kind} color={p.colors[0].hex} className="w-24 shrink-0" />
                      <div>
                        <p className="display text-lg">{p.name.replace("The ", "")}</p>
                        <p className="mt-1 text-xs text-soft">{t.why}</p>
                        <button onClick={() => addToCart({ slug: p.slug, color: p.colors[0].name, material: p.materials[0].name })} className="mt-2 text-xs underline hover:text-clay">
                          Add · {money(p.price)}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:col-span-4">
          <div className="arch sticky top-6 bg-espresso p-8 text-ivory">
            <p className="eyebrow !text-ivory/50">Summary</p>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-ivory/70">Subtotal</dt><dd>{money(subtotal)}</dd></div>
              {discount > 0 && (
                <div className="flex justify-between text-[#E3B592]">
                  <dt>{promoPct >= bundlePct ? "Promo code" : "Room bundle (3+ pieces)"}</dt>
                  <dd>−{money(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between"><dt className="text-ivory/70">Delivery</dt><dd>Free</dd></div>
              <div className="flex justify-between border-t border-ivory/15 pt-4 text-lg"><dt>Total</dt><dd className="display text-3xl">{money(total)}</dd></div>
            </dl>
            <p className="mt-3 text-xs text-ivory/60">Everything arrives in about {longest} days.</p>

            <label className="mt-6 block text-xs text-ivory/70">
              Promo code
              <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Try WELCOME10" className="mt-1 w-full rounded-xl border border-ivory/20 bg-transparent px-3 py-2 text-ivory outline-none focus:border-clay" />
            </label>

            <label className="mt-4 block text-xs text-ivory/70">
              My budget ({money(budget)})
              <input type="range" min={500} max={10000} step={100} value={budget} onChange={(e) => setBudget(+e.target.value)} className="mt-1 w-full" />
            </label>
            {over > 0 && <p className="mt-2 text-xs text-[#E3B592]">Your bag is {over}% above your budget.</p>}

            <Link href="/checkout" className="btn btn-clay mt-6 w-full justify-center">Checkout</Link>
            <button onClick={clearCart} className="mt-3 w-full text-center text-xs text-ivory/50 hover:text-ivory">Empty bag</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
