// ============================================================
// FICHES PRODUIT — une URL indexable par article
// ============================================================
// Source unique pour /produit/[slug], /bons-plans, /boutique et le
// maillage interne. Les DONNÉES restent dans lib/products.js (iPhone)
// et lib/catalog.js (boutique) : ce fichier ne fait que les unifier,
// dériver les caractéristiques par produit et calculer les remises.

import { PRODUCTS, VERDICTS, QUICK_ROWS, SPEC_GROUPS } from "./products.js";
import { BOUTIQUE_PRODUCTS, CATEGORIES } from "./catalog.js";
import { productLink as catalogueLink } from "./catalog.js";
import { productLink as comparatifLink } from "./products.js";
import { remise, euroMini, prixLancement } from "./prix.js";

const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.name]));

/** iPhone : une colonne de la matrice de comparaison → fiche du produit. */
function ficheIphone(p, i) {
  const verdict = VERDICTS.find((v) => v.productId === p.id) || null;
  const specs = SPEC_GROUPS.map((g) => ({
    id: g.id,
    title: g.title,
    rows: g.rows
      .map((r) => ({
        label: r.label,
        value: r.values[i],
        meilleur: Array.isArray(r.best) ? r.best.includes(i) : r.best === i,
      }))
      // Une ligne où l'iPhone visé n'est ni meilleur ni distinctif garde
      // quand même son intérêt ; on ne filtre donc que les « — ».
      .filter((r) => r.value && r.value !== "—"),
  })).filter((g) => g.rows.length);

  return {
    slug: p.id,
    nom: p.name,
    titre: `${p.name} — fiche technique, prix et avis`,
    sousTitre: p.tagline,
    famille: "iphone",
    categorie: "comparatif",
    categorieLabel: "Comparatif iPhone",
    badge: p.badge,
    marque: "Apple",
    coloris: p.colors || [],
    vente: p.available,
    rumeur: Boolean(p.rumored),
    asin: p.asin,
    lien: p.link || null,
    urlAffilie: comparatifLink(p),
    prix: p.priceNow,
    prixAffiche: p.priceDisplay,
    prixNote: p.priceNote,
    lancement: p.priceLaunch,
    reduction: remise(p.priceNow, p.priceLaunch),
    atouts: p.highlights,
    verdict,
    specs,
    aVerifier: null,
    art: { kind: "phone", color: p.color, colorDark: p.colorDark },
    legende: `Représentation de l'${p.name} (${p.colorName})`,
  };
}

/** Boutique : pas de matrice de comparaison, on expose les champs réels. */
function ficheBoutique(p) {
  // Le prix de lancement est soit dans la note (« 269 € au lancement »),
  // soit dans le prix lui-même (« 198 € (au lieu de 249 €) »).
  const lancement = [p.priceNote, p.price].find((s) => /au (lancement|lieu de)/.test(s || "")) || null;
  return {
    slug: p.id,
    nom: p.name,
    titre: `${p.name} (${p.sub}) — prix et avis ${p.badge ? `· ${p.badge}` : ""}`,
    sousTitre: p.tagline,
    famille: "boutique",
    categorie: p.category,
    categorieLabel: CATEGORY_LABEL[p.category] || "Boutique Apple",
    badge: p.badge ? { label: p.badge, tone: p.badgeTone } : null,
    marque: p.brand || "Apple",
    coloris: [],
    vente: true,
    rumeur: false,
    asin: p.asin,
    lien: p.link || null,
    urlAffilie: catalogueLink(p),
    prix: p.price,
    prixAffiche: p.price,
    prixNote: p.priceNote,
    lancement,
    reduction: remise(p.price, lancement),
    atouts: [p.sub, p.brand ? `Marque : ${p.brand}` : null].filter(Boolean),
    verdict: null,
    specs: [],
    // Ce que la fiche ne PRÉTEND pas savoir : à compléter avant d'en faire
    // une page « technique ». Un lecteur doit pouvoir le voir.
    aVerifier:
      "Caractéristiques détaillées non relevées pour cette référence : la fiche reprend les informations de la sélection boutique. Ajoutez-les dans lib/catalog.js pour étoffer cette page.",
    art: { kind: p.kind, color: p.artColor, colorDark: p.artDark },
    legende: `Illustration : ${p.name}`,
  };
}

/**
 * « iphone-16 » figure À LA FOIS dans le comparatif (lib/products.js) et dans
 * la sélection boutique (lib/catalog.js) : même produit, même ASIN, prix
 * cohérents (819 € dans la fourchette 750–820 €). On garde la version riche
 * (fiche technique + verdict) et la carte boutique pointera vers cette fiche :
 * deux URLs pour un même produit = contenu dupliqué, donc cannibalisation.
 */
function fusionner(versusBoutique) {
  const parSlug = new Map();
  for (const f of versusBoutique.iphones) parSlug.set(f.slug, f);
  const doublons = [];
  for (const f of versusBoutique.boutique) {
    if (parSlug.has(f.slug)) { doublons.push(f.slug); continue; }
    parSlug.set(f.slug, f);
  }
  return { fiches: [...parSlug.values()], doublons };
}

const { fiches: FICHES_UNIFIEES, doublons: DOUBLONS_FUSIONNES } = fusionner({
  iphones: PRODUCTS.map(ficheIphone),
  boutique: BOUTIQUE_PRODUCTS.map(ficheBoutique),
});

export const FICHES = FICHES_UNIFIEES;
/** Références boutique fondues dans une fiche existante (à afficher en doc). */
export { DOUBLONS_FUSIONNES };

export const FICHE_SLUGS = FICHES.map((f) => f.slug);

export function getFiche(slug) {
  return FICHES.find((f) => f.slug === slug) || null;
}

export function ficheUrl(slug) {
  return `/produit/${slug}`;
}

/** Fiches réellement achetables (liens affiliés autorisés). */
export const FICHES_EN_VENTE = FICHES.filter((f) => f.vente && f.urlAffilie);

/** Fiches avec une remise chiffrable, triées par économie, pour /bons-plans. */
export const FICHES_PROMO = FICHES_EN_VENTE.filter((f) => f.reduction).sort(
  (a, b) => b.reduction.euros - a.reduction.euros
);

/** Deux ou trois fiches voisines, pour le maillage interne. */
export function fichesVoisines(slug, max = 3) {
  const current = getFiche(slug);
  if (!current) return [];
  const memeCategorie = FICHES_EN_VENTE.filter(
    (f) => f.slug !== slug && f.categorie === current.categorie
  );
  const autres = FICHES_EN_VENTE.filter(
    (f) => f.slug !== slug && f.categorie !== current.categorie
  );
  return [...memeCategorie, ...autres].slice(0, max);
}

/** Prix plancher (€) d'une fiche, pour tri et affichage — null si non chiffrable. */
export function prixPlancher(fiche) {
  return euroMini(fiche.prix);
}

/** Lignes « comparatif rapide » d'un iPhone (label → valeur du produit). */
export function faitsRapides(slug) {
  const index = PRODUCTS.findIndex((p) => p.id === slug);
  if (index < 0) return [];
  return QUICK_ROWS.map((r) => ({
    label: r.label,
    value: r.values[index],
    meilleur: Array.isArray(r.best) ? r.best.includes(index) : r.best === index,
  }));
}
