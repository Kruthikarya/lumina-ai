import { useMemo, useState } from "react";

/**
 * <SafeImage/> — swaps to a themed fallback when the source fails to load.
 * Never shows the browser's broken-image icon. Optionally derives a nicer
 * gradient monogram fallback from a `seed` + optional `label` (initials).
 */
export function SafeImage({
  src,
  alt,
  fallback,
  seed,
  label,
  className,
  ...rest
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: string;
  seed?: string;
  label?: string;
}) {
  const [failed, setFailed] = useState(false);
  const fb = useMemo(() => {
    if (fallback) return fallback;
    if (seed || label) return gradientCoverDataUri(seed ?? alt ?? "lumina", label);
    return DEFAULT_FALLBACK;
  }, [fallback, seed, label, alt]);

  return (
    <img
      {...rest}
      src={failed || !src ? fb : src}
      alt={alt ?? ""}
      className={className}
      loading={rest.loading ?? "lazy"}
      decoding={rest.decoding ?? "async"}
      referrerPolicy={rest.referrerPolicy ?? "no-referrer"}
      onError={() => setFailed(true)}
    />
  );
}

/** Deterministic, rich cover art from a seed string. Exported for data files. */
export function gradientCoverDataUri(seed: string, label?: string) {
  const { hueA, hueB } = paletteFor(seed);
  const words = (label ?? seed).split(/[\s\-_·:•|]+/).filter(Boolean);
  const initials = words.slice(0, 2).map((s) => s[0]?.toUpperCase() ?? "").join("");
  const title = truncate(label ?? seed, 34);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='hsl(${hueA} 72% 46%)'/>
        <stop offset='0.55' stop-color='hsl(${(hueA + hueB) / 2} 62% 30%)'/>
        <stop offset='1' stop-color='hsl(${hueB} 74% 18%)'/>
      </linearGradient>
      <radialGradient id='r1' cx='0.18' cy='0.12' r='0.85'>
        <stop offset='0' stop-color='white' stop-opacity='0.30'/>
        <stop offset='1' stop-color='white' stop-opacity='0'/>
      </radialGradient>
      <radialGradient id='r2' cx='0.9' cy='0.95' r='0.7'>
        <stop offset='0' stop-color='hsl(${hueB} 90% 60%)' stop-opacity='0.45'/>
        <stop offset='1' stop-color='hsl(${hueB} 90% 60%)' stop-opacity='0'/>
      </radialGradient>
      <pattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'>
        <path d='M40 0H0V40' fill='none' stroke='white' stroke-opacity='0.07' stroke-width='1'/>
      </pattern>
    </defs>
    <rect width='800' height='450' fill='url(#g)'/>
    <rect width='800' height='450' fill='url(#grid)'/>
    <rect width='800' height='450' fill='url(#r1)'/>
    <rect width='800' height='450' fill='url(#r2)'/>
    <circle cx='690' cy='120' r='150' fill='white' fill-opacity='0.05'/>
    <circle cx='120' cy='380' r='110' fill='white' fill-opacity='0.06'/>
    <path d='M0 340 C 200 300, 300 420, 520 360 S 760 300, 800 330 L800 450 L0 450 Z' fill='white' fill-opacity='0.05'/>
    <g transform='translate(48,150)'>
      <rect x='0' y='0' width='104' height='104' rx='28' fill='white' fill-opacity='0.16'/>
      <text x='52' y='70' text-anchor='middle' font-family='ui-sans-serif,system-ui,Segoe UI,Roboto' font-size='46' font-weight='800' fill='white' fill-opacity='0.95'>${escapeXml(initials || "•")}</text>
    </g>
    <text x='48' y='320' font-family='ui-sans-serif,system-ui,Segoe UI,Roboto' font-size='34' font-weight='700' fill='white' fill-opacity='0.92'>${escapeXml(title)}</text>
    <text x='48' y='62' font-family='ui-sans-serif,system-ui,Segoe UI,Roboto' font-size='18' font-weight='600' fill='white' fill-opacity='0.65' letter-spacing='4'>LUMINA</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}

function paletteFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const hueA = h % 360;
  const hueB = (hueA + 40 + (h % 60)) % 360;
  return { a: `hsl(${hueA} 70% 45%)`, b: `hsl(${hueB} 70% 30%)`, hueA, hueB };
}

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c] as string));
}

const DEFAULT_FALLBACK = gradientCoverDataUri("lumina", "LUMINA AI");

