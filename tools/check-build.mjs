// ============================================================
// CONTRÔLE DU BUILD — `npm run build && npm run check`
// ============================================================
// Ce script ne teste pas le code : il teste CE QUE LE VISITEUR REÇOIT,
// en lisant le HTML statique sorti par Next. Les trois bugs rencontrés sur
// ce projet (metadata absentes sur 17 fiches, prix de fourchette lu à
// l'envers, JSON-LD en désaccord avec l'affichage) sont tous invisibles au
// compilateur et à ce vérificateur — mais pas à Google, ni à Amazon, ni au
// lecteur. D'où : un garde-fou exécuté à chaque déploiement.
//
// Sortie : code 0 si tout passe, 1 au premier problème listé.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { euroMini, AFFICHER_MONTANTS } from "../lib/prix.js";
import { PRODUCTS } from "../lib/products.js";
import { SITE } from "../lib/site.js";
import { APPLE_STORE, storeSpaceUrl } from "../lib/site.js";
import { CATEGORIES } from "../lib/catalog.js";
import { GUIDES } from "../lib/guides.js";
import { IPHONE, IPAD } from "../lib/modeles.js";

const APP = join(".next", "server", "app");
const TAILLE_MAX_KO = 220; // HTML d'une page, en Ko — au-delà, on a déraillé

function html_unescape(s) {
  return String(s)
    .replace(/&nbsp;/g, " ")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;|&#x22;|&#34;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function echapper(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function fichiers(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...fichiers(p));
    else if (e.endsWith(".html")) out.push(p);
  }
  return out;
}

const htmls = existsSync(APP) ? fichiers(APP) : [];
const problemes = [];
const ajouter = (fichier, motif) => problemes.push(`${fichier.replace(APP + "/", "") || "."} : ${motif}`);

if (!htmls.length) {
  console.error("Aucun HTML trouvé dans .next/server/app — lancer `npm run build` d'abord.");
  process.exit(1);
}

// Tag attendu, lu dans la config pour ne jamais dupliquer une valeur ici
const config = readFileSync(join("lib", "site.js"), "utf8");
const tag = /const TAG = "([^"]+)"/.exec(config)?.[1] ?? null;

// URL construites (pour valider le maillage interne)
const construites = new Set();
for (const f of htmls) {
  const rel = relative(APP, f).replace(/\.html$/, "").replace(/\\/g, "/");
  construites.add(rel === "index" ? "/" : "/" + rel);
}

const vus = new Map(); // titre -> nb d'apparitions (détection de doublons)
const descriptions = new Map();
let comptes = { pages: 0, liensAmazon: 0, fiches: 0, offersVerifiees: 0, liensInternes: 0, jsonLd: 0, cartesBoutique: 0 };

for (const f of htmls) {
  const rel0 = relative(APP, f);
  // Les pages techniques de Next (404, redirections) ne sont pas indexables :
  // pas de canonical ni de metadata à y exiger.
  if (/(^|[\\/])_/.test(rel0)) continue;
  const h = readFileSync(f, "utf8");
  const tete = h.slice(0, h.indexOf("</head>") + 7 || h.length);
  const rel = relative(APP, f);
  const estFiche = rel.startsWith(join("produit", ""));

  if (estFiche && h.includes("<h1")) comptes.fiches += 1;
  comptes.pages += 1;

  // 1. Un h1, un seul
  const nbH1 = (h.match(/<h1[\s>]/g) || []).length;
  if (nbH1 !== 1) ajouter(f, `${nbH1} <h1> (attendu : 1)`);

  // 2. Title et description présents et uniques à l'échelle du site
  const titre = /<title>([^<]*)<\/title>/.exec(tete)?.[1]?.trim();
  const desc = /<meta name="description" content="([^"]+)"/.exec(tete)?.[1];
  if (!titre) ajouter(f, "<title> absent");
  if (!desc) ajouter(f, "meta description absente");
  if (titre) vus.set(titre, (vus.get(titre) || 0) + 1);
  if (desc) descriptions.set(desc, (descriptions.get(desc) || 0) + 1);

  // 3. Canonical : présent partout, et cohérent avec l'URL de la page
  const canon = /<link rel="canonical" href="([^"]+)"/.exec(tete)?.[1];
  const chemin = rel.replace(/\.html$/, "").replace(/\\/g, "/");
  const attendu = chemin === "index" ? "" : "/" + chemin;
  const sansSlash = (u) => String(u).replace(/\/+$/, "");
  if (!canon) ajouter(f, "rel=canonical absent");
  else if (!sansSlash(canon).endsWith(sansSlash(attendu))) {
    ajouter(f, `canonical « ${canon} » ≠ page « ${attendu || "/"} »`);
  }

  // 4. Liens Amazon : tag + rel, et jamais de destination tordue
  const liens = [...h.matchAll(/<a[^>]*href="(https:\/\/(?:www\.amazon\.[a-z.]+|amzn\.to)[^"]*)"[^>]*>/g)];
  comptes.liensAmazon += liens.length;
  for (const m of liens) {
    const url = m[1];
    if (tag && !url.includes(`tag=${tag}`) && !/amzn\.to/.test(url)) {
      ajouter(f, `lien sans tag d'associé : ${url.slice(0, 70)}`);
    }
    if (!/rel="[^"]*sponsored/.test(m[0])) ajouter(f, `lien sans rel="sponsored" : ${url.slice(0, 70)}`);
    if (/\?tag=&|[?&]tag=$/.test(url)) ajouter(f, "tag vide dans l'URL");
  }

  // 5. Aucune ancre morte vers un produit
  if (/href="(?:null|undefined)"/.test(h)) ajouter(f, 'href="null"/"undefined" (produit sans lien vendu)');

  // 6. JSON-LD : parsable, et sans placeholder
  for (const m of h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      comptes.jsonLd += 1;
      JSON.parse(m[1].replace(/&amp;/g, "&"));
    } catch (e) {
      ajouter(f, `JSON-LD illisible : ${e.message}`);
    }
  }

  // 7. Maillage interne : chaque /… pointé doit exister dans le build
  for (const m of h.matchAll(/<a[^>]*href="(\/[^"#?]*)"/g)) {
    const cible = m[1];
    if (cible.startsWith("//")) continue;
    comptes.liensInternes += 1;
    if (!construites.has(cible) && !existsSync(join(APP, cible.replace(/^\//, "") + ".html")) && !existsSync(join(APP, cible.replace(/^\//, ""), "index.html"))) {
      ajouter(f, `lien interne sans page construite : ${cible}`);
    }
  }

  // 8. Politique « aucun montant recopié », lue dans le même drapeau que les
  // gabarits (lib/prix.js). Sans PA API, le règlement des Partenaires Amazon FR
  // interdit d'indiquer prix et disponibilité : le site ne rend donc aucun « € »,
  // ne déclare aucune Offer et n'affirme aucun « InStock ». SHOW_PRICES=1 fait
  // basculer le contrôle en même temps que les pages — les deux ne peuvent pas
  // se contredire.
  if (AFFICHER_MONTANTS) {
    if (estFiche) {
      for (const m of h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
        let donnees;
        try {
          donnees = JSON.parse(m[1].replace(/&amp;/g, "&"));
        } catch {
          continue; // déjà signalé en 6
        }
        const noeuds = (Array.isArray(donnees) ? donnees : donnees["@graph"] ? donnees["@graph"] : [donnees])
          .flatMap((n) => (n && n["@graph"] ? n["@graph"] : [n]));
        for (const n of noeuds) {
          if (!n || n["@type"] !== "Product" || !n.offers || n.offers.price === undefined) continue;
          // Le montant recoupé est celui de l'encart prix, pas les lignes qui le
          // suivent : « −26 % · 189 € sous le prix Apple » avait donné 7 faux
          // positifs à la première exécution de cette règle.
          const affiche = /prix-box[\s\S]{0,240}?price-now[^>]*>([^<]+)</.exec(h)?.[1] ?? "";
          comptes.offersVerifiees += 1;
          const mini = euroMini(affiche);
          if (mini === null) {
            ajouter(f, `JSON-LD annonce ${n.offers.price} € mais aucun montant lisible dans l'encart prix`);
          } else if (Math.abs(mini - Number(n.offers.price)) > 0.51) {
            ajouter(f, `JSON-LD annonce ${n.offers.price} €, la fiche affiche ${mini} €`);
          }
        }
      }
    }
  } else {
    const visible = h
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<style[\s\S]*?<\/style>/g, "");
    const montants = visible.match(/\d[\d .]*[,.]?\d*\s*€/g) || [];
    if (montants.length) {
      ajouter(f, `${montants.length} montant(s) en euros : le site ne doit en afficher aucun sans PA API (${montants.slice(0, 3).join(", ")})`);
    }
    if (/"@type":"(?:Aggregate)?Offer"/.test(h)) {
      ajouter(f, "une Offer dans le JSON-LD alors qu'aucun montant n'est affiché sur la page");
    }
    if (/InStock|OutOfStock|InStoreOnly/.test(h)) {
      ajouter(f, "une disponibilité déclarée (« InStock ») : le build ne peut pas la savoir");
    }
  }

  // Compté dans les deux modes : une règle qui ne s'exécute que quand
  // la politique est active peut s'éteindre en silence.
  if (rel === join("boutique.html")) {
    const visibleB = h
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<style[\s\S]*?<\/style>/g, "");
    const cartes = (visibleB.match(/class="card phone-card"/g) || []).length;
    comptes.cartesBoutique = cartes;
    if (cartes === 0) ajouter(f, "aucune carte rendue : contrôle de la boutique neutralisé");
    const consultations = (visibleB.match(/Consulter le prix sur Amazon|Voir le prix sur Amazon/g) || []).length;
    if (consultations !== cartes) {
      ajouter(f, `${cartes} cartes mais ${consultations} bouton « Consulter le prix sur Amazon » : une carte sans porte de sortie`);
    }

    // --- Rayons (grille « rangement ») ------------------------------------
    // Une tuile qui ne mène nulle part, ou à un espace d'achat inventé, est le
    // seul péché impardonnable de cette page : c'est elle qui porte les
    // commissions. Sont donc exigés : un nombre de tuiles égal au nombre de
    // catégories, une page de store Apple réellement existante (liste
    // relevée en HTTP le 28/08/2026 dans lib/site.js), le tag partenaire,
    // et le rel="sponsored".
    const tuiles = h.match(/<a[^>]*class="rayon"[^>]*>/g) || [];
    if (tuiles.length !== CATEGORIES.length) {
      ajouter(
        f,
        `${tuiles.length} tuiles de rayon pour ${CATEGORIES.length} catégories : la grille et CATEGORIES ont décroché`
      );
    }
    const utilisees = [];
    for (const b of tuiles) {
      const href = ((/href="([^"]*)"/.exec(b) || [])[1] || "").replace(/&amp;/g, "&");
      const page = (/\/stores\/page\/([0-9A-F-]{36})\//.exec(href) || [])[1] || null;
      if (!page) {
        ajouter(f, `tuile de rayon sans page de store : ${href.slice(0, 80) || "(href vide)"}`);
        continue;
      }
      if (!Object.values(APPLE_STORE.rayons).includes(page) && page !== APPLE_STORE.racine) {
        ajouter(f, `tuile vers /stores/page/${page} : espace inconnu de lib/site.js (non vérifié en HTTP)`);
      }
      if (!new RegExp(`[&?]tag=${tag}(&|$)`).test(href)) {
        ajouter(f, `tuile ${page} sans tag partenaire : aucune commission sur ce clic`);
      }
      if (!/rel="sponsored nofollow noopener"/.test(b)) {
        ajouter(f, `tuile ${page} sans rel="sponsored" (lien payant non déclaré aux moteurs)`);
      }
      utilisees.push(page);
    }
    for (const c of CATEGORIES) {
      const url = storeSpaceUrl(c.store);
      if (!url) {
        ajouter(f, `catégorie ${c.id} sans espace d'achat : on retire le lien, on n'invente pas un identifiant de page`);
        continue;
      }
      if (!h.includes(url.replace(/&/g, "&amp;"))) {
        ajouter(f, `rayon « ${c.name} » : son espace d'achat n'apparaît nulle part dans la page (ni tuile, ni en-tête de section)`);
      }
    }
    if (new Set(utilisees).size < 5) {
      ajouter(f, `${new Set(utilisees).size} espaces distincts pour ${tuiles.length} tuiles : deux rayons se marchent dessus`);
    }

    // --- Visuels : une image par produit, et pas de saut de mise en page ---
    const visuels = (h.match(/class="art-stage art-stage-card"/g) || []).length;
    if (visuels !== cartes) {
      ajouter(f, `${cartes} cartes mais ${visuels} visuels produits : une carte sans image`);
    }
    for (const img of h.match(/<img\b[^>]*>/g) || []) {
      const manquants = ["width", "height", "loading"].filter((a) => !new RegExp(`\\b${a}="`).test(img));
      if (manquants.length) {
        ajouter(f, `<img> sans ${manquants.join(", ")} : la page danse au chargement`);
      }
    }
  }

  // 8 bis. Guides : une page = une question, un seul lien monétisé, des sources
  if (rel.startsWith(join("guides", ""))) {
    const visibleG = h
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<style[\s\S]*?<\/style>/g, "");
    const estIndex = /guides[\\/]?index\.html$/.test(rel) || rel === join("guides.html");
    if (!estIndex) {
      const amazon = (
        visibleG
          .replace(/&amp;/g, "&")
          .match(/<a[^>]*href="https:\/\/www\.amazon\.[a-z.]+\/[^"]*"[^>]*>/g) || []
      );
      if (amazon.length !== 1) {
        ajouter(f, `${amazon.length} lien(s) Amazon visible(s) : un guide en admet un seul, l'espace d'achat`);
      }
      for (const a of amazon) {
        if (!/[?&]tag=/.test(a)) ajouter(f, "le lien Amazon du guide n'est pas taggé");
        if (!/rel="sponsored nofollow noopener"/.test(a)) ajouter(f, "le lien Amazon du guide n'a pas rel=\"sponsored\"");
        if (!/\/stores\/page\//.test(a)) ajouter(f, "le CTA d'un guide doit mener à un espace d'achat vérifié, pas à une fiche");
      }
      // Le maillage utile, ce n'est pas la navigation ni le pied de page (ils
      // sont sur toutes les pages) : c'est le bloc « À lire aussi », qui doit
      // tenir 3 entrées dont au moins une vers une page où l'on peut acheter.
      const voir = (visibleG.match(/<nav class="guide-voir-aussi"[\s\S]*?<\/nav>/) || [""])[0];
      const entrees = new Set((voir.match(/href="\/[^"]*"/g) || []));
      if (entrees.size < 3) {
        ajouter(f, `bloc « À lire aussi » à ${entrees.size} lien(s) interne(s) : un guide sans sortie ne convertit pas`);
      }
      if (!/href="\/(boutique|comparatif|produit\/)/.test(voir)) {
        ajouter(f, "aucun lien d'un guide vers une page d'achat (\u00ab \u00e0 lire aussi \u00bb) : le guide capte le lecteur pour Google, pas pour vous");
      }
      if (!/Sources et m\u00e9thode/.test(visibleG)) {
        ajouter(f, "pas de bloc « Sources et méthode » : une affirmation non sourcée n'a pas sa place ici");
      }
      if (!/relev\u00e9 du \d|Relev\u00e9 \u00e9|le \d\d?\s?ao\u00fbt \d{4}/.test(visibleG)) {
        ajouter(f, "aucune date de relevé visible : une liste de compatibilité sans date est une affirmation");
      }
      // Un guide doit citer au moins une source externe, et toute sortie non
      // Amazon doit porter nofollow (sinon on distribue du PageRank à l'aveugle).
      const citations = (visibleG.match(/<a[^>]*href="https:\/\/[^"]*"[^>]*rel="nofollow noopener"/g) || []).length;
      if (citations < 2) ajouter(f, `${citations} citation(s) externe(s) avec rel adéquat (2 minimum)`);
    }
  }

  // 9. Garde-fou de poids
  const ko = Buffer.byteLength(h) / 1024;
  if (ko > TAILLE_MAX_KO) ajouter(f, `HTML de ${ko.toFixed(1)} Ko > ${TAILLE_MAX_KO} Ko (page à découper)`);
}

// 10. Aucun placeholder de configuration ne doit finir dans le HTML livré
const corps = htmls.map((f) => readFileSync(f, "utf8")).join("\n");
if (/votretag/i.test(corps)) {
  problemes.push("un « votretag-… » apparaît dans le HTML livré : renseignez AMAZON_TAG (lib/site.js)");
}
if (/votredomaine/i.test(corps)) {
  problemes.push(
    "domaine placeholder « votredomaine.fr » dans le HTML livré : canonical, sitemap et JSON-LD pointent hors de votre site. " +
      "Réglez-le avec SITE_URL (Vercel → Environment Variables) ou lib/site.js, puis redéployez."
  );
}

// 11. Visuels de rayon : locaux, présents, compressés. Un hotlink d'une image
// Amazon (images-fr.amazon.com) est interdit hors contenus fournis par le
// Programme Partenaires — d'où des fichiers dans le dépôt, et un contrôle.
for (const c of CATEGORIES) {
  if (!c.visuel) {
    problemes.push(`rayon ${c.id} sans visuel : la tuile serait vide`);
    continue;
  }
  const fichier = join("public", c.visuel.replace(/^\//, ""));
  if (!existsSync(fichier)) {
    problemes.push(`visuel de rayon introuvable : ${c.visuel} (attendu en ${fichier})`);
    continue;
  }
  const ko = statSync(fichier).size / 1024;
  if (ko > 90) {
    problemes.push(`${c.visuel} pèse ${ko.toFixed(0)} Ko : redimensionner (six PNG de 1,4 Mo ont déjà pesé 8 Mo de dépôt)`);
  }
  if (/\.png$/i.test(c.visuel)) {
    problemes.push(`${c.visuel} en PNG : compresser en JPG/WebP pour une photo`);
  }
}

// 11 bis. Garde-fou factuel des guides.
// (a) Les valeurs qui nous ont déjà fait défaut sont épinglées ici : si
//     quelqu'un (moi, un refactor, un copier-coller) les fait bouger, le build
//     échoue. Sources : Wikipedia « iOS 26 », itechguides et rottenwifi,
//     consultés le 28 août 2026.
const ATTENDUES = [
  ["iPhone 15 / 15 Plus", { ios26: true, ia: false }],
  ["iPhone 15 Pro / Pro Max", { ios26: true, ia: true }],
  ["iPhone 13 / 13 mini", { ios26: true, ia: false }],
  ["iPhone 14 Pro / Pro Max", { ios26: true, ia: false }],
  ["iPhone 17 / 17e", { ios26: true, ia: true }],
  ["iPhone XR", { ios26: false }],
  ["iPad (A16), 11\u1d49 g\u00e9n\u00e9ration", { ios26: true, ia: false }],
  ["iPad mini (A17 Pro)", { ios26: true, ia: true }],
];
for (const [modele, attendu] of ATTENDUES) {
  const ligne = [...IPHONE, ...IPAD].find((m) => m.modele === modele);
  if (!ligne) {
    problemes.push(`table de compatibilit\u00e9 : « ${modele} » a disparu de lib/modeles.js`);
    continue;
  }
  for (const [champ, valeur] of Object.entries(attendu)) {
    if (ligne[champ] !== valeur) {
      problemes.push(
        `lib/modeles.js : ${modele} a ${champ}=${ligne[champ]}, la source du 28/08/2026 dit ${valeur}`
      );
    }
  }
}

// (b) Aucun page ne doit pr\u00eater Apple Intelligence \u00e0 un mod\u00e8le exclu par le
//     mat\u00e9riel. D\u00e9tection par phrase : la phrase qui mentionne « Apple
//     Intelligence » et un mod\u00e8le non \u00e9ligible, sans marqueur de n\u00e9gation, est
//     une erreur factuelle \u2014 c'est exactement celle que ce d\u00e9p\u00f4t a port\u00e9e un temps.
const NON_IA = ["iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15", "iPhone SE (2", "iPhone SE (3", "iPad (A16)"];
const NEGATIONS = ["pas", "non", "sans", "sauf", "exclu", "manque", "absence", "n'", "ni ", "jamais", "hors de", "\u00e9cart", "plancher", "r\u00e9serve"];
const sansCasse = (s) => s.toLowerCase();
const texteVu = htmls
  .map((f) => {
    const v = readFileSync(f, "utf8")
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<style[\s\S]*?<\/style>/g, "")
      // Les tableaux de compatibilité sont CONSTRUITS depuis lib/modeles.js et
      // leurs valeurs sont épinglées en (a) : ils ne peuvent pas contenir une
      // affirmation fausse sans la rendre ailleurs. On les sort de l'analyse
      // syntaxique, qui les lirait comme une phrase sans point final.
      .replace(/<table[\s\S]*?<\/table>/g, " ")
      .replace(/<[^>]+>/g, " ");
    return [f.replace(APP + "/", "") || "index", v];
  });
for (const [nom, v] of texteVu) {
  for (let phrase of v.split(/(?<=[.!?])\s+/)) {
    phrase = phrase.replace(/\s+/g, " ");
    if (!/Apple Intelligence/.test(phrase)) continue;
    if (phrase.trim().endsWith("?")) continue; // une question n'affirme rien
    // Un mod\u00e8le \u00e9ligible cit\u00e9 dans la m\u00eame phrase annule le signal (« iPhone 15 Pro »).
    const sansEligibles = phrase
      .replace(/iPhone 15 Pro \w*/g, "")
      .replace(/iPhone 1[67][^,.;]*/g, "")
      .replace(/iPhone Air/g, "")
      .replace(/iPad mini \(A17 Pro\)/g, "")
      .replace(/iPad (Air|Pro)[^,.;]*/g, "");
    if (NON_IA.some((m) => sansEligibles.includes(m)) && !NEGATIONS.some((n) => sansCasse(phrase).includes(n))) {
      problemes.push(`${nom} : phrase qui pr\u00eate Apple Intelligence \u00e0 un mat\u00e9riel exclu \u2014 \u00ab ${phrase.trim().slice(0, 120)}\u2026 \u00bb`);
    }
  }
}

// (c) Le nombre de guides rendus doit \u00eatre celui de la donn\u00e9e : une page qui
//     n'a pas \u00e9t\u00e9 g\u00e9n\u00e9r\u00e9e est une page qui ne sera jamais trouv\u00e9e.
const pagesGuides = htmls.filter((f) => /[\\/]guides[\\/][^\\/]+\.html$/.test(f));
if (pagesGuides.length !== GUIDES.length) {
  problemes.push(`${pagesGuides.length} pages de guide rendues pour ${GUIDES.length} dans lib/guides.js`);
}
const slugsVus = new Set(pagesGuides.map((f) => f.split(/[\\/]/).pop().replace(/\.html$/, "")));
for (const g of GUIDES) {
  if (!slugsVus.has(g.slug)) problemes.push(`guide ${g.slug} absent de la sortie : introuvable pour Google comme pour un lecteur`);
}

// 11 ter. Ce que le <head> promet, et ce que le règlement interdit.
// Un jugement éditorial (« meilleur rapport qualité-prix ») n'est pas une donnée
// de prix et reste autorisé : la liste ne vise que le prix du jour, la promo en
// cours et la rareté — trois choses que le build ne peut ni vérifier ni retirer.
// Le contrôle « zéro montant » ne portait que sur le corps visible : or c'est la
// meta description qui s'affiche dans les résultats de Google. Un montant dans
// un <meta> est donc vu par le lecteur, exactement comme dans le corps de page.
const HORS_LIMITES = /(à moindre prix|le moins cher de la|moins cher qu['\u2019]|moins cher que|fois moins cher|le plus abordable|en ce moment|en promo|promo sur amazon|prix les plus bas|les plus bas depuis|meilleur prix|au meilleur prix|plus grosses \u00e9conomies|meilleures \u00e9conomies|code promo|à saisir|stock limit|derni\u00e8res unit)/gi;
for (const f of htmls) {
  const rel = relative(APP, f);
  const h = readFileSync(f, "utf8");
  const tete = h.slice(0, h.indexOf("</head>") + 7 || h.length);
  if (!AFFICHER_MONTANTS) {
    const teteVis = html_unescape(tete);
    const dansTete = teteVis.match(/\d[\d .\u202f]*[,.]?\d*\s*\u20ac/g) || [];
    if (dansTete.length) {
      problemes.push(`${rel} : ${dansTete.length} montant(s) dans le <head> (${dansTete[0]}) — la meta description s'affiche dans les résultats de recherche, elle est tenue aux mêmes règles que le texte de la page`);
    }
  }
  const corps = h
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "");
  const texte = html_unescape(corps.replace(/<[^>]+>/g, " "));
  const abus = texte.match(HORS_LIMITES);
  if (abus) {
    problemes.push(
      `${rel} : ${[...new Set(abus.map((x) => x.toLowerCase()))].join(", ")} — une affirmation de prix, de promo ou de raret\u00e9 que le build ne peut ni v\u00e9rifier ni retirer \u00e0 temps (Politiques du Programme Partenaires, rubrique « Liens présents sur votre site »)`
    );
  }
  // Le titre d'une fiche ne doit plus promettre « prix et avis » : la page ne
  // montre pas de prix, elle montre un écart daté et le lien qui m\u00e8ne au montant.
  const titre = (tete.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
  if (/prix et avis|\u2014 prix\b/i.test(html_unescape(titre))) {
    problemes.push(`${rel} : le <title> promet un prix que la page n'affiche pas (« ${titre.slice(0, 60)}… »)`);
  }
  // Un domaine revendiqu\u00e9 doit \u00eatre le domaine servi : « iCompare.fr » dans la
  // marque alors que SITE.url est un h\u00f4te mutualis\u00e9 \u00e9tait une promesse fausse.
  // On teste le texte épongé : la marque est rendue « iCompare<span>.fr</span> »,
  // donc une recherche sur le HTML brut ne verrait jamais la revendication.
  const TLD_REVENDIQUÉ = /iCompare\s*[\u00b7.,]?\s*\.?\s*fr\b(?!ançais)/i;
  if (!/\.fr$/.test(new URL(SITE.url).hostname) && TLD_REVENDIQUÉ.test(texte.replace(/<[^>]+>/g, " "))) {
    problemes.push(`${rel} : la marque affiche « iCompare.fr » alors que le site est servi sur ${new URL(SITE.url).hostname} — revendiquer un suffixe qu'on ne poss\u00e8de pas`);
  }
  // Deux fois le même chiffre dans la même carte : c'était le cas du bloc
  // « À comparer avant d'acheter » (−27 % au badge + −27 % dans la phrase).
  for (const a of corps.match(/<a[\s\S]{0,600}?<\/a>/g) || []) {
    const pct = a.match(/\u2212\s?\d+\s?%/g) || [];
    if (pct.length >= 2 && new Set(pct).size === 1) {
      problemes.push(`${rel} : le m\u00eame pourcentage est \u00e9crit deux fois dans le m\u00eame lien (${pct[0]})`);
    }
  }
}

// 11 quater. Le superlatif du comparatif doit \u00eatre soutenu par les donn\u00e9es :
// la carte porteur du badge « plus forte baisse » doit \u00eatre celle de l'\u00e9cart
// maximal. Si un produit d\u00e9passe l'autre au prochain relev\u00e9, le badge doit
// bouger — sinon la page affirme une supériorité que ses propres chiffres démentent.
{
  const avecEcart = PRODUCTS.filter((p) => p.priceNow && p.priceLaunch);
  const ecartDe = (p) => {
    const m = String(p.priceNow).match(/(\d+)/);
    const l = String(p.priceLaunch).match(/(\d+)/);
    return m && l ? 1 - Number(m[1]) / Number(l[1]) : -1;
  };
  const max = avecEcart.slice().sort((a, b) => ecartDe(b) - ecartDe(a))[0];
  const badge = (p) => (p.badge && String(p.badge.label).toLowerCase());
  const porteurs = PRODUCTS.filter((p) => /baisse|\u00e9cart/.test(badge(p) || ""));
  if (porteurs.length && !porteurs.includes(max)) {
    problemes.push(
      `lib/products.js : le badge « ${porteurs[0].badge.label} » est sur ${porteurs[0].id} alors que le plus grand écart calculé est sur ${max.id} (${Math.round(ecartDe(max) * 100)} % contre ${Math.round(ecartDe(porteurs[0]) * 100)} %)`
    );
  }
}

const doublonsTitres = [...vus].filter(([, n]) => n > 1).map(([t, n]) => `${n}× « ${t} »`);
const doublonsDesc = [...descriptions].filter(([, n]) => n > 1).map(([d, n]) => `${n}× « ${d.slice(0, 48)}… »`);
if (doublonsTitres.length) problemes.push(`titles dupliqués (contenu dupliqué SEO) : ${doublonsTitres.join(" | ")}`);
if (doublonsDesc.length) problemes.push(`descriptions dupliquées : ${doublonsDesc.join(" | ")}`);

console.log(
  [
    `pages HTML : ${comptes.pages}`,
    `fiches produit : ${comptes.fiches}`,
    `liens Amazon : ${comptes.liensAmazon}`,
    `liens internes : ${comptes.liensInternes}`,
    `blocs JSON-LD : ${comptes.jsonLd}`,
    `politique prix : ${AFFICHER_MONTANTS ? "montants affichés (SHOW_PRICES=1)" : "aucun montant affiché, aucune Offer, aucun InStock"}`,
    `${comptes.cartesBoutique} cartes boutique · ${comptes.offersVerifiees} Offer recoupées`,
    `tag attendu : ${tag ?? "(aucun — AMAZON_TAG=\"\")"}`,
  ].join(" · ")
);

if (problemes.length) {
  console.error(`\n${problemes.length} problème(s) :`);
  for (const p of problemes) console.error("  ! " + p);
  process.exit(1);
}
console.log("✓ build cohérent : metadata, canonical, liens taggés, JSON-LD, maillage, prix, poids");
