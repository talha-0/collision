"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { Atom } from "./atoms";
import { collisionProgress, smoothstep, lerp } from "./progress";

type Quality = "high" | "low";

// Module-level factory: Math.random runs at call time, never during React render.
function makeBurstGeo(quality: Quality): THREE.BufferGeometry {
  const count = quality === "high" ? 1400 : 480;
  const positions = new Float32Array(count * 3);
  const dir = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    dir.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
    const r = 0.3 + Math.random() * 0.7;
    positions[i * 3] = dir.x * r;
    positions[i * 3 + 1] = dir.y * r;
    positions[i * 3 + 2] = dir.z * r;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return g;
}

const TEAL = new THREE.Color("#2ff0d6");
const RED = new THREE.Color("#ff3a1d");
const PURPLE = new THREE.Color("#9d30ff");

function Scene({ quality, reduced }: { quality: Quality; reduced: boolean }) {
  const atomA = useRef<THREE.Group>(null);
  const atomB = useRef<THREE.Group>(null);

  const coreRef = useRef<THREE.Mesh>(null);
  const coreMat = useRef<THREE.MeshBasicMaterial>(null);
  const coreGlowRef = useRef<THREE.Mesh>(null);
  const coreGlowMat = useRef<THREE.MeshBasicMaterial>(null);
  const waveRef = useRef<THREE.Mesh>(null);
  const waveMat = useRef<THREE.MeshBasicMaterial>(null);
  const burstRef = useRef<THREE.Points>(null);
  const burstMat = useRef<THREE.PointsMaterial>(null);

  const tealLight = useRef<THREE.PointLight>(null);
  const redLight = useRef<THREE.PointLight>(null);
  const mergeLight = useRef<THREE.PointLight>(null);

  const tmp = useMemo(() => new THREE.Color(), []);

  // Outward burst particle cloud — useMemo delegates to a module-level factory
  // so Math.random() runs outside the render cycle.
  const burstGeo = useMemo(() => makeBurstGeo(quality), [quality]);

  useFrame((state) => {
    const p = collisionProgress.current;
    const t = state.clock.elapsedTime;

    const approach = smoothstep(0.0, 0.5, p);
    const collide = smoothstep(0.42, 0.62, p);
    const merge = smoothstep(0.6, 0.82, p);
    const resolve = smoothstep(0.8, 1.0, p);

    const startX = 5.2;
    const contactX = 1.02;
    const atomScale = lerp(0.6, 1.0, approach) * (1 - collide);
    const bob = reduced ? 0 : 0.12; // idle vertical drift only when motion is allowed

    if (atomA.current) {
      atomA.current.position.set(lerp(-startX, -contactX, approach), Math.sin(t * 0.7) * bob * (1 - collide), 0);
      atomA.current.scale.setScalar(Math.max(0.0001, atomScale));
    }
    if (atomB.current) {
      atomB.current.position.set(lerp(startX, contactX, approach), Math.sin(t * 0.7 + 1.6) * bob * (1 - collide), 0);
      atomB.current.scale.setScalar(Math.max(0.0001, atomScale));
    }

    // Merge core: purple Hollow-Purple → cools into brand teal.
    tmp.copy(PURPLE).lerp(TEAL, resolve);
    let coreScale = merge * 1.5;
    coreScale = lerp(coreScale, 1.1, resolve);
    if (coreRef.current) {
      coreRef.current.visible = merge > 0.001;
      coreRef.current.scale.setScalar(Math.max(0.0001, coreScale));
    }
    if (coreMat.current) coreMat.current.color.copy(tmp);
    if (coreGlowRef.current) {
      coreGlowRef.current.visible = merge > 0.001;
      coreGlowRef.current.scale.setScalar(Math.max(0.0001, coreScale * (1.6 + Math.sin(t * 3) * 0.08)));
    }
    if (coreGlowMat.current) {
      coreGlowMat.current.color.copy(tmp);
      coreGlowMat.current.opacity = merge * (1 - resolve * 0.4) * 0.5;
    }

    // Expanding shockwave ring.
    const wave = smoothstep(0.58, 0.8, p);
    if (waveRef.current) {
      waveRef.current.visible = wave > 0.001 && wave < 0.999;
      const ws = lerp(0.3, 7, wave);
      waveRef.current.scale.set(ws, ws, ws);
    }
    if (waveMat.current) {
      waveMat.current.color.copy(tmp);
      waveMat.current.opacity = (1 - wave) * 0.7;
    }

    // Particle burst.
    if (burstRef.current) {
      burstRef.current.visible = merge > 0.001;
      burstRef.current.scale.setScalar(lerp(0.4, quality === "high" ? 5 : 4, merge));
      burstRef.current.rotation.y = t * 0.1;
    }
    if (burstMat.current) {
      burstMat.current.color.copy(tmp);
      burstMat.current.opacity = smoothstep(0.6, 0.7, p) * (1 - resolve) * 0.9;
    }

    // Lights track the orbs, then the merge.
    if (tealLight.current) {
      tealLight.current.position.set(lerp(-startX, -contactX, approach), 0, 2.5);
      tealLight.current.intensity = lerp(6, 1.5, collide);
    }
    if (redLight.current) {
      redLight.current.position.set(lerp(startX, contactX, approach), 0, 2.5);
      redLight.current.intensity = lerp(6, 1.5, collide);
    }
    if (mergeLight.current) {
      mergeLight.current.color.copy(tmp);
      mergeLight.current.intensity = merge * lerp(14, 4, resolve);
    }

    // Camera dolly + a brief shake at impact (shake suppressed under reduced motion).
    const cam = state.camera;
    let z = lerp(7.5, 5.4, approach);
    z = lerp(z, 4.7, merge);
    z = lerp(z, 5.8, resolve);
    const shake = reduced ? 0 : collide * (1 - merge) * 0.05;
    cam.position.set(Math.sin(t * 43) * shake, Math.cos(t * 39) * shake, z);
    cam.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight ref={tealLight} color={TEAL} distance={22} />
      <pointLight ref={redLight} color={RED} distance={22} />
      <pointLight ref={mergeLight} color={PURPLE} distance={26} intensity={0} />

      <Atom ref={atomA} color="#2ff0d6" quality={quality} reduced={reduced} />
      <Atom ref={atomB} color="#ff5a3a" flame quality={quality} reduced={reduced} />

      {/* merge core */}
      <mesh ref={coreRef} visible={false}>
        <icosahedronGeometry args={[0.55, 4]} />
        <meshBasicMaterial ref={coreMat} color={PURPLE} toneMapped={false} />
      </mesh>
      <mesh ref={coreGlowRef} visible={false}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial
          ref={coreGlowMat}
          color={PURPLE}
          transparent
          opacity={0}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* shockwave */}
      <mesh ref={waveRef} visible={false}>
        <ringGeometry args={[0.72, 0.86, 72]} />
        <meshBasicMaterial
          ref={waveMat}
          color={PURPLE}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* burst particles */}
      <points ref={burstRef} geometry={burstGeo} visible={false}>
        <pointsMaterial
          ref={burstMat}
          color={PURPLE}
          size={quality === "high" ? 0.06 : 0.08}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          sizeAttenuation
        />
      </points>

      {quality === "high" && !reduced && (
        <Sparkles count={40} scale={9} size={2} speed={0.3} color={TEAL} opacity={0.5} />
      )}
    </>
  );
}

export default function CollisionCanvas({
  quality = "high",
  reduced = false,
}: {
  quality?: Quality;
  reduced?: boolean;
}) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={quality === "low" ? [1, 1.25] : [1, 1.8]}
      camera={{ position: [0, 0, 7.5], fov: 45 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene quality={quality} reduced={reduced} />
      <EffectComposer>
        <Bloom
          mipmapBlur
          intensity={quality === "high" ? 1.15 : 0.8}
          luminanceThreshold={0.12}
          luminanceSmoothing={0.25}
          radius={0.85}
        />
      </EffectComposer>
    </Canvas>
  );
}
