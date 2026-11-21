import type { Kind } from "@/lib/catalog";

// Illustrated product "photography". Every piece is drawn from the product's
// own colour, so picking a swatch recolours the picture instantly.
// Replace with real <Image /> assets when you have them.

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, v + amt));
  const r = c(n >> 16);
  const g = c((n >> 8) & 255);
  const b = c(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

export function ProductArt({ kind, color, className = "" }: { kind: Kind; color: string; className?: string }) {
  const dark = shade(color, -38);
  const light = shade(color, 24);
  const leg = "#2A2622";

  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label={`${kind} illustration`}>
      <ellipse cx="200" cy="262" rx="150" ry="12" fill="#211E1A" opacity="0.12" />
      {kind === "sofa" && (
        <g>
          <rect x="60" y="120" width="280" height="80" rx="18" fill={dark} />
          <rect x="40" y="145" width="46" height="85" rx="16" fill={color} />
          <rect x="314" y="145" width="46" height="85" rx="16" fill={color} />
          <rect x="82" y="168" width="236" height="52" rx="12" fill={light} />
          <line x1="200" y1="170" x2="200" y2="218" stroke={dark} strokeWidth="2" opacity="0.5" />
          <rect x="70" y="228" width="8" height="22" fill={leg} />
          <rect x="322" y="228" width="8" height="22" fill={leg} />
        </g>
      )}
      {kind === "armchair" && (
        <g>
          <path d="M110 120 q90 -40 180 0 v90 h-180z" fill={dark} />
          <rect x="92" y="150" width="40" height="80" rx="16" fill={color} />
          <rect x="268" y="150" width="40" height="80" rx="16" fill={color} />
          <rect x="124" y="172" width="152" height="50" rx="12" fill={light} />
          <rect x="112" y="228" width="7" height="24" fill={leg} />
          <rect x="281" y="228" width="7" height="24" fill={leg} />
        </g>
      )}
      {kind === "coffeeTable" && (
        <g>
          <ellipse cx="200" cy="190" rx="105" ry="30" fill={light} />
          <ellipse cx="200" cy="198" rx="105" ry="30" fill={color} />
          <rect x="150" y="205" width="100" height="42" fill={dark} />
          <ellipse cx="200" cy="247" rx="50" ry="9" fill={dark} />
        </g>
      )}
      {(kind === "diningTable" || kind === "desk") && (
        <g>
          <rect x="50" y="150" width="300" height="20" rx="3" fill={color} />
          <rect x="50" y="170" width="300" height="6" fill={dark} />
          <rect x="68" y="176" width="14" height="76" fill={dark} />
          <rect x="318" y="176" width="14" height="76" fill={dark} />
          {kind === "desk" && <rect x="90" y="176" width="90" height="46" rx="3" fill={light} />}
        </g>
      )}
      {kind === "chair" && (
        <g>
          <rect x="150" y="70" width="100" height="14" rx="6" fill={color} />
          <rect x="158" y="84" width="8" height="90" fill={color} />
          <rect x="234" y="84" width="8" height="90" fill={color} />
          <rect x="140" y="172" width="120" height="14" rx="4" fill={light} />
          <rect x="148" y="186" width="9" height="66" fill={dark} />
          <rect x="243" y="186" width="9" height="66" fill={dark} />
        </g>
      )}
      {kind === "bed" && (
        <g>
          <rect x="50" y="70" width="300" height="100" rx="14" fill={color} />
          <rect x="60" y="150" width="280" height="64" rx="10" fill="#EFEAE0" />
          <rect x="72" y="136" width="110" height="28" rx="12" fill="#FBF8F1" />
          <rect x="218" y="136" width="110" height="28" rx="12" fill="#FBF8F1" />
          <rect x="60" y="188" width="280" height="40" rx="10" fill={dark} />
          <rect x="60" y="226" width="280" height="22" rx="4" fill={shade(color, -60)} />
        </g>
      )}
      {kind === "nightstand" && (
        <g>
          <rect x="130" y="130" width="140" height="110" rx="6" fill={color} />
          <rect x="144" y="150" width="112" height="34" rx="3" fill={light} />
          <circle cx="200" cy="167" r="4" fill={leg} />
          <rect x="144" y="196" width="112" height="34" rx="3" fill={dark} opacity="0.5" />
          <rect x="138" y="240" width="8" height="14" fill={leg} />
          <rect x="254" y="240" width="8" height="14" fill={leg} />
        </g>
      )}
      {kind === "wardrobe" && (
        <g>
          <rect x="110" y="30" width="180" height="222" rx="6" fill={color} />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={118 + i * 58} y="40" width="52" height="202" rx="3" fill={i % 2 ? light : dark} opacity="0.85" />
          ))}
        </g>
      )}
      {kind === "tvStand" && (
        <g>
          <rect x="60" y="170" width="280" height="64" rx="6" fill={color} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={70 + i * 68} y="180" width="62" height="44" rx="3" fill={i % 2 ? light : dark} opacity="0.8" />
          ))}
          <rect x="130" y="70" width="140" height="84" rx="4" fill="#16141A" />
          <rect x="196" y="154" width="8" height="16" fill={leg} />
        </g>
      )}
      {kind === "shelf" && (
        <g>
          <rect x="130" y="20" width="140" height="232" rx="3" fill="none" stroke={color} strokeWidth="9" />
          {[78, 136, 194].map((y) => (
            <rect key={y} x="130" y={y} width="140" height="8" fill={color} />
          ))}
          <rect x="146" y="46" width="30" height="32" fill="#B76E50" />
          <rect x="214" y="106" width="40" height="30" fill="#7A7A4F" />
          <circle cx="170" cy="176" r="16" fill="#9AA38A" />
        </g>
      )}
      {kind === "floorLamp" && (
        <g>
          <ellipse cx="200" cy="250" rx="34" ry="7" fill={leg} />
          <rect x="197" y="86" width="6" height="164" fill="#B08D57" />
          <path d="M148 90 L162 24 H238 L252 90 Z" fill={color} />
          <path d="M162 24 H238 L252 90 H148Z" fill="#FFD7A0" opacity="0.35" />
        </g>
      )}
      {kind === "rug" && (
        <g>
          <path d="M40 190 L100 140 H300 L360 190 L300 240 H100Z" fill={color} />
          <path d="M70 190 L112 156 H288 L330 190 L288 224 H112Z" fill="none" stroke={light} strokeWidth="3" />
          <path d="M100 190 H300" stroke={dark} strokeWidth="2" opacity="0.5" />
        </g>
      )}
    </svg>
  );
}
