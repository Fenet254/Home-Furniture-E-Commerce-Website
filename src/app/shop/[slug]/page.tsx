import { notFound } from "next/navigation";
import { BuyBox } from "@/components/BuyBox";
import { ProductCard } from "@/components/ProductCard";
import { getProduct, products } from "@/lib/catalog";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/shop/[slug]">) {
  const { slug } = await props.params;
  const p = getProduct(slug);
  return { title: p ? `${p.name} — HOME` : "HOME" };
}

export default async function ProductPage(props: PageProps<"/shop/[slug]">) {
  const { slug } = await props.params;
  const p = getProduct(slug);
  if (!p) notFound();

  // "goes with" = shares a style and sits in a related room, different kind
  const pairs = products
    .filter((o) => o.slug !== p.slug && o.kind !== p.kind && o.styles.some((s) => p.styles.includes(s)) && o.rooms.some((r) => p.rooms.includes(r)))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-[1500px] px-6 py-12 md:px-10">
      <BuyBox p={p} />

      <section className="mt-28 grid gap-10 border-t border-espresso/15 pt-14 md:grid-cols-3">
        <div>
          <p className="eyebrow">Materials</p>
          <ul className="mt-4 space-y-3 text-sm text-soft">
            {p.materials.map((m) => (
              <li key={m.name}><strong className="font-medium text-espresso">{m.name}.</strong> {m.note}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Sustainability</p>
          <p className="mt-4 text-sm text-soft">
            {p.eco ? "Made with certified timber and plant-based fibres. Flat packaging cuts delivery emissions." : "Made to last, with replaceable parts and a 10-year frame warranty."}
          </p>
        </div>
        <div>
          <p className="eyebrow">Delivery</p>
          <p className="mt-4 text-sm text-soft">White-glove delivery in about {p.deliveryDays} days. Assembly and old-piece removal available at checkout.</p>
        </div>
      </section>

      <section className="mt-24">
        <p className="eyebrow">Goes well with</p>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {pairs.map((o) => <ProductCard key={o.slug} p={o} />)}
        </div>
      </section>
    </div>
  );
}
