import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-32 bg-espresso text-ivory">
      <div className="mx-auto grid max-w-[1500px] gap-12 px-6 py-20 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <p className="display text-5xl md:text-7xl">
            Furniture,
            <br />
            reimagined.
          </p>
        </div>
        <div className="space-y-3 text-sm text-ivory/70">
          <p className="eyebrow !text-ivory/50">Explore</p>
          <Link className="block hover:text-clay" href="/discover">Discover</Link>
          <Link className="block hover:text-clay" href="/roomverse">RoomVerse</Link>
          <Link className="block hover:text-clay" href="/ai">HOME AI</Link>
          <Link className="block hover:text-clay" href="/fit">Fit Engine</Link>
        </div>
        <div className="space-y-3 text-sm text-ivory/70">
          <p className="eyebrow !text-ivory/50">Your space</p>
          <Link className="block hover:text-clay" href="/wishlist">Saved pieces</Link>
          <Link className="block hover:text-clay" href="/compare">Compare</Link>
          <Link className="block hover:text-clay" href="/cart">Bag</Link>
        </div>
      </div>
      <p className="border-t border-ivory/10 px-6 py-6 text-center text-xs tracking-widest text-ivory/40">
        HOME · A DIGITAL FURNITURE SHOWROOM
      </p>
    </footer>
  );
}
