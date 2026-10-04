/**
 * Northern-hemisphere Moon.
 * elongation 0 = new, 90 = first quarter, 180 = full, 270 = last quarter.
 * Waxing light is on the right. Waning light is on the left.
 *
 * Only the lit portion is drawn. The rest of the disc is empty so the sky
 * behind this section shows through, the way the unlit Moon disappears in the sky.
 *
 * Surface: NASA/JPL/USGS Galileo image PIA00405, public domain, shown in gray.
 */

const CX = 100;
const CY = 100;
const R = 88;

function litPath(phase: number) {
  const radiusX = Math.max(Math.abs(Math.cos(phase * 2 * Math.PI)), 0.02) * R;
  const waxing = phase <= 0.5;
  const sweep = waxing ? 1 : 0;
  const large = phase > 0.25 && phase < 0.75 ? 1 : 0;
  const top = CY - R;
  const bottom = CY + R;
  return `M ${CX} ${top} A ${R} ${R} 0 ${large} ${sweep} ${CX} ${bottom} A ${radiusX} ${R} 0 ${large} ${sweep === 0 ? 1 : 0} ${CX} ${top} Z`;
}

export function MoonVeil({ elongation }: { elongation: number }) {
  const phase = (((elongation % 360) + 360) % 360) / 360;
  const full = phase > 0.47 && phase < 0.53;
  const isNew = phase < 0.03 || phase > 0.97;
  const lightFromRight = phase <= 0.5;

  return (
    <svg
      viewBox="0 0 200 200"
      className="mx-auto aspect-square h-auto w-full max-w-sm"
      role="img"
      aria-label="The Moon at its current phase"
    >
      <defs>
        <filter id="moon-gray">
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <filter id="moon-edge" x="-8%" y="-8%" width="116%" height="116%">
          <feGaussianBlur stdDeviation="0.7" />
        </filter>
        <clipPath id="moon-disc">
          <circle cx={CX} cy={CY} r={R} />
        </clipPath>
        <linearGradient
          id="moon-shade"
          x1={lightFromRight ? "100%" : "0%"}
          y1="0%"
          x2={lightFromRight ? "42%" : "58%"}
          y2="0%"
        >
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="70%" stopColor="#000" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id="moon-limb" cx="50%" cy="50%" r="50%">
          <stop offset="72%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.45" />
        </radialGradient>
        <mask id="moon-lit" maskUnits="userSpaceOnUse">
          <rect width="200" height="200" fill="black" />
          <g filter="url(#moon-edge)">
            {full ? (
              <circle cx={CX} cy={CY} r={R} fill="white" />
            ) : isNew ? null : (
              <path d={litPath(phase)} fill="white" />
            )}
          </g>
        </mask>
      </defs>

      {!isNew && (
        <g clipPath="url(#moon-disc)" mask="url(#moon-lit)">
          <image
            href="/moon.jpg"
            x={CX - R * 1.08}
            y={CY - R * 1.08}
            width={R * 2.16}
            height={R * 2.16}
            filter="url(#moon-gray)"
          />
          <circle cx={CX} cy={CY} r={R} fill="url(#moon-shade)" />
          <circle cx={CX} cy={CY} r={R} fill="url(#moon-limb)" />
        </g>
      )}
    </svg>
  );
}
