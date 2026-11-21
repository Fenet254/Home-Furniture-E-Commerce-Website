"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getProduct, money } from "@/lib/catalog";
import { ProductArt } from "./ProductArt";

// three.js is heavy and browser-only, so it loads after the page shell.
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-sand/60" />,
});

const words = ["A HOME THAT", "FEELS LIKE", "YOU."];

export function Hero() {
  const [active, setActive] = useState<string | null>(null);
  const product = active ? getProduct(active) : null;

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-sand">
      <div className="absolute inset-0">
        <HeroScene active={active} onPick={(s) => setActive(s === active ? null : s)} />
      </div>

      {/* warm wash so the type always has something to sit on */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ivory/85 via-ivory/30 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ivory to-transparent" />

      <div className="pointer-events-none absolute inset-0 mx-auto flex max-w-[1500px] flex-col justify-center px-6 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="eyebrow mb-6"
        >
          01 — Living
        </motion.p>
        <h1 className="display text-[clamp(2.6rem,6.4vw,6rem)]">
          {words.map((w, i) => (
            <span key={w} className="block overflow-hidden pb-1">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.35 + i * 0.14, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1 }}
          className="mt-6 max-w-sm text-soft"
        >
          Furniture. Spaces. Living. Walk into a room, tap a piece, and see how it feels before it ever reaches your door.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="pointer-events-auto mt-9 flex flex-wrap gap-3"
        >
          <Link href="/discover" className="btn btn-dark">Explore collection</Link>
          <Link href="/roomverse" className="btn btn-line">Design my room ↗</Link>
        </motion.div>
      </div>

      {/* hotspot info panel — grows out of the scene instead of changing page */}
      <AnimatePresence mode="wait">
        {product && (
          <motion.aside
            key={product.slug}
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="arch absolute bottom-10 right-4 z-20 w-[min(92vw,360px)] bg-ivory/90 p-5 shadow-2xl backdrop-blur-xl md:bottom-16 md:right-10"
          >
            <div className="arch overflow-hidden bg-sand/60">
              <ProductArt kind={product.kind} color={product.colors[0].hex} className="h-36 w-full" />
            </div>
            <p className="eyebrow mt-4">{product.kind.replace(/([A-Z])/g, " $1")}</p>
            <h2 className="display mt-1 text-3xl">{product.name}</h2>
            <p className="mt-1 text-sm text-soft">{product.tagline}</p>
            <div className="mt-4 flex items-center justify-between">
              <span>{money(product.price)}</span>
              <span className="text-xs text-soft">{product.w} × {product.d} × {product.h} cm</span>
            </div>
            <div className="mt-4 flex gap-2">
              <Link href={`/shop/${product.slug}`} className="btn btn-clay flex-1 justify-center !px-4 !py-3">View piece</Link>
              <button onClick={() => setActive(null)} className="btn btn-line !px-4 !py-3" aria-label="Close">✕</button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block">
        <p className="eyebrow">Tap the dots · scroll to enter</p>
      </div>
    </section>
  );
}
