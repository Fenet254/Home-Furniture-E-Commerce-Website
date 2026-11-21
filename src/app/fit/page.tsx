"use client";

import { useState } from "react";
import { products, money } from "@/lib/catalog";
import { checkFit, overall } from "@/lib/fit";
import type { RoomSpec } from "@/lib/fit";

const tone = { ok: "bg-[#DDE6CF] text-[#33472A]", tight: "bg-[#F1E2BC] text-[#6B4B0E]", no: "bg-[#F0CFC9] text-[#7A2118]" } as const;
const label = { ok: "Fits", tight: "Tight", no: "Won't fit" } as const;

export default function FitEngine() {
  const [room, setRoom] = useState<RoomSpec>({ width: 400, length: 500, doorWidth: 90, wallSpace: 300 });
  const [open, setOpen] = useState<string | null>(null);

  const field = (k: keyof RoomSpec, name: string) => (
    <label className="block">
      <span className="eyebrow">{name}</span>
      <input
        type="number"
        min={30}
        max={2000}
        value={room[k]}
        onChange={(e) => setRoom({ ...room, [k]: Number(e.target.value) || 0 })}
        className="mt-2 w-full rounded-xl border border-espresso/20 bg-ivory px-4 py-3 outline-none focus:border-clay"
      />
      <span className="text-xs text-soft">centimetres</span>
    </label>
  );

  const rows = products
    .map((p) => {
      const checks = checkFit(p, room);
      return { p, checks, v: overall(checks) };
    })
    .sort((a, b) => ["ok", "tight", "no"].indexOf(a.v) - ["ok", "tight", "no"].indexOf(b.v));

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10">
      <p className="eyebrow">Furniture Fit Engine</p>
      <h1 className="display mt-4 text-[clamp(2.6rem,7vw,6rem)]">Will it fit?</h1>
      <p className="mt-4 max-w-xl text-soft">Enter your room once. We check every piece in the showroom against your walls, your door and your walking space.</p>

      <div className="arch mt-12 grid gap-5 bg-sand/50 p-6 sm:grid-cols-2 md:grid-cols-4 md:p-8">
        {field("width", "Room width")}
        {field("length", "Room length")}
        {field("doorWidth", "Door width")}
        {field("wallSpace", "Free wall space")}
      </div>

      <ul className="mt-12 divide-y divide-espresso/10">
        {rows.map(({ p, checks, v }) => (
          <li key={p.slug} className="py-5">
            <button onClick={() => setOpen(open === p.slug ? null : p.slug)} className="flex w-full items-center justify-between gap-4 text-left">
              <span>
                <span className="display text-2xl">{p.name}</span>
                <span className="ml-3 text-xs text-soft">{p.w} × {p.d} × {p.h} cm · {money(p.price)}</span>
              </span>
              <span className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-widest ${tone[v]}`}>{label[v]}</span>
            </button>
            {open === p.slug && (
              <ul className="mt-4 space-y-2 pl-1 text-sm text-soft">
                {checks.map((c) => (
                  <li key={c.label}><strong className="font-medium text-espresso">{c.label}.</strong> {c.message}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
