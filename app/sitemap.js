import { SITE } from "../lib/site.js";
import { FICHES, ficheUrl } from "../lib/fiches.js";
import { PRIX_DATE_ISO } from "../lib/prix.js";

/**
 * Une URL par contenu monétisable : les fiches produit sont ce que les
 * requêtes « iPhone 17 prix », « Apple Watch SE 3 avis », etc. peuvent
 * atteindre — la page unique /comparatif ne capte que la requête générique.
 */
export default function sitemap() {
  // Date du dernier relevé de prix, pas la date du build : un lastmod qui
  // change sans que le contenu change est du bruit pour Google.
  const now = new Date(PRIX_DATE_ISO);
  const fiches = FICHES.map((f) => ({
    url: `${SITE.url}${ficheUrl(f.slug)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: f.famille === "iphone" ? 0.85 : 0.7,
  }));

  return [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/comparatif`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE.url}/boutique`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/bons-plans`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...fiches,
  ];
}
