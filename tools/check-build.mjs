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

const APP = join(".next", "server", "app");
const TAILLE_MAX_KO = 220; // HTML d'une page, en Ko — au-delà, on a déraillé

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
