"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShop } from "@/store/shop";
import { useHydrated } from "@/hooks/useHydrated";

const links = [
  { href: "/discover", label: "Discover" },
  { href: "/shop", label: "Collections" },
  { href: "/roomverse", label: "RoomVerse" },
  { href: "/ai", label: "HOME AI" },
  { href: "/compare", label: "Compare" },
];

export function Nav() {
  const path = usePathname();
  const hydrated = useHydrated();
  const count = useShop((s) => s.cart.reduce((n, l) => n + l.qty, 0));
  const wish = useShop((s) => s.wishlist.length);
  // the landing page sits on top of a full-bleed scene, so the bar floats there
  const floating = path === "/";

  return (
    <header className={`${floating ? "absolute" : "relative border-b border-espresso/10"} inset-x-0 top-0 z-50`}>
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="display text-2xl tracking-[0.3em]">
          HOME
        </Link>
        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`eyebrow transition hover:text-clay ${path.startsWith(l.href) ? "!text-clay" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/wishlist" className="eyebrow hidden hover:text-clay sm:block">
            Saved{hydrated && wish > 0 ? ` (${wish})` : ""}
          </Link>
          <Link href="/cart" className="btn btn-dark !py-2.5">
            Bag{hydrated && count > 0 ? ` · ${count}` : ""}
          </Link>
        </div>
      </div>
      {/* small screens get the same links as a scrolling strip */}
      <nav className="flex gap-6 overflow-x-auto px-6 pb-3 md:hidden">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="eyebrow whitespace-nowrap">
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
