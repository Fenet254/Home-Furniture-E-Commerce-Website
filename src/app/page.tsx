import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { collections, getProduct, moodMeta, products } from "@/lib/catalog";
import type { Mood } from "@/lib/catalog";

export default function Home() {
  const featured = ["solen-sofa", "marlo-armchair", "kora-coffee-table"].map((s) => getProduct(s)!);
  const moods = Object.keys(moodMeta) as Mood[];

  return (
    <>
      <Hero />

      {/* manifesto */}
      <section className="mx-auto max-w-[1500px] px-6 py-28 md:px-10 md:py-40">
        <Reveal>
          <p className="eyebrow mb-8">02 — Philosophy</p>
          <p className="display max-w-5xl text-[clamp(2rem,5vw,4.5rem)]">
            Don&apos;t shop for furniture. <span className="text-clay">Experience</span> the home you&apos;re building.
          </p>
        </Reveal>
      </section>

      {/* RoomVerse feature */}
      <section className="bg-espresso py-24 text-ivory md:py-32">
        <div className="mx-auto grid max-w-[1500px] items-center gap-14 px-6 md:grid-cols-12 md:px-10">
          <Reveal className="md:col-span-5">
            <p className="eyebrow !text-ivory/50">03 — RoomVerse</p>
            <h2 className="display mt-5 text-[clamp(2.4rem,5vw,5rem)]">Build the room before you buy.</h2>
            <p className="mt-6 max-w-md text-ivory/70">
              Set your walls, floor and dimensions. Drag a sofa in, spin it, slide it, and walk around the result in real 3D.
              Overlaps flag themselves. Your design saves automatically.
            </p>
            <Link href="/roomverse" className="btn btn-clay mt-9">Enter RoomVerse ↗</Link>
          </Reveal>
          <Reveal delay={0.15} className="md:col-span-7">
            <div className="arch grid aspect-[16/10] place-items-center overflow-hidden bg-gradient-to-br from-sand to-[#B79F82] p-8">
              <div className="grid w-full grid-cols-3 gap-4">
                {["solen-sofa", "kora-coffee-table", "ember-floor-lamp"].map((s) => (
                  <div key={s} className="rounded-3xl bg-ivory/40 p-3 backdrop-blur">
                    <div className="text-center text-[0.6rem] uppercase tracking-[0.25em] text-espresso/70">
                      {getProduct(s)!.name.replace("The ", "")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* mood discovery */}
      <section className="mx-auto max-w-[1500px] px-6 py-28 md:px-10">
        <Reveal>
          <p className="eyebrow">04 — Shop by mood</p>
          <h2 className="display mt-4 text-[clamp(2rem,4.5vw,4rem)]">How do you want it to feel?</h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {moods.map((m, i) => (
            <Reveal key={m} delay={i * 0.04}>
              <Link
                href={`/discover?mood=${m}`}
                className="arch group flex aspect-[4/5] flex-col justify-between p-6 transition duration-500 hover:-translate-y-1.5"
                style={{ background: moodMeta[m].hex, color: ["bold", "luxurious"].includes(m) ? "#F3F0E8" : "#211E1A" }}
              >
                <span className="eyebrow !text-current opacity-70">0{i + 1}</span>
                <div>
                  <p className="display text-4xl capitalize">{m}</p>
                  <p className="mt-2 text-sm opacity-80">{moodMeta[m].line}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* featured */}
      <section className="mx-auto max-w-[1500px] px-6 pb-12 md:px-10">
        <Reveal className="flex items-end justify-between">
          <div>
            <p className="eyebrow">05 — The edit</p>
            <h2 className="display mt-4 text-[clamp(2rem,4.5vw,4rem)]">Pieces to start with.</h2>
          </div>
          <Link href="/discover" className="eyebrow hidden border-b border-espresso pb-1 hover:text-clay md:block">All furniture →</Link>
        </Reveal>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.1} className={i === 1 ? "md:mt-16" : ""}>
              <ProductCard p={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* AI + Fit */}
      <section className="mx-auto grid max-w-[1500px] gap-6 px-6 py-24 md:grid-cols-2 md:px-10">
        <Reveal>
          <Link href="/ai" className="arch block h-full bg-clay p-10 text-ivory transition hover:-translate-y-1.5 md:p-14">
            <p className="eyebrow !text-ivory/70">06 — HOME AI</p>
            <p className="display mt-6 text-5xl md:text-6xl">Your space, reimagined.</p>
            <p className="mt-6 max-w-sm text-ivory/85">
              Tell it your room, your style and your budget. Get a full plan, built only from pieces we actually sell.
            </p>
            <p className="eyebrow mt-10 !text-ivory">Design my space ↗</p>
          </Link>
        </Reveal>
        <Reveal delay={0.12}>
          <Link href="/fit" className="arch block h-full bg-sand p-10 transition hover:-translate-y-1.5 md:p-14">
            <p className="eyebrow">07 — Fit Engine</p>
            <p className="display mt-6 text-5xl md:text-6xl">Will it fit?</p>
            <p className="mt-6 max-w-sm text-soft">
              Wall space, doorways, walkways. We check the geometry so you never carry a sofa back down the stairs.
            </p>
            <p className="eyebrow mt-10">Check my room ↗</p>
          </Link>
        </Reveal>
      </section>

      {/* collections */}
      <section className="mx-auto max-w-[1500px] px-6 py-16 md:px-10">
        <Reveal>
          <p className="eyebrow">08 — Editorial collections</p>
        </Reveal>
        <div className="mt-8 divide-y divide-espresso/15 border-y border-espresso/15">
          {collections.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.05}>
              <Link href={`/shop#${c.slug}`} className="group flex flex-col justify-between gap-2 py-8 md:flex-row md:items-center">
                <p className="display text-3xl transition group-hover:translate-x-3 group-hover:text-clay md:text-5xl">{c.title}</p>
                <p className="text-soft">{c.blurb}</p>
              </Link>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-xs text-soft">{products.length} pieces in the showroom.</p>
      </section>
    </>
  );
}
