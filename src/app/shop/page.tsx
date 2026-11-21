import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { collections, getProduct } from "@/lib/catalog";

export const metadata = { title: "Collections — HOME" };

export default function Collections() {
  return (
    <div className="mx-auto max-w-[1500px] px-6 py-16 md:px-10">
      <p className="eyebrow">Collections</p>
      <h1 className="display mt-4 text-[clamp(2.4rem,6vw,5.5rem)]">Read it like a magazine.</h1>

      <div className="mt-20 space-y-32">
        {collections.map((c, i) => (
          <section key={c.slug} id={c.slug} className="scroll-mt-24">
            <div className={`flex flex-col gap-3 ${i % 2 ? "md:items-end md:text-right" : ""}`}>
              <p className="eyebrow">Issue 0{i + 1}</p>
              <h2 className="display text-[clamp(2rem,5vw,4.5rem)]">{c.title}</h2>
              <p className="max-w-md text-soft">{c.blurb}</p>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {c.items.map((s) => {
                const p = getProduct(s);
                return p ? <ProductCard key={s} p={p} tone={["#E7DFCF", "#DDD0BB", "#E9E2D3", "#D8C9B3"][i % 4]} /> : null;
              })}
            </div>
          </section>
        ))}
      </div>
      <div className="mt-24 text-center">
        <Link href="/discover" className="btn btn-dark">Browse everything</Link>
      </div>
    </div>
  );
}
