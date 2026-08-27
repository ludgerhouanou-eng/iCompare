/**
 * Illustration vectorielle d'un iPhone (face arrière).
 * 100 % locale : fonctionne hors-ligne, aucun asset externe,
 * rendu net à toutes les tailles.
 */
export default function PhoneSVG({
  color = "#4a72d8",
  colorDark = "#2c4796",
  id = "phone",
  height = 180,
  className = "",
  label = "Représentation d'un iPhone",
}) {
  const g = `svg-${id}`;
  return (
    <svg
      viewBox="0 0 200 400"
      style={{ height }}
      className={className}
      role="img"
      aria-label={label}
      focusable="false"
    >
      <defs>
        <linearGradient id={`${g}-body`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="55%" stopColor={color} stopOpacity="0.92" />
          <stop offset="100%" stopColor={colorDark} />
        </linearGradient>
        <radialGradient id={`${g}-lens`} cx="35%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#3d5a99" />
          <stop offset="45%" stopColor="#141b2e" />
          <stop offset="100%" stopColor="#05070c" />
        </radialGradient>
      </defs>

      {/* Ombre au sol */}
      <ellipse cx="100" cy="384" rx="74" ry="9" fill="rgba(0,0,0,0.5)" />

      {/* Coque */}
      <rect x="16" y="8" width="168" height="384" rx="40" fill={`url(#${g}-body)`} />
      <rect x="16" y="8" width="168" height="384" rx="40" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
      <rect x="24" y="16" width="152" height="368" rx="33" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

      {/* Boutons latéraux */}
      <rect x="12" y="96" width="4" height="34" rx="2" fill="rgba(255,255,255,0.25)" />
      <rect x="12" y="144" width="4" height="26" rx="2" fill="rgba(255,255,255,0.25)" />
      <rect x="184" y="120" width="4" height="52" rx="2" fill="rgba(255,255,255,0.25)" />

      {/* Plaque caméra (style iPhone 16/17 : îlot carré, capteurs en diagonale) */}
      <rect x="34" y="34" width="88" height="88" rx="24" fill="rgba(0,0,0,0.22)" stroke="rgba(255,255,255,0.10)" />
      <circle cx="63" cy="63" r="17.5" fill="rgba(0,0,0,0.4)" />
      <circle cx="63" cy="63" r="12.5" fill={`url(#${g}-lens)`} />
      <circle cx="58" cy="58" r="3.5" fill="rgba(255,255,255,0.35)" />
      <circle cx="94" cy="94" r="17.5" fill="rgba(0,0,0,0.4)" />
      <circle cx="94" cy="94" r="12.5" fill={`url(#${g}-lens)`} />
      <circle cx="89" cy="89" r="3.5" fill="rgba(255,255,255,0.35)" />
      <circle cx="97" cy="51" r="5.5" fill="rgba(255,240,200,0.85)" />
      <circle cx="49" cy="99" r="3" fill="rgba(0,0,0,0.5)" />
    </svg>
  );
}
