// Furniture Fit Engine — plain geometry, no magic.
// All numbers are centimetres.

import type { Product } from "./catalog";

export type RoomSpec = {
  width: number; // x
  length: number; // z
  doorWidth: number;
  wallSpace: number; // free wall run where the piece is meant to sit
};

export type Verdict = "ok" | "tight" | "no";

export type FitCheck = {
  label: string;
  verdict: Verdict;
  message: string;
};

const WALK_GAP = 60; // comfortable path between things

export function checkFit(p: Product, room: RoomSpec): FitCheck[] {
  const out: FitCheck[] = [];

  // 1) Does it fit the wall it's meant for?
  const spare = room.wallSpace - p.w;
  if (spare < 0) {
    out.push({
      label: "Wall space",
      verdict: "no",
      message: `This piece is ${p.w} cm wide. Your wall space is ${room.wallSpace} cm — it's ${Math.abs(spare)} cm too long for that spot.`,
    });
  } else if (spare < 15) {
    out.push({
      label: "Wall space",
      verdict: "tight",
      message: `It fits, but only just — about ${spare} cm of spare room. Check skirting boards and sockets.`,
    });
  } else {
    out.push({
      label: "Wall space",
      verdict: "ok",
      message: `Fits with approximately ${spare} cm of space left over.`,
    });
  }

  // 2) Can it get through the door? A box passes tilted: its slimmest side
  // has to clear the door width, and the next-slimmest has to clear a
  // standard 200 cm door height.
  const [slimmest, middle] = [p.w, p.d, p.h].sort((a, b) => a - b);
  if (p.kind === "rug") {
    out.push({
      label: "Door",
      verdict: "ok",
      message: "Rugs arrive rolled and slip through any doorway.",
    });
  } else if (slimmest + 4 > room.doorWidth || middle > 200) {
    out.push({
      label: "Door",
      verdict: "no",
      message: `Its slimmest side is about ${slimmest} cm and your door is ${room.doorWidth} cm. Consider the flat-pack or knock-down option.`,
    });
  } else if (slimmest + 12 > room.doorWidth) {
    out.push({
      label: "Door",
      verdict: "tight",
      message: `It can pass a ${room.doorWidth} cm door, but tilting will be fiddly. Measure stairs and corners too.`,
    });
  } else {
    out.push({
      label: "Door",
      verdict: "ok",
      message: `Tilted on its side it clears your ${room.doorWidth} cm door comfortably.`,
    });
  }

  // 3) Does it overwhelm the room? Floor-area ratio.
  const roomArea = room.width * room.length;
  const ratio = (p.w * p.d) / roomArea;
  if (p.kind !== "rug") {
    if (ratio > 0.4) {
      out.push({
        label: "Room balance",
        verdict: "no",
        message: `This piece alone covers ${(ratio * 100).toFixed(0)}% of the floor. The room will feel cramped.`,
      });
    } else if (ratio > 0.25) {
      out.push({
        label: "Room balance",
        verdict: "tight",
        message: `It takes up ${(ratio * 100).toFixed(0)}% of the floor — fine as the hero piece, but keep the rest light.`,
      });
    } else {
      out.push({
        label: "Room balance",
        verdict: "ok",
        message: `Uses ${(ratio * 100).toFixed(0)}% of the floor area. Plenty of breathing room.`,
      });
    }
  }

  // 4) Walking space once it's placed along the shorter wall run.
  const clear = Math.min(room.width, room.length) - p.d;
  if (p.kind !== "rug") {
    out.push({
      label: "Walkway",
      verdict: clear >= WALK_GAP * 2 ? "ok" : clear >= WALK_GAP ? "tight" : "no",
      message:
        clear >= WALK_GAP * 2
          ? `You'd keep about ${clear} cm of clear floor across the room.`
          : clear >= WALK_GAP
            ? `Only ${clear} cm of clear floor across the room. Walkable, but snug.`
            : `Only ${clear} cm of clear floor — you'd struggle to walk past it.`,
    });
  }

  return out;
}

export function overall(checks: FitCheck[]): Verdict {
  if (checks.some((c) => c.verdict === "no")) return "no";
  if (checks.some((c) => c.verdict === "tight")) return "tight";
  return "ok";
}

// Quick axis-aligned overlap test used by RoomVerse to warn about collisions.
export type Box = { x: number; z: number; w: number; d: number; rot: number };

export function footprint(b: Box) {
  // when rotated near a quarter turn, swap width and depth
  const quarter = Math.abs(Math.round(b.rot / (Math.PI / 2))) % 2 === 1;
  const w = quarter ? b.d : b.w;
  const d = quarter ? b.w : b.d;
  return { minX: b.x - w / 2, maxX: b.x + w / 2, minZ: b.z - d / 2, maxZ: b.z + d / 2 };
}

export function overlaps(a: Box, b: Box) {
  const A = footprint(a);
  const B = footprint(b);
  return A.minX < B.maxX && A.maxX > B.minX && A.minZ < B.maxZ && A.maxZ > B.minZ;
}
