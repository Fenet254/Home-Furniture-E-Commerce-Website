"use client";

import { useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { getProduct } from "@/lib/catalog";
import { overlaps } from "@/lib/fit";
import { useRoom } from "@/store/room";
import { Furniture3D } from "./Furniture3D";

function RoomShell() {
  const { width, length, floor, wall } = useRoom();
  const W = width / 100;
  const L = length / 100;
  const wallH = 2.7;

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[W, L]} />
        <meshStandardMaterial color={floor} roughness={0.9} />
      </mesh>
      {/* back wall */}
      <mesh position={[0, wallH / 2, -L / 2]} receiveShadow>
        <boxGeometry args={[W + 0.1, wallH, 0.1]} />
        <meshStandardMaterial color={wall} roughness={1} />
      </mesh>
      {/* left wall */}
      <mesh position={[-W / 2, wallH / 2, 0]} receiveShadow>
        <boxGeometry args={[0.1, wallH, L]} />
        <meshStandardMaterial color={wall} roughness={1} />
      </mesh>
      {/* a little skirting so the room feels built, not floating */}
      <mesh position={[0, 0.05, -L / 2 + 0.06]}>
        <boxGeometry args={[W, 0.1, 0.02]} />
        <meshStandardMaterial color="#F6F2E9" />
      </mesh>
      <mesh position={[-W / 2 + 0.06, 0.05, 0]}>
        <boxGeometry args={[0.02, 0.1, L]} />
        <meshStandardMaterial color="#F6F2E9" />
      </mesh>
    </group>
  );
}

function Items({ dragging, setDragging }: { dragging: string | null; setDragging: (id: string | null) => void }) {
  const { items, selected, select, moveItem } = useRoom();
  const { gl } = useThree();
  const offset = useRef({ x: 0, z: 0 });

  const boxes = items.map((it) => {
    const p = getProduct(it.slug)!;
    return { id: it.id, x: it.x, z: it.z, w: p.w, d: p.d, rot: it.rot, kind: p.kind };
  });
  const collides = new Set<string>();
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      // rugs sit under things, so they never count as a collision
      if (boxes[i].kind === "rug" || boxes[j].kind === "rug") continue;
      if (overlaps(boxes[i], boxes[j])) {
        collides.add(boxes[i].id);
        collides.add(boxes[j].id);
      }
    }
  }

  return (
    <>
      {items.map((it) => {
        const p = getProduct(it.slug);
        if (!p) return null;
        const isSel = selected === it.id;
        const bad = collides.has(it.id);
        return (
          <group
            key={it.id}
            position={[it.x / 100, 0, it.z / 100]}
            rotation-y={it.rot}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              select(it.id);
              setDragging(it.id);
              offset.current = { x: e.point.x * 100 - it.x, z: e.point.z * 100 - it.z };
              gl.domElement.style.cursor = "grabbing";
            }}
            onPointerOver={() => (gl.domElement.style.cursor = "grab")}
            onPointerOut={() => (gl.domElement.style.cursor = "auto")}
          >
            <Furniture3D kind={p.kind} w={p.w} d={p.d} h={p.h} color={it.color} glow={p.kind === "floorLamp"} />
            {(isSel || bad) && (
              <mesh position={[0, 0.015, 0]} rotation-x={-Math.PI / 2}>
                <ringGeometry args={[Math.max(p.w, p.d) / 200 * 0.8, Math.max(p.w, p.d) / 200 * 0.8 + 0.04, 48]} />
                <meshBasicMaterial color={bad ? "#C0392B" : "#B76E50"} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* invisible floor that catches the drag */}
      {dragging && (
        <mesh
          rotation-x={-Math.PI / 2}
          position={[0, 0.001, 0]}
          onPointerMove={(e: ThreeEvent<PointerEvent>) => {
            moveItem(dragging, e.point.x * 100 - offset.current.x, e.point.z * 100 - offset.current.z);
          }}
          onPointerUp={() => {
            setDragging(null);
            gl.domElement.style.cursor = "auto";
          }}
        >
          <planeGeometry args={[60, 60]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      )}
    </>
  );
}

export default function RoomVerseCanvas() {
  const [dragging, setDragging] = useState<string | null>(null);
  const select = useRoom((s) => s.select);

  return (
    <Canvas
      shadows
      camera={{ position: [4.6, 4.2, 5.6], fov: 42 }}
      onPointerMissed={() => select(null)}
      onPointerUp={() => setDragging(null)}
    >
      <color attach="background" args={["#E9E2D3"]} />
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 7, 3]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <hemisphereLight args={["#FFF3DC", "#B79F82", 0.6]} />
      <RoomShell />
      <Items dragging={dragging} setDragging={setDragging} />
      <ContactShadows position={[0, 0.002, 0]} opacity={0.35} scale={14} blur={2.4} far={3} />
      <OrbitControls
        enabled={!dragging}
        enablePan={false}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={3}
        maxDistance={13}
        target={[0, 0.6, 0]}
      />
    </Canvas>
  );
}
