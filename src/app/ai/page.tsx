"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { money, roomLabels, styleLabels } from "@/lib/catalog";
import type { Room, Style } from "@/lib/catalog";
import type { Brief, DesignResult } from "@/lib/planner";
import { ProductArt } from "@/components/ProductArt";
import { useShop } from "@/store/shop";

const example = "I have a small apartment with a 4 × 5 meter living room. I want a modern, warm, minimalist space. I have a budget of $1,200.";

export default function HomeAI() {
  const [text, setText] = useState("");
  const [room, setRoom] = useState<Room | "">("");
  const [style, setStyle] = useState<Style | "">("");
  const [budget, setBudget] = useState("");
  const [out, setOut] = useState<{ brief: Brief; result: DesignResult } | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const addToCart = useShop((s) => s.addToCart);
  const [added, setAdded] = useState(false);

  const run = async () => {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, room: room || undefined, style: style || undefined, budget: budget ? Number(budget) : undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setOut(data);
      setAdded(false);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const bag = () => {
    out?.result.picks.forEach((p) => addToCart({ slug: p.product.slug, color: p.color.name, material: p.product.materials[0].name }, p.qty));
    setAdded(true);
  };

  const r = out?.result;
  const used = r ? Math.min(100, (r.total / r.budget) * 100) : 0;

  return (
    <div className="mx-auto max-w-[1300px] px-6 py-16 md:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">HOME AI</p>
        <h1 className="display mt-4 text-[clamp(2.6rem,7vw,6rem)]">YOUR SPACE, REIMAGINED.</h1>
        <p className="mt-4 text-soft">Tell us about the space you want to create.</p>
      </div>

      <div className="arch mx-auto mt-12 max-w-3xl bg-sand/50 p-6 md:p-10">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="A small living room, warm minimal…"
          className="w-full resize-none rounded-3xl border border-espresso/15 bg-ivory p-5 outline-none focus:border-clay"
        />
        <button onClick={() => setText(example)} className="mt-2 text-xs text-soft underline hover:text-clay">Use an example</button>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="eyebrow">Room</span>
            <select value={room} onChange={(e) => setRoom(e.target.value as Room)} className="mt-2 w-full rounded-xl border border-espresso/20 bg-ivory p-3 text-sm">
              <option value="">Detect from text</option>
              {(Object.keys(roomLabels) as Room[]).map((k) => <option key={k} value={k}>{roomLabels[k]}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="eyebrow">Style</span>
            <select value={style} onChange={(e) => setStyle(e.target.value as Style)} className="mt-2 w-full rounded-xl border border-espresso/20 bg-ivory p-3 text-sm">
              <option value="">Detect from text</option>
              {(Object.keys(styleLabels) as Style[]).map((k) => <option key={k} value={k}>{styleLabels[k]}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="eyebrow">Budget (USD)</span>
            <input value={budget} onChange={(e) => setBudget(e.target.value.replace(/\D/g, ""))} placeholder="1200" inputMode="numeric" className="mt-2 w-full rounded-xl border border-espresso/20 bg-ivory p-3 text-sm" />
          </label>
        </div>

        <div className="mt-8 text-center">
          <button onClick={run} disabled={busy || (!text.trim() && !room)} className="btn btn-dark disabled:opacity-40">
            {busy ? "Designing…" : "Design my space ↗"}
          </button>
          {err && <p className="mt-3 text-sm text-[#B03A2E]">{err}</p>}
        </div>
      </div>

      {r && out && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mt-20">
          <p className="eyebrow">Your design</p>
          <h2 className="display mt-3 text-[clamp(2rem,5vw,4.5rem)] first-letter:uppercase">{r.title}</h2>
          <p className="mt-4 max-w-2xl text-lg text-soft">{r.summary}</p>

          {r.warnings.length > 0 && (
            <div className="mt-8 space-y-2">
              {r.warnings.map((w) => <p key={w} className="rounded-2xl bg-clay/15 px-5 py-3 text-sm">⚠️ {w}</p>)}
            </div>
          )}

          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="eyebrow mb-5">Recommended products</p>
              <div className="grid gap-5 sm:grid-cols-2">
                {r.picks.map((p) => (
                  <article key={p.product.slug} className="arch bg-sand/40 p-4">
                    <ProductArt kind={p.product.kind} color={p.color.hex} className="h-40 w-full" />
                    <div className="mt-3 flex items-start justify-between gap-3">
                      <Link href={`/shop/${p.product.slug}`} className="display text-2xl hover:text-clay">{p.product.name.replace("The ", "")}</Link>
                      <span className="whitespace-nowrap text-sm">{p.qty > 1 ? `${p.qty} × ` : ""}{money(p.product.price)}</span>
                    </div>
                    <p className="mt-1 text-xs text-soft">{p.color.name} · {p.reason}</p>
                    {p.fit === "tight" && <p className="mt-2 text-xs text-[#A8741A]">Fits, but check the doorway.</p>}
                    {p.alternatives.length > 0 && (
                      <p className="mt-2 text-xs text-soft">Alternatives: {p.alternatives.map((a) => a.name.replace("The ", "")).join(", ")}</p>
                    )}
                  </article>
                ))}
              </div>

              {r.later.length > 0 && (
                <div className="mt-8">
                  <p className="eyebrow mb-3">Phase two — when budget allows</p>
                  <ul className="divide-y divide-espresso/10 rounded-3xl border border-espresso/10">
                    {r.later.map((p) => (
                      <li key={p.product.slug} className="flex items-center justify-between px-5 py-3 text-sm">
                        <Link href={`/shop/${p.product.slug}`} className="hover:text-clay">{p.qty > 1 ? `${p.qty} × ` : ""}{p.product.name}</Link>
                        <span>{money(p.product.price * p.qty)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-8 lg:col-span-4">
              <div className="arch bg-espresso p-7 text-ivory">
                <p className="eyebrow !text-ivory/50">Budget</p>
                <p className="display mt-2 text-5xl">{money(r.total)}</p>
                <p className="text-sm text-ivory/60">of {money(r.budget)}</p>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-ivory/15">
                  <div className="h-full rounded-full bg-clay transition-all duration-700" style={{ width: `${used}%` }} />
                </div>
                <p className="mt-3 text-sm text-ivory/70">{r.remaining >= 0 ? `${money(r.remaining)} left` : `${money(-r.remaining)} over`}</p>
                <button onClick={bag} className="btn btn-clay mt-6 w-full justify-center">{added ? "In your bag ✓" : "Add shopping list to bag"}</button>
              </div>

              <div>
                <p className="eyebrow mb-3">Colour palette</p>
                <div className="flex gap-3">
                  {r.palette.map((c) => (
                    <div key={c.hex} className="flex-1">
                      <div className="aspect-square rounded-2xl border border-espresso/10" style={{ background: c.hex }} />
                      <p className="mt-2 text-xs text-soft">{c.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-2">
            <div>
              <p className="eyebrow mb-4">Arrangement</p>
              <ol className="space-y-3 text-sm leading-relaxed text-soft">
                {r.arrangement.map((a, i) => <li key={i} className="flex gap-3"><span className="display text-clay">{i + 1}</span>{a}</li>)}
              </ol>
            </div>
            <div>
              <p className="eyebrow mb-4">Design reasoning</p>
              <ul className="space-y-3 text-sm leading-relaxed text-soft">
                {r.reasoning.map((a) => <li key={a}>— {a}</li>)}
                {r.downgraded.map((a) => <li key={a}>— {a}</li>)}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
