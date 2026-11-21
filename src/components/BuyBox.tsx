"use client";

import Link from "next/link";
import { useState } from "react";
import { money, priceFor } from "@/lib/catalog";
import type { Product } from "@/lib/catalog";
import { checkFit, overall } from "@/lib/fit";
import { useShop } from "@/store/shop";
import { useHydrated } from "@/hooks/useHydrated";
import { ProductArt } from "./ProductArt";

const icon = { ok: "✓", tight: "!", no: "✕" } as const;
const tone = { ok: "text-[#4F6B3A]", tight: "text-[#A8741A]", no: "text-[#B03A2E]" } as const;

export function BuyBox({ p }: { p: Product }) {
  const [ci, setCi] = useState(0);
  const [mi, setMi] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [showFit, setShowFit] = useState(false);
  const [room, setRoom] = useState({ width: 400, length: 500, doorWidth: 90, wallSpace: 300 });

  const hydrated = useHydrated();
  const addToCart = useShop((s) => s.addToCart);
  const wished = useShop((s) => s.wishlist.includes(p.slug));
  const toggleWish = useShop((s) => s.toggleWish);

  const color = p.colors[ci];
  const material = p.materials[mi];
  const unit = priceFor(p, material.name);
  const checks = checkFit(p, room);
  const verdict = overall(checks);

  const num = (k: keyof typeof room) => (
    <label className="block text-xs text-soft">
      {{ width: "Room width", length: "Room length", doorWidth: "Door width", wallSpace: "Free wall" }[k]} (cm)
      <input
        type="number"
        min={50}
        max={2000}
        value={room[k]}
        onChange={(e) => setRoom({ ...room, [k]: Number(e.target.value) || 0 })}
        className="mt-1 w-full rounded-xl border border-espresso/20 bg-transparent px-3 py-2 text-sm text-espresso outline-none focus:border-clay"
      />
    </label>
  );

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      {/* the big picture — recolours with the swatch */}
      <div className="lg:col-span-7">
        <div className="arch sticky top-6 overflow-hidden bg-sand/60 p-4 md:p-10">
          <ProductArt kind={p.kind} color={color.hex} className="w-full transition-all duration-500" />
          <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-widest text-soft">
            <span>{color.name}</span>
            <span>{material.name}</span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <p className="eyebrow">{p.kind.replace(/([A-Z])/g, " $1")}</p>
        <h1 className="display mt-3 text-[clamp(2.4rem,5vw,4.5rem)]">{p.name.toUpperCase()}</h1>
        <p className="mt-3 text-lg text-soft">{p.tagline}</p>
        <p className="display mt-6 text-4xl">{money(unit)}</p>
        <p className="mt-6 leading-relaxed text-soft">{p.description}</p>

        <div className="mt-8">
          <p className="eyebrow mb-3">Colour — {color.name}</p>
          <div className="flex gap-3">
            {p.colors.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setCi(i)}
                aria-label={c.name}
                className={`h-9 w-9 rounded-full border-2 transition ${i === ci ? "scale-110 border-espresso" : "border-transparent ring-1 ring-espresso/20"}`}
                style={{ background: c.hex }}
              />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <p className="eyebrow mb-3">Material</p>
          <div className="flex flex-wrap gap-2">
            {p.materials.map((m, i) => (
              <button
                key={m.name}
                onClick={() => setMi(i)}
                className={`rounded-full border px-4 py-2 text-xs transition ${i === mi ? "border-espresso bg-espresso text-ivory" : "border-espresso/20 hover:border-espresso"}`}
              >
                {m.name}
                {m.priceDelta !== 0 && <span className="ml-1 opacity-60">{m.priceDelta > 0 ? "+" : "−"}{money(Math.abs(m.priceDelta))}</span>}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-soft">{material.note}</p>
        </div>

        <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-espresso/15 py-5 text-center">
          {[["Width", p.w], ["Depth", p.d], ["Height", p.h]].map(([l, v]) => (
            <div key={l as string}>
              <dt className="eyebrow">{l}</dt>
              <dd className="display mt-1 text-2xl">{v} cm</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex items-center gap-4 text-sm">
          <div className="flex items-center rounded-full border border-espresso/20">
            <button className="h-10 w-10" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Fewer">−</button>
            <span className="w-8 text-center">{qty}</span>
            <button className="h-10 w-10" onClick={() => setQty(Math.min(20, qty + 1))} aria-label="More">+</button>
          </div>
          <p className="text-soft">
            {p.stock > 10 ? "In stock" : p.stock > 0 ? `Only ${p.stock} left` : "Sold out"} · delivers in about {p.deliveryDays} days
          </p>
        </div>

        <button onClick={() => setShowFit(!showFit)} className="btn btn-line mt-6 w-full justify-center">
          Check if it fits your room {showFit ? "↑" : "↓"}
        </button>

        {showFit && (
          <div className="arch mt-4 bg-sand/50 p-5">
            <div className="grid grid-cols-2 gap-3">{(["width", "length", "doorWidth", "wallSpace"] as const).map((k) => <div key={k}>{num(k)}</div>)}</div>
            <ul className="mt-5 space-y-3">
              {checks.map((c) => (
                <li key={c.label} className="flex gap-3 text-sm">
                  <span className={`mt-0.5 font-semibold ${tone[c.verdict]}`}>{icon[c.verdict]}</span>
                  <span><strong className="font-medium">{c.label}.</strong> {c.message}</span>
                </li>
              ))}
            </ul>
            <p className={`mt-4 text-sm font-medium ${tone[verdict]}`}>
              {verdict === "ok" ? "Looks like a good fit." : verdict === "tight" ? "It can work, but check the tight spots." : "This one probably won't work as planned."}
            </p>
          </div>
        )}

        <div className="mt-4 flex gap-3">
          <button
            disabled={p.stock === 0}
            onClick={() => {
              addToCart({ slug: p.slug, color: color.name, material: material.name }, qty);
              setAdded(true);
              setTimeout(() => setAdded(false), 2000);
            }}
            className="btn btn-clay flex-1 justify-center disabled:opacity-40"
          >
            {added ? "Added ✓" : `Add to bag · ${money(unit * qty)}`}
          </button>
          <button onClick={() => toggleWish(p.slug)} className="btn btn-line" aria-label="Save">
            {hydrated && wished ? "♥ Saved" : "♡ Save"}
          </button>
        </div>
        {added && (
          <Link href="/cart" className="mt-3 block text-center text-sm text-clay underline">View your bag</Link>
        )}
      </div>
    </div>
  );
}
