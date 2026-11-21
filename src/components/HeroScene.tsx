"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Group } from "three";
import { getProduct } from "@/lib/catalog";
import { Furniture3D } from "./Furniture3D";

// The cinematic entrance: a fixed little living room, a camera that breathes,
// and hotspots that float over the real pieces.

type Spot = { slug: string; x: number; z: number; rot: number; color: string; labelY: number };

const spots: Spot[] = [
  { slug: "solen-sofa", x: 0, z: -1.5, rot: 0, color: "#D8C9B3", labelY: 1.0 },
  { slug: "kora-coffee-table", x: 0, z: 0.1, rot: 0, color: "#C9A27A", labelY: 0.6 },
  { slug: "ember-floor-lamp", x: 2.0, z: -1.7, rot: 0, color: "#EDE6D6", labelY: 1.75 },
  { slug: "dune-rug", x: 0, z: -0.3, rot: 0, color: "#B76E50", labelY: 0.1 },
  { slug: "marlo-armchair", x: -2.2, z: -0.3, rot: 0.7, color: "#7A7A4F", labelY: 1.0 },
  { slug: "sela-shelf", x: -2.9, z: -1.8, rot: 0, color: "#C9A27A", labelY: 1.9 },
];

function Rig() {
  const g = useRef<Group>(null);
  // slow, intentional drift — never snappy
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.12) * 1.1;
    camera.position.y = 1.9 + Math.sin(t * 0.09) * 0.12;
    camera.lookAt(-2.0, 0.9, -0.6); // aims left of the room so the furniture sits right of the headline
  });
  return <group ref={g} />;
}

export default function HeroScene({ active, onPick }: { active: string | null; onPick: (slug: string) => void }) {
  return (
    <Canvas shadows camera={{ position: [0, 1.9, 5.4], fov: 46 }} dpr={[1, 1.6]}>
      <color attach="background" args={["#E8DFCE"]} />
      <fog attach="fog" args={["#E8DFCE", 9, 18]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[-4, 5, 4]} intensity={1.7} color="#FFE7C2" castShadow shadow-mapSize={[1024, 1024]} />
      {/* no remote HDR on purpose: a failed download must never take the page down */}
      <hemisphereLight args={["#FFF3DC", "#B79F82", 0.7]} />

      {/* room shell */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[12, 9]} />
        <meshStandardMaterial color="#B79F82" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.7, -2.7]} receiveShadow>
        <boxGeometry args={[12, 3.4, 0.1]} />
        <meshStandardMaterial color="#E9E0CF" roughness={1} />
      </mesh>
      <mesh position={[-4, 1.7, 0.5]} receiveShadow>
        <boxGeometry args={[0.1, 3.4, 9]} />
        <meshStandardMaterial color="#DFD3BE" roughness={1} />
      </mesh>
      {/* big window glow */}
      <mesh position={[1.1, 1.65, -2.63]}>
        <planeGeometry args={[2.4, 1.9]} />
        <meshBasicMaterial color="#FFF3D6" />
      </mesh>
      <mesh position={[1.1, 1.65, -2.62]}>
        <planeGeometry args={[0.04, 1.9]} />
        <meshBasicMaterial color="#D8C9B3" />
      </mesh>

      {spots.map((s) => {
        const p = getProduct(s.slug)!;
        return (
          <group key={s.slug} position={[s.x, 0, s.z]} rotation-y={s.rot}>
            <Furniture3D kind={p.kind} w={p.w} d={p.d} h={p.h} color={s.color} glow={p.kind === "floorLamp"} />
            <Html position={[0, s.labelY, 0]} center zIndexRange={[20, 0]}>
              <button
                onClick={() => onPick(s.slug)}
                aria-label={`View ${p.name}`}
                className={`group relative grid h-9 w-9 place-items-center rounded-full border border-white/70 bg-white/25 backdrop-blur-md transition ${
                  active === s.slug ? "scale-125 bg-[#B76E50] border-[#B76E50]" : "hover:scale-110"
                }`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${active === s.slug ? "bg-white" : "bg-[#211E1A]"}`} />
                <span className="absolute inset-0 animate-ping rounded-full border border-white/70 [animation-duration:2.6s]" />
              </button>
            </Html>
          </group>
        );
      })}

      <Rig />
    </Canvas>
  );
}
