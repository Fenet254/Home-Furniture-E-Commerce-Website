"use client";

import type { Kind } from "@/lib/catalog";

// Procedural furniture. No model files needed, so the project runs out of the
// box. Swap any of these for a <useGLTF /> model once you have real assets.
// Everything works in metres; the base of each piece sits on y = 0.

type Props = {
  kind: Kind;
  w: number; // cm
  d: number;
  h: number;
  color: string;
  glow?: boolean;
};

const wood = "#9C7A58";
const dark = "#2A2622";
const brass = "#B08D57";

function Box({
  size,
  pos,
  color,
  rough = 0.85,
}: {
  size: [number, number, number];
  pos: [number, number, number];
  color: string;
  rough?: number;
}) {
  return (
    <mesh position={pos} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={rough} />
    </mesh>
  );
}

function Cyl({
  r,
  h,
  pos,
  color,
  rough = 0.8,
}: {
  r: number;
  h: number;
  pos: [number, number, number];
  color: string;
  rough?: number;
}) {
  return (
    <mesh position={pos} castShadow receiveShadow>
      <cylinderGeometry args={[r, r, h, 32]} />
      <meshStandardMaterial color={color} roughness={rough} />
    </mesh>
  );
}

export function Furniture3D({ kind, w, d, h, color, glow }: Props) {
  const W = w / 100;
  const D = d / 100;
  const H = h / 100;
  const legH = 0.12;

  switch (kind) {
    case "sofa": {
      const seatH = 0.42;
      const arm = 0.16 * Math.min(1, W / 1.8);
      return (
        <group>
          <Box size={[W, 0.1, D]} pos={[0, legH + 0.05, 0]} color={dark} />
          <Box size={[W, seatH - legH - 0.1, D * 0.9]} pos={[0, (seatH + legH + 0.1) / 2, 0.02]} color={color} />
          <Box size={[W - arm * 2, 0.14, D * 0.72]} pos={[0, seatH + 0.07, D * 0.08]} color={color} rough={0.95} />
          <Box size={[W, H - seatH, 0.22]} pos={[0, seatH + (H - seatH) / 2, -D / 2 + 0.11]} color={color} />
          <Box size={[arm, 0.26, D * 0.9]} pos={[-W / 2 + arm / 2, seatH + 0.1, 0.02]} color={color} />
          <Box size={[arm, 0.26, D * 0.9]} pos={[W / 2 - arm / 2, seatH + 0.1, 0.02]} color={color} />
          {[-1, 1].map((sx) => [-1, 1].map((sz) => <Box key={`${sx}${sz}`} size={[0.05, legH, 0.05]} pos={[sx * (W / 2 - 0.1), legH / 2, sz * (D / 2 - 0.1)]} color={wood} />))}
        </group>
      );
    }
    case "armchair":
      return (
        <group>
          <Box size={[W, 0.32, D]} pos={[0, 0.28, 0]} color={color} />
          <Box size={[W - 0.22, 0.12, D * 0.7]} pos={[0, 0.5, 0.08]} color={color} rough={0.95} />
          <Box size={[W, H - 0.4, 0.18]} pos={[0, 0.4 + (H - 0.4) / 2, -D / 2 + 0.09]} color={color} />
          <Box size={[0.12, 0.22, D * 0.85]} pos={[-W / 2 + 0.06, 0.55, 0.03]} color={color} />
          <Box size={[0.12, 0.22, D * 0.85]} pos={[W / 2 - 0.06, 0.55, 0.03]} color={color} />
          {[-1, 1].map((sx) => [-1, 1].map((sz) => <Box key={`${sx}${sz}`} size={[0.04, 0.12, 0.04]} pos={[sx * (W / 2 - 0.08), 0.06, sz * (D / 2 - 0.08)]} color={wood} />))}
        </group>
      );
    case "coffeeTable":
      return (
        <group>
          <Cyl r={Math.min(W, D) / 2} h={0.05} pos={[0, H - 0.025, 0]} color={color} rough={0.6} />
          <Cyl r={Math.min(W, D) / 2 - 0.12} h={H - 0.05} pos={[0, (H - 0.05) / 2, 0]} color={color} rough={0.7} />
        </group>
      );
    case "diningTable":
    case "desk":
      return (
        <group>
          <Box size={[W, 0.05, D]} pos={[0, H - 0.025, 0]} color={color} rough={0.6} />
          {[-1, 1].map((sx) => [-1, 1].map((sz) => <Box key={`${sx}${sz}`} size={[0.07, H - 0.05, 0.07]} pos={[sx * (W / 2 - 0.08), (H - 0.05) / 2, sz * (D / 2 - 0.08)]} color={color} />))}
        </group>
      );
    case "chair":
      return (
        <group>
          <Box size={[W, 0.04, D]} pos={[0, 0.45, 0]} color={color} />
          <Box size={[W, 0.34, 0.03]} pos={[0, 0.65, -D / 2 + 0.02]} color={color} />
          {[-1, 1].map((sx) => [-1, 1].map((sz) => <Box key={`${sx}${sz}`} size={[0.035, 0.45, 0.035]} pos={[sx * (W / 2 - 0.03), 0.225, sz * (D / 2 - 0.03)]} color={color} />))}
        </group>
      );
    case "bed": {
      const mattressH = 0.24;
      return (
        <group>
          <Box size={[W, 0.24, D]} pos={[0, 0.12, 0]} color={wood} />
          <Box size={[W - 0.06, mattressH, D - 0.2]} pos={[0, 0.24 + mattressH / 2, 0.06]} color="#EFEAE0" rough={1} />
          <Box size={[W, H - 0.1, 0.12]} pos={[0, (H - 0.1) / 2 + 0.1, -D / 2 + 0.06]} color={color} />
          <Box size={[W / 2 - 0.12, 0.12, 0.38]} pos={[-W / 4, 0.55, -D / 2 + 0.38]} color="#FBF8F1" rough={1} />
          <Box size={[W / 2 - 0.12, 0.12, 0.38]} pos={[W / 4, 0.55, -D / 2 + 0.38]} color="#FBF8F1" rough={1} />
          <Box size={[W - 0.06, 0.04, D * 0.45]} pos={[0, 0.5, D * 0.2]} color={color} rough={1} />
        </group>
      );
    }
    case "nightstand":
      return (
        <group>
          <Box size={[W, H - 0.1, D]} pos={[0, 0.1 + (H - 0.1) / 2, 0]} color={color} />
          <Box size={[W - 0.06, 0.12, 0.02]} pos={[0, H - 0.2, D / 2 + 0.005]} color={dark} />
          {[-1, 1].map((sx) => [-1, 1].map((sz) => <Box key={`${sx}${sz}`} size={[0.03, 0.1, 0.03]} pos={[sx * (W / 2 - 0.04), 0.05, sz * (D / 2 - 0.04)]} color={dark} />))}
        </group>
      );
    case "wardrobe":
      return (
        <group>
          <Box size={[W, H, D]} pos={[0, H / 2, 0]} color={color} />
          {[-0.33, 0, 0.33].map((f) => (
            <Box key={f} size={[W / 3 - 0.02, H - 0.1, 0.012]} pos={[f * W, H / 2, D / 2 + 0.006]} color={dark} rough={0.5} />
          ))}
        </group>
      );
    case "tvStand":
      return (
        <group>
          <Box size={[W, H - 0.1, D]} pos={[0, 0.1 + (H - 0.1) / 2, 0]} color={color} />
          {[-1, 1].map((sx) => <Box key={sx} size={[0.04, 0.1, D - 0.08]} pos={[sx * (W / 2 - 0.06), 0.05, 0]} color={dark} />)}
          <Box size={[1.4, 0.8, 0.04]} pos={[0, H + 0.45, 0]} color="#16141A" rough={0.3} />
        </group>
      );
    case "shelf":
      return (
        <group>
          {[-1, 1].map((sx) => <Box key={sx} size={[0.03, H, D]} pos={[sx * (W / 2 - 0.015), H / 2, 0]} color={color} />)}
          {[0.02, 0.38, 0.72, 1.06, 1.4, H - 0.02].map((y, i) => <Box key={i} size={[W, 0.03, D]} pos={[0, Math.min(y, H - 0.015), 0]} color={color} />)}
          <Box size={[0.25, 0.3, 0.2]} pos={[-0.2, 0.55, 0]} color="#B76E50" />
          <Box size={[0.3, 0.2, 0.2]} pos={[0.15, 0.9, 0]} color="#7A7A4F" />
        </group>
      );
    case "floorLamp":
      return (
        <group>
          <Cyl r={0.13} h={0.03} pos={[0, 0.015, 0]} color={dark} />
          <Cyl r={0.012} h={H - 0.35} pos={[0, (H - 0.35) / 2, 0]} color={brass} rough={0.35} />
          <mesh position={[0, H - 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.19, 0.38, 32, 1, true]} />
            <meshStandardMaterial color={color} roughness={1} side={2} emissive={glow ? "#FFD7A0" : "#000"} emissiveIntensity={glow ? 0.55 : 0} />
          </mesh>
          {glow && <pointLight position={[0, H - 0.2, 0]} intensity={2.2} distance={4} color="#FFD7A0" />}
        </group>
      );
    case "rug":
      return (
        <group>
          <Box size={[W, 0.02, D]} pos={[0, 0.01, 0]} color={color} rough={1} />
        </group>
      );
  }
}
