import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  slug: string;
  color: string;
  material: string;
  qty: number;
};

type ShopState = {
  cart: CartLine[];
  wishlist: string[];
  compare: string[];
  budget: number;
  addToCart: (line: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (i: number, qty: number) => void;
  removeLine: (i: number) => void;
  clearCart: () => void;
  toggleWish: (slug: string) => void;
  toggleCompare: (slug: string) => void;
  setBudget: (n: number) => void;
};

export const useShop = create<ShopState>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      compare: [],
      budget: 3000,

      addToCart: (line, qty = 1) =>
        set((s) => {
          const i = s.cart.findIndex(
            (l) => l.slug === line.slug && l.color === line.color && l.material === line.material
          );
          if (i >= 0) {
            const next = [...s.cart];
            next[i] = { ...next[i], qty: next[i].qty + qty };
            return { cart: next };
          }
          return { cart: [...s.cart, { ...line, qty }] };
        }),

      setQty: (i, qty) =>
        set((s) => ({
          cart: s.cart.map((l, idx) => (idx === i ? { ...l, qty: Math.max(1, Math.min(20, qty)) } : l)),
        })),

      removeLine: (i) => set((s) => ({ cart: s.cart.filter((_, idx) => idx !== i) })),
      clearCart: () => set({ cart: [] }),

      toggleWish: (slug) =>
        set((s) => ({
          wishlist: s.wishlist.includes(slug) ? s.wishlist.filter((x) => x !== slug) : [...s.wishlist, slug],
        })),

      // the comparison tray tops out at four, like the brief says
      toggleCompare: (slug) =>
        set((s) => {
          if (s.compare.includes(slug)) return { compare: s.compare.filter((x) => x !== slug) };
          if (s.compare.length >= 4) return s;
          return { compare: [...s.compare, slug] };
        }),

      setBudget: (n) => set({ budget: n }),
    }),
    { name: "home-shop" }
  )
);
