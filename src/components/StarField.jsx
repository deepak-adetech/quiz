/**
 * StarField — renders a sparse field of softly glowing stars.
 * Pure CSS + inline styles, no canvas, no deps.
 * Positions are seeded so they're stable across re-renders.
 */

// Deterministic pseudo-random from a seed
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const STARS = (() => {
  const rand = mulberry32(0xdeadbeef);
  const count = 38;
  return Array.from({ length: count }, (_, i) => {
    const size   = rand() < 0.15 ? 2 : 1;           // most 1px, a few 2px
    const glow   = rand() < 0.25;                    // 25 % get a glow halo
    const delay  = (rand() * 6).toFixed(2);          // twinkle offset
    const dur    = (3.5 + rand() * 4).toFixed(2);    // twinkle duration
    const x      = (rand() * 98).toFixed(2);         // % across
    const y      = (rand() * 92).toFixed(2);         // % down
    const blue   = rand() < 0.4;                     // 40 % tinted blue-white
    return { id: i, size, glow, delay, dur, x, y, blue };
  });
})();

export default function StarField() {
  return (
    <div className="starfield" aria-hidden="true">
      {STARS.map(s => (
        <span
          key={s.id}
          className={`star${s.glow ? ' star-glow' : ''}${s.blue ? ' star-blue' : ''}`}
          style={{
            left:             `${s.x}%`,
            top:              `${s.y}%`,
            width:            `${s.size}px`,
            height:           `${s.size}px`,
            animationDelay:   `${s.delay}s`,
            animationDuration:`${s.dur}s`,
          }}
        />
      ))}
    </div>
  );
}
