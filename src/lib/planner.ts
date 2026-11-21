// HOME AI — the design planner.
//
// Right now this is a deterministic engine so the project runs with zero API
// keys and never recommends something that isn't in the catalog. The
// `parseBrief` step is the natural place to plug in an LLM with structured
// output later (see README); the rest stays the same either way.

import { products, priceFor, roomLabels, styleLabels } from "./catalog";
import type { Kind, Product, Room, Style, Swatch } from "./catalog";
import { checkFit, overall } from "./fit";

export type Brief = {
  text: string;
  room: Room;
  style: Style;
  budget: number;
  width: number; // metres
  length: number; // metres
};

export type Pick = {
  product: Product;
  qty: number;
  color: Swatch;
  reason: string;
  fit: "ok" | "tight" | "no";
  alternatives: Product[];
};

export type DesignResult = {
  title: string;
  summary: string;
  picks: Pick[];
  total: number;
  budget: number;
  remaining: number;
  palette: Swatch[];
  arrangement: string[];
  reasoning: string[];
  warnings: string[];
  downgraded: string[];
  later: Pick[]; // pieces that didn't fit the budget yet — a phase two
};

const slotsByRoom: Record<Room, { kind: Kind; qty?: number; need: boolean }[]> = {
  living: [
    { kind: "sofa", need: true },
    { kind: "coffeeTable", need: true },
    { kind: "rug", need: true },
    { kind: "floorLamp", need: true },
    { kind: "tvStand", need: false },
    { kind: "armchair", need: false },
    { kind: "shelf", need: false },
  ],
  bedroom: [
    { kind: "bed", need: true },
    { kind: "nightstand", qty: 2, need: true },
    { kind: "wardrobe", need: false },
    { kind: "rug", need: true },
    { kind: "floorLamp", need: false },
  ],
  dining: [
    { kind: "diningTable", need: true },
    { kind: "chair", qty: 6, need: true },
    { kind: "rug", need: false },
    { kind: "shelf", need: false },
  ],
  office: [
    { kind: "desk", need: true },
    { kind: "chair", need: true },
    { kind: "shelf", need: true },
    { kind: "floorLamp", need: false },
  ],
  studio: [
    { kind: "sofa", need: true },
    { kind: "coffeeTable", need: true },
    { kind: "shelf", need: false },
    { kind: "floorLamp", need: true },
    { kind: "rug", need: false },
  ],
  reading: [
    { kind: "armchair", need: true },
    { kind: "floorLamp", need: true },
    { kind: "shelf", need: true },
    { kind: "rug", need: false },
  ],
  outdoor: [
    { kind: "chair", qty: 2, need: true },
    { kind: "coffeeTable", need: true },
  ],
};

const palettes: Record<Style, Swatch[]> = {
  scandinavian: [{ name: "Ivory", hex: "#F3F0E8" }, { name: "Birch", hex: "#DCCFB8" }, { name: "Slate", hex: "#6F7C85" }],
  minimalist: [{ name: "Chalk", hex: "#F3F0E8" }, { name: "Stone", hex: "#CFC7B8" }, { name: "Espresso", hex: "#211E1A" }],
  modern: [{ name: "Ivory", hex: "#F3F0E8" }, { name: "Sand", hex: "#D8C9B3" }, { name: "Clay", hex: "#B76E50" }],
  industrial: [{ name: "Concrete", hex: "#B5B0A7" }, { name: "Iron", hex: "#3B3834" }, { name: "Rust", hex: "#B76E50" }],
  japandi: [{ name: "Rice paper", hex: "#EDE6D6" }, { name: "Oak", hex: "#C9A27A" }, { name: "Moss", hex: "#7A7A4F" }],
  "mid-century": [{ name: "Walnut", hex: "#6B4A33" }, { name: "Mustard", hex: "#D9A441" }, { name: "Cream", hex: "#F3F0E8" }],
  contemporary: [{ name: "Sand", hex: "#D8C9B3" }, { name: "Olive", hex: "#7A7A4F" }, { name: "Ink", hex: "#2B3A42" }],
  ethiopian: [{ name: "Injera", hex: "#E3C9A0" }, { name: "Clay", hex: "#B76E50" }, { name: "Highland green", hex: "#5F7A4E" }],
};

// ---------- brief parsing ----------

const roomWords: [Room, RegExp][] = [
  ["bedroom", /bed ?room|sleep/i],
  ["dining", /dining|dinner/i],
  ["office", /office|workspace|work from home|desk/i],
  ["living", /living|lounge|sitting/i],
  ["reading", /reading|library|book nook/i],
  ["outdoor", /outdoor|balcony|garden|patio/i],
  ["studio", /studio|tiny/i],
];

const styleWords: [Style, RegExp][] = [
  ["japandi", /japandi|japanese|zen/i],
  ["scandinavian", /scandi|nordic/i],
  ["minimalist", /minimal/i],
  ["industrial", /industrial|loft/i],
  ["mid-century", /mid[- ]?century|retro/i],
  ["ethiopian", /ethiopia|habesha|addis/i],
  ["contemporary", /contemporary/i],
  ["modern", /modern/i],
];

export function parseBrief(text: string, overrides: Partial<Brief> = {}): Brief {
  const room = overrides.room ?? roomWords.find(([, r]) => r.test(text))?.[0] ?? "living";
  const style = overrides.style ?? styleWords.find(([, r]) => r.test(text))?.[0] ?? "modern";

  let budget = overrides.budget;
  if (!budget) {
    const m = text.match(/\$\s?([\d,]+)|([\d,]+)\s?(?:usd|dollars|\$)|budget (?:of |is )?([\d,]+)/i);
    const raw = m?.[1] ?? m?.[2] ?? m?.[3];
    budget = raw ? parseInt(raw.replace(/,/g, ""), 10) : 2000;
  }

  let width = overrides.width;
  let length = overrides.length;
  if (!width || !length) {
    const m = text.match(/(\d+(?:\.\d+)?)\s?(?:m|meters?|metres?)?\s?[x×*by]+\s?(\d+(?:\.\d+)?)/i);
    if (m) {
      width = parseFloat(m[1]);
      length = parseFloat(m[2]);
    }
  }

  return {
    text,
    room,
    style,
    budget,
    width: width && width > 0 ? width : 4,
    length: length && length > 0 ? length : 5,
  };
}

// ---------- scoring ----------

function score(p: Product, b: Brief) {
  let s = 0;
  if (p.styles.includes(b.style)) s += 4;
  if (/warm|cozy/i.test(b.text) && p.moods.some((m) => m === "warm" || m === "cozy")) s += 2;
  if (/calm|quiet|peace/i.test(b.text) && p.moods.includes("calm")) s += 2;
  if (/minimal/i.test(b.text) && p.moods.includes("minimal")) s += 2;
  if (/natural|wood|eco|sustain/i.test(b.text) && (p.moods.includes("natural") || p.eco)) s += 2;
  if (/bold|colou?r/i.test(b.text) && p.moods.includes("bold")) s += 2;
  if (p.rooms.includes(b.room)) s += 1;
  if (p.stock > 0) s += 1;
  return s;
}

function pickColor(p: Product, b: Brief): Swatch {
  const pal = palettes[b.style].map((s) => s.hex.toLowerCase());
  // prefer a swatch close to the palette; fall back to the first
  const exact = p.colors.find((c) => pal.includes(c.hex.toLowerCase()));
  if (exact) return exact;
  if (/warm|cozy/i.test(b.text)) {
    const warm = p.colors.find((c) => ["Sand", "Clay", "Oak", "Walnut", "Ivory"].includes(c.name));
    if (warm) return warm;
  }
  return p.colors[0];
}

// ---------- the main event ----------

export function design(b: Brief): DesignResult {
  const roomCm = { width: b.width * 100, length: b.length * 100 };
  const area = b.width * b.length;
  const small = area < 14;
  const slots = slotsByRoom[b.room];

  const warnings: string[] = [];
  const downgraded: string[] = [];

  // First pass: best-scoring product per slot that actually fits.
  let picks: Pick[] = [];
  for (const slot of slots) {
    const pool = products
      .filter((p) => p.kind === slot.kind)
      .map((p) => {
        const checks = checkFit(p, {
          ...roomCm,
          doorWidth: 90,
          wallSpace: Math.max(roomCm.width, roomCm.length) - 40,
        });
        return { p, v: overall(checks) };
      })
      .filter((x) => x.v !== "no")
      .sort((a, c) => score(c.p, b) - score(a.p, b) || a.p.price - c.p.price);

    if (pool.length === 0) {
      const anyOfKind = products.some((p) => p.kind === slot.kind);
      if (slot.need && anyOfKind) warnings.push(`No ${slot.kind} in the catalog fits a ${b.width} × ${b.length} m room comfortably.`);
      continue;
    }

    // skip optional slots in small rooms to avoid clutter
    if (!slot.need && small && picks.length >= 3) continue;

    const best = pool[0];
    const alternatives = pool.slice(1, 3).map((x) => x.p);
    const qty = slot.kind === "chair" && b.room === "dining" ? Math.min(6, best.p.seats ? 6 : 4) : (slot.qty ?? 1);

    picks.push({
      product: best.p,
      qty,
      color: pickColor(best.p, b),
      fit: best.v,
      alternatives,
      reason: reasonFor(best.p, b),
    });
  }

  const totalOf = (list: Pick[]) => list.reduce((n, x) => n + priceFor(x.product) * x.qty, 0);

  // Second pass: if we're over budget, swap the priciest swap-able item for a
  // cheaper alternative, then drop optional extras if we still need to.
  let guard = 0;
  while (totalOf(picks) > b.budget && guard++ < 20) {
    const swappable = picks
      .filter((x) => x.alternatives.some((a) => a.price < x.product.price))
      .sort((a, c) => priceFor(c.product) * c.qty - priceFor(a.product) * a.qty)[0];

    if (swappable) {
      const cheaper = swappable.alternatives.filter((a) => a.price < swappable.product.price).sort((a, c) => c.price - a.price)[0];
      downgraded.push(`${swappable.product.name} → ${cheaper.name} (saves ${priceFor(swappable.product) - priceFor(cheaper)} USD per piece)`);
      const idx = picks.indexOf(swappable);
      picks[idx] = {
        ...swappable,
        product: cheaper,
        color: pickColor(cheaper, b),
        reason: reasonFor(cheaper, b),
        alternatives: [swappable.product, ...swappable.alternatives.filter((a) => a.slug !== cheaper.slug)],
      };
      continue;
    }

    // nothing left to swap: drop the most expensive non-essential piece
    const essential = new Set(slots.filter((s) => s.need).map((s) => s.kind));
    const droppable = picks.filter((x) => !essential.has(x.product.kind)).sort((a, c) => priceFor(c.product) - priceFor(a.product))[0];
    if (!droppable) break;
    picks = picks.filter((x) => x !== droppable);
    downgraded.push(`Left out ${droppable.product.name} to stay in budget.`);
  }

  // Still over? Phase the purchase: keep the anchor pieces, push the rest to
  // "later", then squeeze back in whatever still fits the leftover money.
  const later: Pick[] = [];
  while (totalOf(picks) > b.budget && picks.length > 1) {
    later.unshift(picks.pop() as Pick);
  }
  for (const item of [...later]) {
    if (totalOf(picks) + priceFor(item.product) * item.qty <= b.budget) {
      picks.push(item);
      later.splice(later.indexOf(item), 1);
    }
  }
  if (later.length) {
    warnings.push(
      `The full room is more than ${b.budget.toLocaleString("en-US")} USD, so I split it into phases. Buy the pieces below first and add ${later.map((x) => x.product.name).join(", ")} when you can.`
    );
  }
  const total = totalOf(picks);

  const palette = palettes[b.style];
  const largest = [...picks].sort((a, c) => c.product.w * c.product.d - a.product.w * a.product.d)[0];

  const arrangement = arrange(b, picks);

  return {
    title: `A ${styleLabels[b.style].toLowerCase()} ${roomLabels[b.room].toLowerCase()}`,
    summary: `A ${b.width} × ${b.length} m ${roomLabels[b.room].toLowerCase()} in a ${styleLabels[b.style].toLowerCase()} mood, built around ${largest ? largest.product.name : "a few key pieces"} and kept to ${b.budget.toLocaleString("en-US")} USD.`,
    picks,
    total,
    budget: b.budget,
    remaining: b.budget - total,
    palette,
    arrangement,
    reasoning: [
      `${area.toFixed(1)} m² is ${small ? "compact, so I leaned on multi-purpose, low-profile pieces and skipped extras that would crowd the floor." : "generous enough for a full layout with proper walkways."}`,
      `Every piece was checked against the room size with the Fit Engine; anything that would dominate the floor was filtered out.`,
      `Colours follow a ${styleLabels[b.style]} palette so the room reads as one calm composition.`,
    ],
    warnings,
    downgraded,
    later,
  };
}

function reasonFor(p: Product, b: Brief) {
  const bits: string[] = [];
  if (p.styles.includes(b.style)) bits.push(`matches ${styleLabels[b.style]}`);
  if (p.eco) bits.push("sustainably sourced");
  bits.push(`${p.w} × ${p.d} cm`);
  if (p.deliveryDays <= 7) bits.push("ships fast");
  return bits.join(" · ");
}

function arrange(b: Brief, picks: Pick[]): string[] {
  const has = (k: Kind) => picks.some((x) => x.product.kind === k);
  const out: string[] = [];
  const longWall = Math.max(b.width, b.length);
  if (b.room === "living" || b.room === "studio") {
    if (has("sofa")) out.push(`Put the sofa against the longer ${longWall} m wall, facing the focal point — leave about 40 cm between it and the wall edge so it doesn't look wedged in.`);
    if (has("coffeeTable")) out.push("Place the coffee table 40–45 cm from the sofa: close enough to reach, far enough to walk around.");
    if (has("rug")) out.push("Let the rug slide under the front legs of the sofa and armchair so the group feels anchored.");
    if (has("tvStand")) out.push("Centre the media console opposite the sofa and keep the screen about 2–2.5 m from where you sit.");
    if (has("floorLamp")) out.push("Tuck the floor lamp into a corner beside the sofa for a warm pool of light at eye level.");
  } else if (b.room === "bedroom") {
    out.push("Centre the bed on the wall opposite the door so it's the first calm thing you see.");
    if (has("nightstand")) out.push("Flank the bed with a nightstand on each side, aligned with the mattress edge.");
    if (has("rug")) out.push("Slide the rug two-thirds under the bed so your feet land on it each morning.");
    if (has("wardrobe")) out.push("Keep the wardrobe on a side wall with at least 90 cm in front so the doors open fully.");
  } else if (b.room === "dining") {
    out.push("Centre the table in the room with at least 90 cm behind each chair so people can slide out.");
  } else if (b.room === "office") {
    out.push("Face the desk toward the room, not the wall, if the space allows — and put the window to your side to avoid screen glare.");
  } else {
    out.push("Group pieces loosely around one focal point and keep the main walkway at least 70 cm wide.");
  }
  return out;
}
