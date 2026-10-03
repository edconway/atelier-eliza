"use client";

import { useMemo, useState } from "react";
import { polar } from "@/lib/astrology";
import {
  ASPECT_COLORS,
  PLANET_GLYPHS,
  SIGN_COLORS,
  SIGN_GLYPHS,
  titleCase,
} from "@/lib/glyphs";
import type { ChartBody, NatalChart } from "@/lib/types";
import { cn } from "@/lib/utils";

const CX = 320;
const CY = 320;
const SIGNS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
] as const;

function pt(horizon: number, r: number) {
  return polar(horizon, r, CX, CY);
}

function sector(h1: number, h2: number, rOut: number, rIn: number) {
  const a = pt(h1, rOut);
  const b = pt(h2, rOut);
  const c = pt(h2, rIn);
  const d = pt(h1, rIn);
  return `M ${a.x} ${a.y} A ${rOut} ${rOut} 0 0 0 ${b.x} ${b.y} L ${c.x} ${c.y} A ${rIn} ${rIn} 0 0 1 ${d.x} ${d.y} Z`;
}

function bodyRadius(index: number, clustered: number[]) {
  const bump = clustered.filter((i) => i < index).length;
  return 188 - bump * 16;
}

export function NatalWheel({
  chart,
  selectedId,
  onSelect,
}: {
  chart: NatalChart;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const activeId = hoverId ?? selectedId;
  const rising = chart.bodies.find((body) => body.id === "ascendant");

  const placed = useMemo(() => {
    const planets = chart.bodies.filter((body) => body.kind !== "angle");
    return planets.map((body, index, list) => {
      const clustered = list
        .map((other, otherIndex) => {
          const delta = Math.abs(
            ((body.horizon - other.horizon + 540) % 360) - 180,
          );
          return delta < 8 ? otherIndex : -1;
        })
        .filter((otherIndex) => otherIndex >= 0);
      return { body, r: bodyRadius(index, clustered) };
    });
  }, [chart.bodies]);

  const position = (id: string, r = 188) => {
    const found = placed.find((item) => item.body.id === id);
    const body = found?.body ?? chart.bodies.find((item) => item.id === id);
    if (!body) return { x: CX, y: CY };
    return pt(body.horizon, found?.r ?? r);
  };

  const activeBody = chart.bodies.find((body) => body.id === activeId);
  const related = new Set(
    chart.aspects
      .filter(
        (aspect) => aspect.from === activeId || aspect.to === activeId,
      )
      .flatMap((aspect) => [aspect.from, aspect.to]),
  );

  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <svg
        viewBox="0 0 640 640"
        role="img"
        aria-label={`Natal chart for ${chart.input.name}`}
        className="w-full drop-shadow-sm"
      >
        <defs>
          <radialGradient id="wheel-paper" cx="50%" cy="42%">
            <stop offset="0%" stopColor="#fbf6ea" />
            <stop offset="100%" stopColor="#efe4cf" />
          </radialGradient>
        </defs>
        <circle cx={CX} cy={CY} r={312} fill="url(#wheel-paper)" />
        {SIGNS.map((sign, index) => {
          const h1 = (((rising?.longitude ?? 0) - index * 30) + 360) % 360;
          const h2 = (h1 - 30 + 360) % 360;
          const mid = (h1 - 15 + 360) % 360;
          const label = pt(mid, 286);
          return (
            <g key={sign}>
              <path
                d={sector(h1, h2, 308, 258)}
                fill={SIGN_COLORS[sign]}
                fillOpacity={0.18}
                stroke="#2a2430"
                strokeOpacity={0.18}
              />
              <text
                x={label.x}
                y={label.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-glyph text-[18px]"
                fill="#2a2430"
              >
                {SIGN_GLYPHS[sign]}
              </text>
            </g>
          );
        })}
        {chart.houses.map((house) => {
          const inner = pt(house.horizon, 78);
          const outer = pt(house.horizon, 258);
          const num = pt((house.horizon - 12 + 360) % 360, 244);
          return (
            <g key={house.number}>
              <line
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke="#2a2430"
                strokeOpacity={house.number === 1 || house.number === 10 ? 0.55 : 0.18}
                strokeWidth={house.number === 1 || house.number === 10 ? 1.6 : 1}
              />
              <text
                x={num.x}
                y={num.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#6a5c4d"
                className="text-[11px]"
              >
                {house.number}
              </text>
            </g>
          );
        })}
        <circle
          cx={CX}
          cy={CY}
          r={78}
          fill="#f7f0e4"
          stroke="#c4a05a"
          strokeWidth={1.2}
        />
        <text
          x={CX}
          y={CY - 8}
          textAnchor="middle"
          className="font-heading text-[15px] fill-ink"
        >
          {chart.input.name.split(" ")[0]}
        </text>
        <text
          x={CX}
          y={CY + 12}
          textAnchor="middle"
          className="text-[10px] fill-muted-foreground"
        >
          {chart.unknownTime ? "noon chart" : "natal"}
        </text>
        {chart.aspects.map((aspect, index) => {
          const a = position(aspect.from);
          const b = position(aspect.to);
          const lit =
            !activeId ||
            aspect.from === activeId ||
            aspect.to === activeId;
          return (
            <line
              key={`${aspect.from}-${aspect.to}-${index}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={ASPECT_COLORS[aspect.type] ?? "#7a6b52"}
              strokeOpacity={lit ? 0.7 : 0.08}
              strokeWidth={lit && activeId ? 1.8 : 1}
            />
          );
        })}
        {placed.map(({ body, r }) => (
          <PlanetMark
            key={body.id}
            body={body}
            point={pt(body.horizon, r)}
            active={activeId === body.id}
            dimmed={Boolean(activeId) && activeId !== body.id && !related.has(body.id)}
            onEnter={() => setHoverId(body.id)}
            onLeave={() => setHoverId(null)}
            onToggle={() =>
              onSelect(selectedId === body.id ? null : body.id)
            }
          />
        ))}
      </svg>
      {activeBody ? (
        <div className="pointer-events-none absolute inset-x-4 bottom-3 mx-auto max-w-sm rounded-xl bg-ink/92 px-4 py-3 text-cream shadow-lg sm:inset-x-auto sm:right-3 sm:bottom-6 sm:left-auto">
          <p className="font-heading text-lg">
            <span className="font-glyph mr-2">{PLANET_GLYPHS[activeBody.id]}</span>
            {activeBody.name}
          </p>
          <p className="mt-1 text-sm text-cream/80">
            {activeBody.signDegree} {titleCase(activeBody.sign)}
            {activeBody.house ? ` · house ${activeBody.house}` : ""}
            {activeBody.retrograde ? " · retrograde" : ""}
            {activeBody.dignity ? ` · ${activeBody.dignity}` : ""}
          </p>
          <ul className="mt-2 space-y-0.5 text-xs text-cream/70">
            {chart.aspects
              .filter(
                (aspect) =>
                  aspect.from === activeBody.id || aspect.to === activeBody.id,
              )
              .slice(0, 5)
              .map((aspect) => {
                const other =
                  aspect.from === activeBody.id ? aspect.to : aspect.from;
                return (
                  <li key={`${aspect.from}-${aspect.to}`}>
                    {aspect.label} {titleCase(other)} · orb {aspect.orb}°
                  </li>
                );
              })}
          </ul>
        </div>
      ) : (
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Hover a planet — tap on a phone — to see sign, house, and aspects.
        </p>
      )}
    </div>
  );
}

function PlanetMark({
  body,
  point,
  active,
  dimmed,
  onEnter,
  onLeave,
  onToggle,
}: {
  body: ChartBody;
  point: { x: number; y: number };
  active: boolean;
  dimmed: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onToggle: () => void;
}) {
  return (
    <g
      className={cn("cursor-pointer", dimmed && "opacity-30")}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onToggle}
    >
      <circle
        cx={point.x}
        cy={point.y}
        r={active ? 16 : 13}
        fill={active ? "#2a2430" : "#fbf6ea"}
        stroke="#c4a05a"
        strokeWidth={active ? 1.8 : 1.1}
      />
      <text
        x={point.x}
        y={point.y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        className="font-glyph text-[14px]"
        fill={active ? "#fbf6ea" : "#2a2430"}
      >
        {PLANET_GLYPHS[body.id] ?? body.name[0]}
      </text>
    </g>
  );
}
