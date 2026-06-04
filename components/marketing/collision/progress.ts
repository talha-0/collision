// Shared, render-free scroll progress for the collision scene.
// ScrollTrigger writes `collisionProgress.current` (0 → 1); the R3F canvas
// reads it every frame inside useFrame. Using a module singleton ref keeps the
// canvas from re-rendering on scroll — the animation is driven imperatively and
// is fully deterministic with respect to scroll position (scrub both ways).

export const collisionProgress = { current: 0 };

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Smooth Hermite interpolation between two edges, clamped to [0,1]. */
export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
