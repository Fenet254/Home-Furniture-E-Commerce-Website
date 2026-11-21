"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getProduct, money, products, roomLabels, styleLabels } from "@/lib/catalog";
import type { Room, Style } from "@/lib/catalog";
import { stylePresets, useRoom } from "@/store/room";
import { useShop } from "@/store/shop";
import { useHydrated } from "@/hooks/useHydrated";
import { overlaps } from "@/lib/fit";

const Canvas3D = dynamic(() => import("@/components/RoomVerseCanvas"), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-sm text-soft">Building your room…</div>,
});

const floors = ["#DCCFB8", "#C9A27A", "#B8A58B", "#8B6347", "#8E8A84", "#F0EADC"];
const walls = ["#F3F0E8", "#EDE6D6", "#E8CFA6", "#C9D1C2", "#D9B9A5", "#C9C4BA"];

export default function RoomVerse() {
  const hydrated = useHydrated();
  const r = useRoom();
  const addToCart = useShop((s) => s.addToCart);
  const [tab, setTab] = useState<"catalog" | "room">("catalog");
  const [msg, setMsg] = useState("");

  // open a shared design if the link carries one
  useEffect(() => {
    const m = window.location.hash.match(/d=([^&]+)/);
    if (!m) return;
    try {
      const d = JSON.parse(decodeURIComponent(escape(atob(m[1]))));
      useRoom.setState({ width: d.w, length: d.l, floor: d.f, wall: d.wl, style: d.s, roomType: d.r });
      useRoom.getState().loadItems(d.i.map((x: [string, string, number, number, number]) => ({ slug: x[0], color: x[1], x: x[2], z: x[3], rot: x[4] })));
    } catch {
      /* a broken link just opens an empty room */
    }
  }, []);

  const selected = r.items.find((i) => i.id === r.selected);
  const sp = selected ? getProduct(selected.slug) : null;
  const total = r.items.reduce((n, i) => n + (getProduct(i.slug)?.price ?? 0), 0);

  const boxes = r.items.map((i) => {
    const p = getProduct(i.slug)!;
    return { id: i.id, x: i.x, z: i.z, w: p.w, d: p.d, rot: i.rot, kind: p.kind };
  });
  const clashes = boxes.filter((a, ai) => boxes.some((b, bi) => bi !== ai && a.kind !== "rug" && b.kind !== "rug" && overlaps(a, b))).length;

  const flash = (t: string) => {
    setMsg(t);
    setTimeout(() => setMsg(""), 2200);
  };

  const share = async () => {
    const payload = { w: r.width, l: r.length, f: r.floor, wl: r.wall, s: r.style, r: r.roomType, i: r.items.map((i) => [i.slug, i.color, Math.round(i.x), Math.round(i.z), +i.rot.toFixed(2)]) };
    const url = `${window.location.origin}/roomverse#d=${btoa(unescape(encodeURIComponent(JSON.stringify(payload))))}`;
    try {
      await navigator.clipboard.writeText(url);
      flash("Share link copied");
    } catch {
      flash("Couldn't copy — your browser blocked it");
    }
  };

  const bagAll = () => {
    r.items.forEach((i) => {
      const p = getProduct(i.slug);
      if (!p) return;
      const c = p.colors.find((c) => c.hex.toLowerCase() === i.color.toLowerCase()) ?? p.colors[0];
      addToCart({ slug: p.slug, color: c.name, material: p.materials[0].name });
    });
    flash(`${r.items.length} pieces added to your bag`);
  };

  const panel = "bg-ivory border-espresso/10";

  return (
    <div className="grid h-[calc(100svh-76px)] min-h-[640px] grid-cols-1 lg:grid-cols-[300px_1fr_300px]">
      {/* LEFT */}
      <aside className={`${panel} flex max-h-[40svh] flex-col overflow-hidden border-r lg:max-h-none`}>
        <div className="flex border-b border-espresso/10 text-xs uppercase tracking-widest">
          {(["catalog", "room"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-4 ${tab === t ? "bg-espresso text-ivory" : "hover:text-clay"}`}>
              {t === "catalog" ? "Furniture" : "Room"}
            </button>
          ))}
        </div>

        {tab === "catalog" ? (
          <div className="flex-1 space-y-2 overflow-y-auto p-4">
            {products.map((p) => (
              <button
                key={p.slug}
                onClick={() => r.addItem(p.slug, p.colors[0].hex)}
                className="flex w-full items-center justify-between rounded-2xl border border-espresso/10 p-3 text-left transition hover:border-clay hover:bg-sand/30"
              >
                <span>
                  <span className="display block text-lg leading-tight">{p.name.replace("The ", "")}</span>
                  <span className="text-xs text-soft">{p.w} × {p.d} cm</span>
                </span>
                <span className="text-xs">{money(p.price)}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex-1 space-y-6 overflow-y-auto p-5 text-sm">
            <label className="block">
              <span className="eyebrow">Room type</span>
              <select value={r.roomType} onChange={(e) => r.setRoomType(e.target.value as Room)} className="mt-2 w-full rounded-xl border border-espresso/20 bg-transparent p-2.5">
                {(Object.keys(roomLabels) as Room[]).map((k) => <option key={k} value={k}>{roomLabels[k]}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="eyebrow">Style preset</span>
              <select value={r.style} onChange={(e) => r.setStyle(e.target.value as Style)} className="mt-2 w-full rounded-xl border border-espresso/20 bg-transparent p-2.5">
                {(Object.keys(styleLabels) as Style[]).map((k) => <option key={k} value={k}>{styleLabels[k]}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="eyebrow">Width — {(r.width / 100).toFixed(1)} m</span>
              <input type="range" min={250} max={900} step={10} value={r.width} onChange={(e) => r.setSize(+e.target.value, r.length)} className="mt-2 w-full" />
            </label>
            <label className="block">
              <span className="eyebrow">Length — {(r.length / 100).toFixed(1)} m</span>
              <input type="range" min={250} max={900} step={10} value={r.length} onChange={(e) => r.setSize(r.width, +e.target.value)} className="mt-2 w-full" />
            </label>
            <div>
              <span className="eyebrow">Floor</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {floors.map((c) => <button key={c} onClick={() => r.setFloor(c)} aria-label={`Floor ${c}`} className={`h-8 w-8 rounded-full border-2 ${r.floor === c ? "border-espresso" : "border-transparent ring-1 ring-espresso/20"}`} style={{ background: c }} />)}
              </div>
            </div>
            <div>
              <span className="eyebrow">Walls</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {walls.map((c) => <button key={c} onClick={() => r.setWall(c)} aria-label={`Wall ${c}`} className={`h-8 w-8 rounded-full border-2 ${r.wall === c ? "border-espresso" : "border-transparent ring-1 ring-espresso/20"}`} style={{ background: c }} />)}
              </div>
            </div>
            <button onClick={() => { r.setFloor(stylePresets[r.style].floor); r.setWall(stylePresets[r.style].wall); }} className="btn btn-line w-full justify-center !py-2.5">Reset to style colours</button>
          </div>
        )}
      </aside>

      {/* CENTRE */}
      <section className="relative min-h-[50svh] bg-sand/40">
        <Canvas3D />
        <div className="pointer-events-none absolute left-4 top-4 rounded-2xl bg-ivory/85 px-4 py-2 text-xs backdrop-blur">
          Drag pieces to move · drag empty space to orbit · scroll to zoom
        </div>
        {clashes > 0 && (
          <div className="pointer-events-none absolute left-4 top-16 rounded-2xl bg-[#B03A2E] px-4 py-2 text-xs text-ivory">
            {clashes} pieces overlap — they&apos;re outlined in red
          </div>
        )}
        {msg && <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-espresso px-5 py-2.5 text-xs text-ivory">{msg}</div>}
        {r.items.length === 0 && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <p className="display rounded-3xl bg-ivory/80 px-8 py-5 text-center text-3xl backdrop-blur">Pick a piece on the left to begin.</p>
          </div>
        )}
      </section>

      {/* RIGHT */}
      <aside className={`${panel} flex max-h-[40svh] flex-col overflow-y-auto border-l p-5 lg:max-h-none`}>
        {sp && selected ? (
          <div className="space-y-5">
            <div>
              <p className="eyebrow">Selected</p>
              <h2 className="display mt-1 text-3xl">{sp.name.replace("The ", "")}</h2>
              <p className="mt-1 text-sm text-soft">{sp.w} × {sp.d} × {sp.h} cm · {money(sp.price)}</p>
            </div>
            <div>
              <p className="eyebrow mb-2">Colour</p>
              <div className="flex gap-2">
                {sp.colors.map((c) => <button key={c.name} title={c.name} onClick={() => r.recolor(selected.id, c.hex)} className={`h-8 w-8 rounded-full border-2 ${selected.color === c.hex ? "border-espresso" : "border-transparent ring-1 ring-espresso/20"}`} style={{ background: c.hex }} />)}
              </div>
            </div>
            <div>
              <p className="eyebrow mb-2">Rotate</p>
              <div className="flex gap-2">
                <button onClick={() => r.rotateItem(selected.id, -Math.PI / 12)} className="btn btn-line flex-1 justify-center !px-2 !py-2.5">↺ 15°</button>
                <button onClick={() => r.rotateItem(selected.id, Math.PI / 12)} className="btn btn-line flex-1 justify-center !px-2 !py-2.5">↻ 15°</button>
                <button onClick={() => r.rotateItem(selected.id, Math.PI / 2)} className="btn btn-line flex-1 justify-center !px-2 !py-2.5">90°</button>
              </div>
            </div>
            <div className="text-xs text-soft">Position: {Math.round(selected.x)} cm, {Math.round(selected.z)} cm from centre</div>
            <button onClick={() => r.removeItem(selected.id)} className="btn btn-line w-full justify-center !border-[#B03A2E] !text-[#B03A2E] hover:!bg-[#B03A2E] hover:!text-ivory">Remove</button>
          </div>
        ) : (
          <p className="text-sm text-soft">Select a piece in the room to change its colour, rotate it or remove it.</p>
        )}

        <div className="mt-auto space-y-3 border-t border-espresso/10 pt-5">
          <div className="flex items-end justify-between">
            <span className="eyebrow">{hydrated ? r.items.length : 0} pieces</span>
            <span className="display text-3xl">{money(hydrated ? total : 0)}</span>
          </div>
          <button disabled={!r.items.length} onClick={bagAll} className="btn btn-clay w-full justify-center disabled:opacity-40">Add all to bag</button>
          <div className="flex gap-2">
            <button onClick={share} className="btn btn-line flex-1 justify-center !px-3 !py-2.5">Share</button>
            <button onClick={() => { r.clear(); }} className="btn btn-line flex-1 justify-center !px-3 !py-2.5">Clear</button>
          </div>
          <p className="text-center text-[0.65rem] text-soft">Your design saves automatically in this browser.</p>
        </div>
      </aside>
    </div>
  );
}
