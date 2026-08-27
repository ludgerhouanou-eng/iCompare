// ============================================================
// CONFIGURATION DU SITE — À MODIFIER AVANT LA MISE EN LIGNE
// ============================================================

export const SITE = {
  // Votre domaine (HTTPS) — utilisé pour les canonicals, le sitemap
  // et les balises Open Graph / Twitter Card.
  url: "https://votredomaine.fr",

  // Votre tag d'associé Amazon, COMPLET (format "votretag-21").
  // Sans un tag valide, les liens ne génèrent AUCUNE commission.
  // Récupérez-le dans votre compte Amazon Partenaires Associés.
  amazonTag: "votretag-21",

  // Marché Amazon ciblé.
  amazonDomain: "amazon.fr",

  name: "iCompare",
  locale: "fr_FR",
};

/** Construit un lien affilié Amazon propre (ASIN + tag complet). */
export function amazonLink(asin) {
  return `https://www.${SITE.amazonDomain}/dp/${asin}?tag=${SITE.amazonTag}`;
}
