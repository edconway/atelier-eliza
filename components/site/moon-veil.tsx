/**
 * Northern-hemisphere view of the Moon.
 * elongation 0 = new, 90 = first quarter, 180 = full, 270 = last quarter.
 * Waxing light grows on the right; waning light remains on the left.
 */
export function MoonVeil({ elongation }: { elongation: number }) {
  const phase = (((elongation % 360) + 360) % 360) / 360;
  const radiusX = Math.max(Math.abs(Math.cos(phase * 2 * Math.PI)), 0.02);
  const waxing = phase <= 0.5;
  const sweep = waxing ? 1 : 0;
  const large = phase > 0.25 && phase < 0.75 ? 1 : 0;
  const full = phase > 0.47 && phase < 0.53;
  const isNew = phase < 0.03 || phase > 0.97;
  const lit = `M 50 6 A 44 44 0 ${large} ${sweep} 50 94 A ${radiusX * 44} 44 0 ${large} ${sweep === 0 ? 1 : 0} 50 6 Z`;

  return (
    <div className="relative mx-auto aspect-square min-h-72 w-full max-w-sm">
      <div className="absolute inset-[12%] rounded-full bg-rose/25 blur-3xl" />
      <svg viewBox="0 0 100 100" className="relative h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="moon-lit" cx="38%" cy="32%">
            <stop offset="0%" stopColor="#fffdfb" />
            <stop offset="55%" stopColor="#f6d5e3" />
            <stop offset="100%" stopColor="#e7b7cc" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="44" fill="#e4d3db" />
        {full ? (
          <circle cx="50" cy="50" r="44" fill="url(#moon-lit)" />
        ) : isNew ? null : (
          <path d={lit} fill="url(#moon-lit)" />
        )}
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="#e7c3d2"
          strokeWidth="0.6"
        />
      </svg>
    </div>
  );
}
