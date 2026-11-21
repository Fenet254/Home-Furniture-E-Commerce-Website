"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { getProduct, money, priceFor } from "@/lib/catalog";
import { useShop } from "@/store/shop";
import { useHydrated } from "@/hooks/useHydrated";
import { ProductArt } from "@/components/ProductArt";

const steps = ["Address", "Delivery", "Summary", "Payment", "Done"];
const speeds = [
  { id: "standard", name: "Standard delivery", extra: 0, note: "Curbside, no assembly" },
  { id: "white", name: "White-glove", extra: 90, note: "Placed in your room, packaging removed" },
  { id: "build", name: "White-glove + assembly", extra: 160, note: "Everything built and ready to use" },
];
// No card form on purpose: wire a real provider here (Chapa, Telebirr, Stripe…)
// so card data never touches this app.
const methods = ["Pay on delivery", "Mobile money", "Card (via payment provider)"];

export default function Checkout() {
  const hydrated = useHydrated();
  const { cart, clearCart } = useShop();
  const [step, setStep] = useState(0);
  const [addr, setAddr] = useState({ name: "", phone: "", street: "", city: "" });
  const [speed, setSpeed] = useState(speeds[0].id);
  const [method, setMethod] = useState(methods[0]);
  const [order, setOrder] = useState<{ id: string; total: number; slugs: { slug: string; color: string }[]; days: number } | null>(null);

  const lines = hydrated ? cart.map((l) => ({ l, p: getProduct(l.slug)! })).filter((x) => x.p) : [];
  const subtotal = lines.reduce((n, { l, p }) => n + priceFor(p, l.material) * l.qty, 0);
  const extra = speeds.find((s) => s.id === speed)!.extra;
  const total = subtotal + extra;
  const days = Math.max(0, ...lines.map((x) => x.p.deliveryDays)) + (speed === "standard" ? 0 : 2);
  const addrOk = addr.name.trim() && addr.phone.trim().length >= 6 && addr.street.trim() && addr.city.trim();

  const place = () => {
    const id = `HM-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    setOrder({ id, total, days, slugs: lines.map(({ l }) => ({ slug: l.slug, color: l.color })) });
    clearCart();
    setStep(4);
  };

  if (hydrated && lines.length === 0 && step !== 4) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="display text-5xl">Nothing to check out.</h1>
        <Link href="/discover" className="btn btn-dark mt-8">Find something you love</Link>
      </div>
    );
  }

  const input = (k: keyof typeof addr, label: string, type = "text") => (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input type={type} value={addr[k]} onChange={(e) => setAddr({ ...addr, [k]: e.target.value })} className="mt-2 w-full rounded-xl border border-espresso/20 bg-ivory px-4 py-3 outline-none focus:border-clay" />
    </label>
  );

  return (
    <div className="mx-auto max-w-[1000px] px-6 py-16 md:px-10">
      <ol className="mb-12 flex gap-2 text-[0.65rem] uppercase tracking-widest">
        {steps.map((s, i) => (
          <li key={s} className={`flex-1 border-t-2 pt-3 ${i <= step ? "border-clay text-espresso" : "border-espresso/15 text-soft"}`}>{i + 1}. {s}</li>
        ))}
      </ol>

      {step === 0 && (
        <section className="space-y-5">
          <h1 className="display text-5xl">Where should it go?</h1>
          <div className="grid gap-5 md:grid-cols-2">{input("name", "Full name")}{input("phone", "Phone", "tel")}{input("street", "Street / area")}{input("city", "City")}</div>
          <button disabled={!addrOk} onClick={() => setStep(1)} className="btn btn-dark disabled:opacity-40">Continue</button>
        </section>
      )}

      {step === 1 && (
        <section className="space-y-5">
          <h1 className="display text-5xl">How should it arrive?</h1>
          {speeds.map((s) => (
            <label key={s.id} className={`arch flex cursor-pointer items-center justify-between p-5 ${speed === s.id ? "bg-sand" : "bg-sand/30"}`}>
              <span><input type="radio" name="speed" checked={speed === s.id} onChange={() => setSpeed(s.id)} className="mr-3 accent-[#B76E50]" /><strong className="font-medium">{s.name}</strong><span className="ml-3 text-sm text-soft">{s.note}</span></span>
              <span>{s.extra ? money(s.extra) : "Free"}</span>
            </label>
          ))}
          <div className="flex gap-3"><button onClick={() => setStep(0)} className="btn btn-line">Back</button><button onClick={() => setStep(2)} className="btn btn-dark">Continue</button></div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-6">
          <h1 className="display text-5xl">Take a last look.</h1>
          <ul className="divide-y divide-espresso/10 border-y border-espresso/10">
            {lines.map(({ l, p }) => (
              <li key={l.slug + l.color + l.material} className="flex justify-between py-4 text-sm">
                <span>{l.qty} × {p.name} <span className="text-soft">({l.color}, {l.material})</span></span>
                <span>{money(priceFor(p, l.material) * l.qty)}</span>
              </li>
            ))}
            <li className="flex justify-between py-4 text-sm"><span>Delivery to {addr.city}</span><span>{extra ? money(extra) : "Free"}</span></li>
            <li className="flex justify-between py-4 text-lg"><span>Total</span><span className="display text-3xl">{money(total)}</span></li>
          </ul>
          <div className="flex gap-3"><button onClick={() => setStep(1)} className="btn btn-line">Back</button><button onClick={() => setStep(3)} className="btn btn-dark">Continue</button></div>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-5">
          <h1 className="display text-5xl">How would you like to pay?</h1>
          {methods.map((m) => (
            <label key={m} className={`arch flex cursor-pointer items-center p-5 ${method === m ? "bg-sand" : "bg-sand/30"}`}>
              <input type="radio" name="method" checked={method === m} onChange={() => setMethod(m)} className="mr-3 accent-[#B76E50]" />{m}
            </label>
          ))}
          <p className="text-xs text-soft">This is a demo checkout — no payment is taken.</p>
          <div className="flex gap-3"><button onClick={() => setStep(2)} className="btn btn-line">Back</button><button onClick={place} className="btn btn-clay">Place order · {money(total)}</button></div>
        </section>
      )}

      {step === 4 && order && (
        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="text-center">
          <p className="eyebrow">Order {order.id}</p>
          <h1 className="display mt-4 text-[clamp(2.6rem,7vw,6rem)]">Your home is one step closer.</h1>
          <p className="mx-auto mt-5 max-w-md text-soft">We&apos;ll arrive in about {order.days} days. A calm little timeline for what happens next:</p>
          <div className="mx-auto mt-10 grid max-w-xl grid-cols-4 gap-2 text-xs">
            {["Confirmed", "Preparing", "On the road", "Delivered"].map((t, i) => (
              <div key={t}>
                <div className={`mx-auto h-3 w-3 rounded-full ${i === 0 ? "bg-clay" : "bg-espresso/20"}`} />
                <p className={`mt-2 ${i === 0 ? "text-espresso" : "text-soft"}`}>{t}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {order.slugs.map((s) => {
              const p = getProduct(s.slug)!;
              const c = p.colors.find((c) => c.name === s.color) ?? p.colors[0];
              return <div key={s.slug + s.color} className="arch w-36 bg-sand/50 p-2"><ProductArt kind={p.kind} color={c.hex} className="w-full" /></div>;
            })}
          </div>
          <p className="display mt-10 text-3xl">{money(order.total)}</p>
          <Link href="/discover" className="btn btn-dark mt-8">Keep exploring</Link>
        </motion.section>
      )}
    </div>
  );
}
