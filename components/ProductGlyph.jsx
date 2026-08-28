/**
 * Glyphe compact (≈ 300 octets) pour les cartes produit.
 * L'illustration complète (PhoneSVG / ProductArt, 1 à 2 Ko chacune) n'est
 * gardée que sur la fiche dédiée : sur une grille de 15 cartes, elle coûtait
 * 20 Ko de HTML — et le double dans le payload d'hydratation.
 */
const FORMES = {
  phone: <rect x="6" y="2" width="12" height="20" rx="3.4" />,
  watch: (
    <>
      <rect x="8" y="7" width="8" height="10" rx="3" />
      <path d="M10 7V4h4v3M10 17v3h4v-3" />
    </>
  ),
  tablet: <rect x="4" y="5" width="16" height="14" rx="2.6" />,
  buds: (
    <>
      <path d="M9 6a3 3 0 1 1 0 6v5" />
      <path d="M15 6a3 3 0 1 0 0 6v5" />
    </>
  ),
  over: (
    <>
      <path d="M6 14v-2a6 6 0 0 1 12 0v2" />
      <rect x="4" y="13" width="4" height="7" rx="2" />
      <rect x="16" y="13" width="4" height="7" rx="2" />
    </>
  ),
  charger: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="2.6" />
      <path d="M10 4v3M14 4v3" />
    </>
  ),
  cable: (
    <>
      <path d="M5 18c6 0 4-8 10-8" />
      <rect x="15" y="8" width="4" height="4" rx="1.4" />
    </>
  ),
};

export default function ProductGlyph({ kind = "phone", color = "#3d6ef7", label }) {
  return (
    <svg
      className="glyph"
      viewBox="0 0 24 28"
      width="26"
      height="30"
      fill="none"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      role="img"
      aria-label={label || ""}
      focusable="false"
    >
      {FORMES[kind] || FORMES.phone}
    </svg>
  );
}
