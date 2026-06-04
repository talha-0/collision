/**
 * The CO-LLISION brand glyph: two orbs (teal + red) overlapping into a bright
 * merge core — a miniature of the scroll centerpiece. Used in the navbar and
 * footer so the identity reads as "collision" everywhere.
 */
export function CollisionMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="cm-teal" cx="40%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#7ff0e0" />
          <stop offset="100%" stopColor="#0b7a83" />
        </radialGradient>
        <radialGradient id="cm-red" cx="60%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#ff7a5c" />
          <stop offset="100%" stopColor="#b01313" />
        </radialGradient>
      </defs>
      <circle cx="12.5" cy="16" r="8.2" fill="url(#cm-teal)" />
      <circle cx="19.5" cy="16" r="8.2" fill="url(#cm-red)" style={{ mixBlendMode: "screen" }} />
      <circle cx="16" cy="16" r="3" fill="#ffffff" opacity="0.95" />
    </svg>
  );
}
