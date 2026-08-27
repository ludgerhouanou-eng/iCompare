/**
 * Illustrations vectorielles des produits de la boutique (100 % local).
 * kind : "watch" | "ipad" | "buds" | "headphones" | "charger" | "cable"
 * (les iPhone utilisent PhoneSVG)
 */
export default function ProductArt({
  kind = "watch",
  color = "#f4f4f8",
  colorDark = "#c7c7cc",
  id = "art",
  height = 180,
  label = "Illustration de produit",
}) {
  const g = `art-${id}-${kind}`;
  return (
    <svg
      viewBox="0 0 200 200"
      style={{ height }}
      role="img"
      aria-label={label}
      focusable="false"
    >
      <defs>
        <linearGradient id={`${g}-body`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={colorDark} />
        </linearGradient>
        <linearGradient id={`${g}-screen`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#101a33" />
          <stop offset="100%" stopColor="#1c2c55" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="188" rx="70" ry="8" fill="rgba(0,0,0,0.45)" />

      {kind === "watch" && (
        <g>
          <rect x="72" y="6" width="56" height="54" rx="15" fill={colorDark} opacity="0.85" />
          <rect x="72" y="140" width="56" height="54" rx="15" fill={colorDark} opacity="0.85" />
          <rect x="48" y="52" width="104" height="96" rx="27" fill={`url(#${g}-body)`} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
          <rect x="56" y="60" width="88" height="80" rx="20" fill="#0b1020" />
          <circle cx="100" cy="100" r="26" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="5" />
          <rect x="152" y="74" width="7" height="24" rx="3.5" fill={colorDark} />
          <rect x="152" y="106" width="7" height="15" rx="3.5" fill={colorDark} />
        </g>
      )}

      {kind === "ipad" && (
        <g>
          <rect x="32" y="14" width="136" height="170" rx="16" fill={`url(#${g}-body)`} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
          <rect x="40" y="26" width="120" height="146" rx="10" fill={`url(#${g}-screen)`} />
          <circle cx="100" cy="20" r="2.5" fill="#0a0a0c" />
        </g>
      )}

      {kind === "buds" && (
        <g>
          <rect x="56" y="34" width="88" height="88" rx="24" fill="#f4f4f8" stroke="#d2d2d7" strokeWidth="1.5" />
          <line x1="56" y1="66" x2="144" y2="66" stroke="#d2d2d7" strokeWidth="2" />
          <circle cx="100" cy="84" r="3" fill="#30d158" opacity="0.85" />
          <g fill="#ffffff" stroke="#c7c7cc" strokeWidth="1.5">
            <circle cx="74" cy="152" r="15" />
            <rect x="68" y="158" width="11" height="32" rx="5.5" />
            <circle cx="126" cy="152" r="15" />
            <rect x="121" y="158" width="11" height="32" rx="5.5" />
          </g>
        </g>
      )}

      {kind === "headphones" && (
        <g>
          <path d="M42 118 C42 44 158 44 158 118" fill="none" stroke={color} strokeWidth="16" strokeLinecap="round" />
          <path d="M42 118 C42 44 158 44 158 118" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="4" strokeLinecap="round" />
          <rect x="28" y="110" width="44" height="66" rx="20" fill={colorDark} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <rect x="128" y="110" width="44" height="66" rx="20" fill={colorDark} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <ellipse cx="50" cy="143" rx="12" ry="21" fill="rgba(255,255,255,0.14)" />
          <ellipse cx="150" cy="143" rx="12" ry="21" fill="rgba(255,255,255,0.14)" />
        </g>
      )}

      {kind === "charger" && (
        <g>
          <rect x="52" y="36" width="96" height="124" rx="20" fill="#f4f4f8" stroke="#d2d2d7" strokeWidth="1.5" />
          <circle cx="80" cy="82" r="9" fill="#c7c7cc" />
          <circle cx="80" cy="82" r="4" fill="#9a9aa2" />
          <circle cx="120" cy="82" r="9" fill="#c7c7cc" />
          <circle cx="120" cy="82" r="4" fill="#9a9aa2" />
          <rect x="82" y="118" width="36" height="12" rx="6" fill="#1d1d1f" />
        </g>
      )}

      {kind === "cable" && (
        <g>
          <path d="M62 148 C30 112 52 62 100 62 C148 62 172 98 148 132" fill="none" stroke="#f4f4f8" strokeWidth="10" strokeLinecap="round" opacity="0.95" />
          <circle cx="150" cy="148" r="27" fill="#f4f4f8" stroke="#d2d2d7" strokeWidth="1.5" />
          <circle cx="150" cy="148" r="14" fill="#c7c7cc" />
          <circle cx="150" cy="148" r="5" fill="#8e8e95" />
          <rect x="38" y="38" width="46" height="21" rx="8" fill="#f4f4f8" stroke="#d2d2d7" strokeWidth="1.5" />
          <rect x="49" y="45.5" width="24" height="6" rx="3" fill="#1d1d1f" />
        </g>
      )}
    </svg>
  );
}
