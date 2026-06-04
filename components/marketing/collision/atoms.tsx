"use client";

import { forwardRef, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Ring = { radius: number; tilt: [number, number, number]; speed: number; electrons: number };
type Quality = "high" | "low";

type AtomProps = {
  /** Rim / electron / orbital glow color. */
  color: string;
  /** Wrap the nucleus in an animated red energy shell (orb B). */
  flame?: boolean;
  quality?: Quality;
  /** When true, suppress autonomous idle motion (spin / orbit / flicker). */
  reduced?: boolean;
};

/**
 * A dark nucleus with emissive rim, tilted orbital rings, and electrons that
 * circle on each ring — reads as an atom. The parent <Scene> drives the macro
 * choreography (position / scale) via the forwarded group ref; this component
 * only owns its local, time-based life (spin, electron orbit, flame flicker).
 */
export const Atom = forwardRef<THREE.Group, AtomProps>(function Atom(
  { color, flame = false, quality = "high", reduced = false },
  ref,
) {
  const nucleusRef = useRef<THREE.Mesh>(null);
  const flameRef = useRef<THREE.Mesh>(null);
  const electronRefs = useRef<(THREE.Mesh | null)[][]>([]);

  const rings = useMemo<Ring[]>(() => {
    const base: Ring[] = [
      { radius: 1.5, tilt: [0.5, 0.2, 0], speed: 1.2, electrons: 2 },
      { radius: 1.78, tilt: [-0.7, 0.9, 0.4], speed: -0.9, electrons: 2 },
    ];
    if (quality === "high") base.push({ radius: 1.28, tilt: [0.3, -0.8, 0.6], speed: 0.7, electrons: 2 });
    return base;
  }, [quality]);

  const col = useMemo(() => new THREE.Color(color), [color]);

  useFrame((state) => {
    // Under reduced motion, freeze autonomous time so the atom is static unless scrolled.
    const t = reduced ? 0 : state.clock.elapsedTime;

    if (nucleusRef.current) {
      nucleusRef.current.rotation.y = t * 0.25;
      nucleusRef.current.rotation.x = t * 0.15;
    }

    for (let ri = 0; ri < rings.length; ri++) {
      const ring = rings[ri];
      const arr = electronRefs.current[ri];
      if (!arr) continue;
      for (let i = 0; i < ring.electrons; i++) {
        const e = arr[i];
        if (!e) continue;
        const a = (i / ring.electrons) * Math.PI * 2 + t * ring.speed;
        e.position.set(Math.cos(a) * ring.radius, Math.sin(a) * ring.radius, 0);
      }
    }

    if (flameRef.current) {
      const s = 1.32 + Math.sin(t * 7) * 0.05 + Math.sin(t * 13.3) * 0.03;
      flameRef.current.scale.setScalar(s);
      flameRef.current.rotation.set(t * 0.4, t * 0.6, 0);
    }
  });

  return (
    <group ref={ref}>
      {/* nucleus — near-black, faint emissive rim */}
      <mesh ref={nucleusRef}>
        <icosahedronGeometry args={[0.85, 3]} />
        <meshStandardMaterial color="#04060a" roughness={0.3} metalness={0.7} emissive={col} emissiveIntensity={0.35} />
      </mesh>

      {/* additive rim glow shell (cheap fresnel) */}
      <mesh scale={1.16}>
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshBasicMaterial
          color={col}
          transparent
          opacity={0.16}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* red flame shell (orb B) */}
      {flame && (
        <mesh ref={flameRef}>
          <sphereGeometry args={[0.85, 32, 32]} />
          <meshBasicMaterial
            color="#ff3a1d"
            transparent
            opacity={0.24}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* orbital rings + electrons */}
      {rings.map((ring, ri) => {
        if (!electronRefs.current[ri]) electronRefs.current[ri] = [];
        return (
          <group key={ri} rotation={ring.tilt}>
            <mesh>
              <torusGeometry args={[ring.radius, 0.01, 8, 96]} />
              <meshBasicMaterial
                color={col}
                transparent
                opacity={0.3}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
            {Array.from({ length: ring.electrons }).map((_, i) => (
              <mesh
                key={i}
                ref={(el) => {
                  electronRefs.current[ri][i] = el;
                }}
              >
                <sphereGeometry args={[0.07, 14, 14]} />
                <meshBasicMaterial color={col} toneMapped={false} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
});
