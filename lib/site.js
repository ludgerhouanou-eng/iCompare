// ============================================================
// CONFIGURATION DU SITE + AFFILIATION AMAZON
// ============================================================
// TOUS les liens sortants du site passent par amazonLink() :
// accueil, /comparatif, /boutique, BuyBar et le JSON-LD.
// Changer le tag ici réétiquette donc chaque fiche produit.
//
// Variables d'environnement (Vercel → Settings → Environment Variables) :
//   AMAZON_TAG, AMAZON_DOMAIN, SITE_URL

// Tag d'associé extrait du lien https://amzn.to/4wXCOF4, qui redirige vers
//   amazon.com/Apple-...-Renewed/dp/B0FSFLTSFS?…&tag=icompare0d-20&linkCode=sl2
const TAG = "icompare0d-20";

// Un produit peut imposer sa propre destination (lien court amzn.to
// déjà tagué) via un champ `link` : voir README, section Affiliation.
// Suffixe du tag → marché Amazon associé. Le suffixe n'est pas
// décoratif : il identifie le programme national qui encaisse.
const MARKET_BY_SUFFIX = {
  "20": "amazon.com", // États-Unis
  "84": "amazon.fr", // France
  "21": "amazon.co.uk", // Royaume-Uni
  "22": "amazon.de", // Allemagne
  "23": "amazon.ca", // Canada
  "24": "amazon.es", // Espagne
  "25": "amazon.it", // Italie
  "26": "amazon.co.jp", // Japon
};

// AMAZON_TAG="" (vide) = « pas encore de tag » : on publie des liens
// produits propres, sans paramètre tag vide ni tag d'un autre marché.
const amazonTag = (process.env.AMAZON_TAG ?? TAG).trim();
const suffix = /-(\d{2})$/.exec(amazonTag)?.[1] ?? null;
// Marché attendu par Amazon pour ce tag, et marché réellement ciblé.
const tagMarket = MARKET_BY_SUFFIX[suffix] ?? null;
const amazonDomain = process.env.AMAZON_DOMAIN || "amazon.fr";

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
 * Vide = tout est cohérent.
 */
export function affiliateIssues() {
  const issues = [];
  if (!suffix) {
    issues.push(`amazonTag « ${amazonTag} » est incomplet : il doit finir par un suffixe de marché (ex. « ${amazonTag}-84 »).`);
  } else if (tagMarket && tagMarket !== amazonDomain) {
    issues.push(
      `Incohérence marché : le tag ${amazonTag} (suffixe -${suffix} → ${tagMarket}) est collé sur des liens ${amazonDomain}. ` +
        `Amazon ne crédite aucune commission : créez un identifiant de suivi de ce marché (ex. « icompare0d-84 ») ` +
        `ou passez AMAZON_DOMAIN=${tagMarket}.`
    );
  }
  else if (!amazonTag) {
    issues.push(
      "Aucun tag d'associé renseigné : les liens partent vers Amazon sans attribution, donc sans commission. " +
        "Volontaire tant que votre compte n'est pas approuvé pour ce marché — mais retirez alors la mention « Partenaire Amazon » du pied de page."
    );
  }
  if (/^votretag/i.test(amazonTag)) issues.push("Le tag est encore un placeholder (« votretag-… »).");
  return issues;
}

/**
 * URL affiliée d'un produit.
 *  - `{ asin }`   → lien profond vers la fiche du marché ciblé, tagué.
 *  - `{ link }`   → lien court (amzn.to) déjà tagué, renvoyé tel quel ;
 *                   le tag est ajouté s'il manque.
 *  - ni l'un ni l'autre → `null` : l'appelant doit masquer le bouton.
 */
export function amazonLink({ asin = null, link = null } = {}) {
  // Un lien explicitement épinglé sur la fiche prime sur l'ASIN.
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
