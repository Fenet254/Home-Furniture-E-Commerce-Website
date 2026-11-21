import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { moodMeta, products, roomLabels } from "@/lib/catalog";
import type { Mood, Room } from "@/lib/catalog";

export const metadata = { title: "Discover — HOME" };

const kinds = [
  ["sofa", "Sofas"],
  ["armchair", "Chairs"],
  ["bed", "Beds"],
  ["coffeeTable", "Tables"],
  ["shelf", "Storage"],
  ["floorLamp", "Lighting"],
  ["rug", "Rugs"],
] as const;

// searchParams is runtime data, so it's read inside a Suspense boundary and
// the page shell can still be prerendered.
export default function Discover(props: PageProps<"/discover">) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1500px] px-6 py-16 md:px-10"><p className="eyebrow">Discover</p></div>}>
      <DiscoverContent searchParams={props.searchParams} />
    </Suspense>
  );
}

async function DiscoverContent({ searchParams }: { searchParams: PageProps<"/discover">["searchParams"] }) {
  const sp = await searchParams;
  const pick = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);
  const mood = pick("mood") as Mood | undefined;
  const room = pick("room") as Room | undefined;
  const kind = pick("kind");
  const q = pick("q")?.toLowerCase().trim();
  const sort = pick("sort");

  let list = products.filter(
    (p) =>
      (!mood || p.moods.includes(mood)) &&
      (!room || p.rooms.includes(room)) &&
      (!kind || p.kind === kind || (kind === "coffeeTable" && ["diningTable", "desk", "coffeeTable"].includes(p.kind)) || (kind === "armchair" && p.kind === "chair") || (kind === "shelf" && ["shelf", "wardrobe", "tvStand", "nightstand"].includes(p.kind))) &&
      (!q || `${p.name} ${p.tagline} ${p.kind} ${p.styles.join(" ")}`.toLowerCase().includes(q))
  );
  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);

  // keep the other filters when one chip is clicked
  const href = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    const cur = { mood, room, kind, q, sort, ...patch };
    for (const [k, v] of Object.entries(cur)) if (v) next.set(k, v);
    const s = next.toString();
    return s ? `/discover?${s}` : "/discover";
  };

  const chip = (on: boolean) =>
    `rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition ${on ? "border-espresso bg-espresso text-ivory" : "border-espresso/20 hover:border-espresso"}`;

  return (
    <div className="mx-auto max-w-[1500px] px-6 py-16 md:px-10">
      <p className="eyebrow">Discover</p>
      <h1 className="display mt-4 text-[clamp(2.4rem,6vw,5.5rem)]">
        {mood ? <span className="capitalize">{mood}.</span> : room ? roomLabels[room] + "." : "Find what fits."}
      </h1>
      <p className="mt-4 max-w-lg text-soft">
        {mood ? moodMeta[mood].line : "Explore by mood, by room, or by the kind of piece you need."}
      </p>

      <form action="/discover" className="mt-10 flex flex-wrap items-center gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search oak, linen, japandi…"
          className="w-full max-w-sm rounded-full border border-espresso/20 bg-transparent px-5 py-3 text-sm outline-none focus:border-clay"
        />
        {mood && <input type="hidden" name="mood" value={mood} />}
        {room && <input type="hidden" name="room" value={room} />}
        {kind && <input type="hidden" name="kind" value={kind} />}
        <button className="btn btn-dark !py-3">Search</button>
      </form>

      <div className="mt-10 space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-2 w-16">Mood</span>
          {(Object.keys(moodMeta) as Mood[]).map((m) => (
            <Link key={m} href={href({ mood: mood === m ? undefined : m })} className={chip(mood === m)}>{m}</Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-2 w-16">Space</span>
          {(Object.keys(roomLabels) as Room[]).filter((r) => r !== "outdoor").map((r) => (
            <Link key={r} href={href({ room: room === r ? undefined : r })} className={chip(room === r)}>{roomLabels[r]}</Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-2 w-16">Type</span>
          {kinds.map(([k, label]) => (
            <Link key={k} href={href({ kind: kind === k ? undefined : k })} className={chip(kind === k)}>{label}</Link>
          ))}
          <span className="eyebrow mx-3">Sort</span>
          <Link href={href({ sort: sort === "low" ? undefined : "low" })} className={chip(sort === "low")}>Price ↑</Link>
          <Link href={href({ sort: sort === "high" ? undefined : "high" })} className={chip(sort === "high")}>Price ↓</Link>
        </div>
      </div>

      <p className="mt-12 text-sm text-soft">{list.length} {list.length === 1 ? "piece" : "pieces"}</p>
      {list.length === 0 ? (
        <div className="py-24 text-center">
          <p className="display text-4xl">Nothing matches that combination.</p>
          <Link href="/discover" className="btn btn-dark mt-8">Clear filters</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <div key={p.slug} className={i % 3 === 1 ? "lg:mt-12" : ""}>
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
