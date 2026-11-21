import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct } from "@/lib/catalog";
import type { Room, Style } from "@/lib/catalog";
import { overlaps } from "@/lib/fit";

export type PlacedItem = {
  id: string;
  slug: string;
  color: string; // hex
  x: number; // cm from room centre
  z: number;
  rot: number; // radians
};

// each style carries a default floor + wall so presets feel instant
export const stylePresets: Record<Style, { floor: string; wall: string }> = {
  scandinavian: { floor: "#DCCFB8", wall: "#F3F0E8" },
  minimalist: { floor: "#CFC7B8", wall: "#F6F3EC" },
  modern: { floor: "#B8A58B", wall: "#E8E1D2" },
  industrial: { floor: "#8E8A84", wall: "#C9C4BA" },
  japandi: { floor: "#C9A27A", wall: "#EDE6D6" },
  "mid-century": { floor: "#8B6347", wall: "#EBDDBF" },
  contemporary: { floor: "#A89983", wall: "#DDD5C6" },
  ethiopian: { floor: "#9A6B4B", wall: "#E8CFA6" },
};

type RoomState = {
  roomType: Room;
  style: Style;
  width: number; // cm
  length: number;
  floor: string;
  wall: string;
  items: PlacedItem[];
  selected: string | null;
  setRoomType: (r: Room) => void;
  setStyle: (s: Style) => void;
  setSize: (w: number, l: number) => void;
  setFloor: (c: string) => void;
  setWall: (c: string) => void;
  addItem: (slug: string, color: string) => void;
  moveItem: (id: string, x: number, z: number) => void;
  rotateItem: (id: string, delta: number) => void;
  recolor: (id: string, color: string) => void;
  removeItem: (id: string) => void;
  select: (id: string | null) => void;
  loadItems: (items: Omit<PlacedItem, "id">[]) => void;
  clear: () => void;
};

let counter = 0;
const newId = () => `i${Date.now().toString(36)}${(counter++).toString(36)}`;

export const useRoom = create<RoomState>()(
  persist(
    (set, get) => ({
      roomType: "living",
      style: "japandi",
      width: 450,
      length: 520,
      floor: stylePresets.japandi.floor,
      wall: stylePresets.japandi.wall,
      items: [],
      selected: null,

      setRoomType: (roomType) => set({ roomType }),
      setStyle: (style) => set({ style, floor: stylePresets[style].floor, wall: stylePresets[style].wall }),

      // when the room shrinks, nudge anything that would end up outside back in
      setSize: (width, length) =>
        set((s) => ({
          width,
          length,
          items: s.items.map((it) => ({
            ...it,
            x: Math.max(-width / 2 + 20, Math.min(width / 2 - 20, it.x)),
            z: Math.max(-length / 2 + 20, Math.min(length / 2 - 20, it.z)),
          })),
        })),

      setFloor: (floor) => set({ floor }),
      setWall: (wall) => set({ wall }),

      addItem: (slug, color) => {
        const id = newId();
        const product = getProduct(slug);
        const { items, width, length } = get();

        // Look for the first free spot, scanning from the middle of the room
        // outwards, so a new piece never lands on top of an old one.
        let spot = { x: 0, z: 0 };
        if (product) {
          const candidates: { x: number; z: number }[] = [];
          for (let z = -length / 2 + product.d / 2 + 15; z <= length / 2 - product.d / 2 - 15; z += 30) {
            for (let x = -width / 2 + product.w / 2 + 15; x <= width / 2 - product.w / 2 - 15; x += 30) {
              candidates.push({ x, z });
            }
          }
          // prefer spots toward the viewer (+z) so new pieces aren't hidden behind others
          const cost = (c: { x: number; z: number }) => Math.hypot(c.x, c.z) + (c.z < 0 ? 60 : 0);
          candidates.sort((a, b) => cost(a) - cost(b));
          const me = { w: product.w, d: product.d, rot: 0 };
          const free = candidates.find((c) =>
            product.kind === "rug" ||
            items.every((it) => {
              const other = getProduct(it.slug);
              if (!other || other.kind === "rug") return true;
              return !overlaps({ ...me, x: c.x, z: c.z }, { x: it.x, z: it.z, w: other.w, d: other.d, rot: it.rot });
            })
          );
          if (free) spot = free;
        }

        set((s) => ({ items: [...s.items, { id, slug, color, x: spot.x, z: spot.z, rot: 0 }], selected: id }));
      },

      moveItem: (id, x, z) =>
        set((s) => ({
          items: s.items.map((it) =>
            it.id === id
              ? {
                  ...it,
                  x: Math.max(-s.width / 2 + 10, Math.min(s.width / 2 - 10, x)),
                  z: Math.max(-s.length / 2 + 10, Math.min(s.length / 2 - 10, z)),
                }
              : it
          ),
        })),

      rotateItem: (id, delta) =>
        set((s) => ({ items: s.items.map((it) => (it.id === id ? { ...it, rot: it.rot + delta } : it)) })),

      recolor: (id, color) => set((s) => ({ items: s.items.map((it) => (it.id === id ? { ...it, color } : it)) })),

      removeItem: (id) => set((s) => ({ items: s.items.filter((it) => it.id !== id), selected: s.selected === id ? null : s.selected })),
      select: (selected) => set({ selected }),
      loadItems: (items) => set({ items: items.map((it) => ({ ...it, id: newId() })), selected: null }),
      clear: () => set({ items: [], selected: null }),
    }),
    {
      name: "home-roomverse",
      // selection is session-only; everything else is the saved design
      partialize: (s) => ({
        roomType: s.roomType,
        style: s.style,
        width: s.width,
        length: s.length,
        floor: s.floor,
        wall: s.wall,
        items: s.items,
      }),
    }
  )
);
