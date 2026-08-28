// ============================================================
// CONFIGURATION DU SITE + AFFILIATION AMAZON
// ============================================================
// TOUS les liens sortants du site passent par amazonLink() :
// accueil, /comparatif, /boutique, /produit/*, /bons-plans, BuyBar et le
// JSON-LD. Changer le tag ici réétiquette donc chaque fiche produit.
//
// Variables d'environnement (Vercel → Settings → Environment Variables) :
//   AMAZON_TAG, AMAZON_DOMAIN, SITE_URL

// Deux identifiants ont été relevés dans les liens fournis par l'éditeur :
//   • icompare0d-20  → programme amazon.com (US), vu dans https://amzn.to/4wXCOF4
//   • ludgerhouanou-21 → programme européen, vu dans la chaîne
//     https://link.amazon/<code> → … → amazon.fr/s?…&tag=ludgerhouanou-21
// Le site est en euros et relie amazon.fr : l'identifiant -21 est donc le bon,
// et son titulaire l'a confirmé comme étant le sien (28 août 2026).
// (L'aide Partenaires Amazon FR confirme que le suffixe des identifications
// partenaires françaises est « -21 » — pas « -84 », erreur que ce fichier a
// un temps recommandée. Source : partenaires.amazon.fr, rubrique
// « Puis-je modifier mon identification partenaire ? ».)
// Le compte US (-20) reste utilisable le jour où une version anglaise est
// publiée : il suffira d'aligner AMAZON_TAG et AMAZON_DOMAIN=amazon.com.
const TAG = "ludgerhouanou-21";

// Suffixe du tag → programmes qu'il autorise. Un autre suffixe n'est pas
// deviné : il est signalé, à vérifier dans le compte Partenaires.
const MARKETS_BY_SUFFIX = {
  "20": ["amazon.com", "amazon.ca"],
  "21": [
    "amazon.fr",
    "amazon.co.uk",
    "amazon.de",
    "amazon.it",
    "amazon.es",
    "amazon.nl",
    "amazon.pl",
    "amazon.se",
    "amazon.com.be",
    "amazon.ie",
  ],
};

// AMAZON_TAG="" (vide) = « pas encore d'identifiant » : on publie des liens
// produits propres, sans paramètre tag vide ni tag d'un autre programme.
const amazonTag = (process.env.AMAZON_TAG ?? TAG).trim();
const suffixe = /-(\d{2})$/.exec(amazonTag)?.[1] ?? null;
const marchesAttendus = suffixe ? MARKETS_BY_SUFFIX[suffixe] ?? null : null;
const amazonDomain = (process.env.AMAZON_DOMAIN || "amazon.fr").replace(/^www\./, "");

export const SITE = {
  // Votre domaine (HTTPS) — alimente canonical, sitemap, Open Graph, JSON-LD.
  url: process.env.SITE_URL || "https://votredomaine.fr",
  amazonTag,
  amazonDomain,
  name: "iCompare",
  locale: "fr_FR",
};

/**
 * Anomalies de configuration qui font perdre 100 % des commissions.
 * Liste vide = tout est cohérent. Appelé au build (voir app/layout.jsx).
 */
export function affiliateIssues() {
  const issues = [];
  if (/^votretag/i.test(amazonTag)) {
    issues.push("Le tag est encore un placeholder (« votretag-… »).");
  } else if (!amazonTag) {
    issues.push(
      "Aucun tag d'associé renseigné : les liens partent vers Amazon sans attribution, donc sans commission. " +
        "Volontaire tant que votre compte n'est pas approuvé pour ce marché — retirez alors la mention « Partenaire Amazon » du pied de page."
    );
  } else if (!suffixe) {
    issues.push(
      `amazonTag « ${amazonTag} » est incomplet : une identification partenaire se termine par le suffixe de son programme (ex. « ${amazonTag}-21 » pour les programmes européens).`
    );
  } else if (marchesAttendus === null) {
    issues.push(
      `Suffixe « -${suffixe} » non reconnu par ce contrôle : vérifiez dans votre compte Partenaires que ${amazonDomain} relève bien de ce programme, sinon aucune commission n'est créditée.`
    );
  } else if (!marchesAttendus.includes(amazonDomain)) {
    issues.push(
      `Incohérence programme : le tag ${amazonTag} (suffixe -${suffixe} → ${marchesAttendus.join(", ")}) est collé sur des liens ${amazonDomain}. ` +
        `Le tag doit appartenir au programme du marché lié, sinon la vente n'est créditée à personne.`
    );
  }
  return issues;
}

/**
 * URL affiliée d'un produit.
 *  - `{ link }`  → destination explicite épinglée sur la fiche : elle prime,
 *                  et le tag est ajouté si elle en est dépourvue.
 *  - `{ asin }`  → lien profond vers la fiche du marché ciblé, tagué.
 *  - ni l'un ni l'autre → `null` : l'appelant doit masquer le bouton, pas
 *                  mentir au lecteur avec un lien qui mène ailleurs.
 */
export function amazonLink({ asin = null, link = null } = {}) {
  if (link) {
    if (/[?&]tag=/.test(link) || !amazonTag) return link;
    const sep = link.includes("?") ? "&" : "?";
    return `${link}${sep}tag=${encodeURIComponent(amazonTag)}`;
  }
  if (asin) {
    const base = `https://www.${amazonDomain}/dp/${asin}`;
    return amazonTag ? `${base}?tag=${encodeURIComponent(amazonTag)}` : base;
  }
  return null;
}

/**
 * Page « offres » Amazon (recherche + filtre boutique), reconstruite à partir
 * des paramètres relevés dans le lien fourni. Volontairement SANS le
 * raccourci tiers : la chaîne d'origine passe par un domaine qui peut
 * renvoyer ailleurs à tout moment, et sa destination est une liste de
 * résultats, pas une fiche produit. Ce lien-ci ne convient donc que comme
 * bouton « voir toutes les offres », jamais comme lien produit.
 */
export const OFFRES = { k: "iPhone", i: "specialty-aps", srs: "95175955031" };

export function offresLink() {
  const q = new URLSearchParams({ ...OFFRES, linkCode: "sl2", ref: "_as_li_ss_tl" });
  if (amazonTag) q.set("tag", amazonTag);
  return `https://www.${amazonDomain}/s?${q.toString()}`;
}
