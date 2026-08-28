// ============================================================
// PRIX — lecture, comparaison et fraîcheur des données
// ============================================================
// Les prix du site sont relevés À LA MAIN dans lib/products.js et
// lib/catalog.js. Ce module ne les invente pas : il les parse pour
// pouvoir les trier, chiffrer une remise, et signaler quand le relevé
// vieillit.

/** Date du dernier relevé manuel de prix (AAAA-MM-JJ). */
export const PRIX_DATE_ISO = "2026-08-27";
export const PRIX_DATE_FR = "27 août 2026";

/** Au-delà, une page prix n'est plus crédible : on l'affiche. */
export const PRIX_VETUSTE_MAX_JOURS = 45;

/**
 * Montant plancher (€) d'une chaîne de prix.
 * « ≈ 750 – 820 € » → 750 · « 859 € » → 859 · « 198 € (au lieu de 249 €) » → 198
 * · « ≈ 14,50 € » → 14.5 · sans € → null.
 * On prend le MINIMUM de tous les montants € rencontrés : une fourchette est
 * toujours « à partir de », et un relevé ne doit jamais gonfler le prix affiché
 * ni sous-estimer une remise.
 */
export function euroMini(texte) {
  if (texte == null) return null;
  const s = String(texte).replace(/\u00a0/g, " ");
  const montants = [];
  // Tout groupe de chiffres suivi d'un euro, en gardant les bornes basses des
  // intervalles (« 750 – 820 € » : les deux nombres comptent, pas seulement 820).
  for (const m of s.matchAll(/([\d][\d .,\u00a0]*)(?:\s*[–—-]\s*([\d][\d .,]*))?\s*€/g)) {
    for (const brut of [m[1], m[2]]) {
      if (!brut) continue;
      const n = Number(brut.replace(/[ .\u00a0]/g, "").replace(",", "."));
      if (Number.isFinite(n) && n > 5) montants.push(n);
    }
  }
  return montants.length ? Math.min(...montants) : null;
}

/**
 * Prix de lancement cité dans un texte : « (269 € au lancement) »,
 * « 198 € (au lieu de 249 €) », « 969 € (128 Go) ». null si absent.
 * On le lit à part parce qu'il faut le MAXIMUM de la mention
 * (« au lieu de 249 € »), là où le prix courant se lit au minimum.
 */
export function prixLancement(texte) {
  if (texte == null) return null;
  const s = String(texte).replace(/\u00a0/g, " ");
  const cite = s.match(/au (?:lancement|lieu de)[^\d]{0,12}(\d[\d .,]*)\s*€/);
  if (cite) return Number(cite[1].replace(/[ .]/g, "").replace(",", "."));
  const brut = s.match(/^(?:≈\s*)?(\d[\d .,]*)\s*€/);
  return brut ? Number(brut[1].replace(/[ .]/g, "").replace(",", ".")) : null;
}

/** Remise vs prix de lancement, en % — null si l'un des deux manque. */
export function remise(actuel, lancement) {
  const now = euroMini(actuel);
  const launch =
    euroMini(lancement) === null ? null : Math.max(euroMini(lancement) ?? 0, prixLancement(lancement) ?? 0);
  if (!now || !launch || launch <= now) return null;
  return {
    pourcent: Math.round(((launch - now) / launch) * 100),
    euros: launch - now,
    lancement: launch,
    actuel: now,
  };
}

/** Jours entre le relevé et aujourd'hui (au build). */
export function joursDepuisReleve(now = new Date()) {
  const releve = new Date(`${PRIX_DATE_ISO}T00:00:00Z`);
  return Math.max(0, Math.round((now.getTime() - releve.getTime()) / 86400000));
}

export function prixPerime(now = new Date()) {
  return joursDepuisReleve(now) > PRIX_VETUSTE_MAX_JOURS;
}

/** Date de génération de la page (figée au build, donc vérifiable). */
export function dateGeneration(now = new Date()) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(now);
}
