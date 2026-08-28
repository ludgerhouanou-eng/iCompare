// ============================================================
// TABLE DE COMPATIBILITÉ MATÉRIELLE — source unique des guides
// ============================================================
// Pourquoi ce fichier : la compatibilité iOS / Apple Intelligence est le
// genre de donnée qu'on recycle mal — un « compatible » arrondi ici, une
// omission là, et le site ment sur une fiche. Les guides, la FAQ et les
// encarts boutique lisent TOUS ce tableau ; `npm run check` vérifie les
// valeurs qui ont fait l'objet d'une erreur par le passé (iPhone 15 et 13
// sans Apple Intelligence, iPad A16 idem).
//
// Sources consultées le 28 août 2026 :
//   • Wikipedia, « iOS 26 » — appareils pris en charge (A13 minimum pour
//     iOS 26 ; A17 Pro + 8 Go de RAM minimum pour Apple Intelligence) ;
//   • MacWorld, « iOS compatibility: What iOS version can your iPhone run »
//     (juin 2026) — dernière version par modèle, iOS 26.6 en distribution ;
//   • itechguides, « iOS 26 Supported Devices » (août 2026) — 31 iPhone
//     compatibles iOS 26, plancher Apple Intelligence au 15 Pro ;
//   • rottenwifi, « Which iPad models support Apple Intelligence » (août
//     2026) — formule d'Apple : « iPad mini (A17 Pro), and iPad models with
//     M1 and later », donc l'iPad (A16) 2025 est EXCLU.
//
// Une puce et une RAM ne suffisent pas toujours : certaines fonctions
// (Visual Intelligence, Adaptive Power, scènes spatiales) ont leur propre
// plancher matériel, et la disponibilité dépend de la langue et du pays.
// C'est le rôle du champ `notes`, jamais d'un « tout est compatible ».

/** Exigence Apple Intelligence, telle qu'Apple la formule. */
export const REGLE_IA = {
  iphone: "puce A17 Pro ou plus récente, avec 8 Go de mémoire",
  ipad: "iPad mini (A17 Pro) ou tout iPad à puce M1 ou plus récente",
  mac: "tout Mac à puce Apple (M1 ou plus récente)",
};

/**
 * `ios26` : le modèle peut installer iOS 26 (et donc la famille 26.x).
 * `ia`    : Apple Intelligence est disponible sur le modèle.
 * `max`   : dernière version majeure disponible quand ce n'est pas iOS 26.
 */
export const IPHONE = [
  { modele: "iPhone 11", puce: "A13", ram: "4 Go", ios26: true, ia: false },
  { modele: "iPhone 11 Pro / Pro Max", puce: "A13", ram: "4 Go", ios26: true, ia: false },
  { modele: "iPhone SE (2ᵉ génération)", puce: "A13", ram: "3 Go", ios26: true, ia: false },
  { modele: "iPhone 12 / 12 mini", puce: "A14", ram: "4 Go", ios26: true, ia: false },
  { modele: "iPhone 12 Pro / Pro Max", puce: "A14", ram: "6 Go", ios26: true, ia: false },
  { modele: "iPhone 13 / 13 mini", puce: "A15", ram: "4 Go", ios26: true, ia: false },
  { modele: "iPhone 13 Pro / Pro Max", puce: "A15", ram: "6 Go", ios26: true, ia: false },
  { modele: "iPhone SE (3ᵉ génération)", puce: "A15", ram: "4 Go", ios26: true, ia: false },
  { modele: "iPhone 14 / 14 Plus", puce: "A15", ram: "6 Go", ios26: true, ia: false },
  { modele: "iPhone 14 Pro / Pro Max", puce: "A16", ram: "6 Go", ios26: true, ia: false },
  { modele: "iPhone 15 / 15 Plus", puce: "A16", ram: "6 Go", ios26: true, ia: false },
  { modele: "iPhone 15 Pro / Pro Max", puce: "A17 Pro", ram: "8 Go", ios26: true, ia: true },
  { modele: "iPhone 16 / 16 Plus", puce: "A18", ram: "8 Go", ios26: true, ia: true },
  { modele: "iPhone 16 Pro / Pro Max", puce: "A18 Pro", ram: "8 Go", ios26: true, ia: true },
  { modele: "iPhone 16e", puce: "A18", ram: "8 Go", ios26: true, ia: true },
  { modele: "iPhone 17 / 17e", puce: "A19", ram: "8 Go", ios26: true, ia: true },
  { modele: "iPhone 17 Pro / Pro Max", puce: "A19 Pro", ram: "12 Go", ios26: true, ia: true },
  { modele: "iPhone Air", puce: "A19 Pro", ram: "12 Go", ios26: true, ia: true },
  { modele: "iPhone XR", puce: "A12", ram: "3 Go", ios26: false, max: "iOS 18" },
  { modele: "iPhone XS / XS Max", puce: "A12", ram: "4 Go", ios26: false, max: "iOS 18" },
  { modele: "iPhone X", puce: "A11", ram: "3 Go", ios26: false, max: "iOS 16" },
  { modele: "iPhone 8 / 8 Plus", puce: "A11", ram: "2-3 Go", ios26: false, max: "iOS 16" },
  { modele: "iPhone 7 / 7 Plus", puce: "A10", ram: "2 Go", ios26: false, max: "iOS 15" },
  { modele: "iPhone SE (1ʳᵉ génération)", puce: "A9", ram: "2 Go", ios26: false, max: "iOS 15" },
  { modele: "iPhone 6s / 6s Plus", puce: "A9", ram: "2 Go", ios26: false, max: "iOS 15" },
];

/** iPad : la règle n'est pas la puce Axx, c'est M1 (ou l'exception mini A17 Pro). */
export const IPAD = [
  { modele: "iPad (A16), 11ᵉ génération", puce: "A16", ios26: true, ia: false },
  { modele: "iPad (10ᵉ génération)", puce: "A14", ios26: true, ia: false },
  { modele: "iPad mini (A17 Pro)", puce: "A17 Pro", ios26: true, ia: true },
  { modele: "iPad mini (6ᵉ génération)", puce: "A15", ios26: true, ia: false },
  { modele: "iPad Air (M2 / M3 / M4)", puce: "M1 ou plus", ios26: true, ia: true },
  { modele: "iPad Air (4ᵉ génération)", puce: "A14", ios26: true, ia: false },
  { modele: "iPad Pro 11ᵉ/12,9ᵉ (M1 et suivants)", puce: "M1 ou plus", ios26: true, ia: true },
  { modele: "iPad Pro 11ᵉ gen (A12X) / 12,9ᵉ 3ᵉ gen (A12X)", puce: "A12X", ios26: true, ia: false },
];

/** eSIM côté iPhone, en France. `importUs` = modèle sans tiroir physique. */
export const ESIM = {
  depuis: "iPhone XS / XR / SE 2",
  sansTiroirPhysique: [
    "iPhone 14, 14 Plus, 14 Pro, 14 Pro Max",
    "iPhone 15, 15 Plus, 15 Pro, 15 Pro Max",
    "iPhone 16, 16 Plus, 16 Pro, 16 Pro Max, 16e",
    "iPhone 17, 17 Pro, 17 Pro Max, 17e, iPhone Air",
  ],
  note:
    "Liste valable pour les exemplaires vendus aux États-Unis. Un iPhone " +
    "américain récent n'a donc pas de tiroir nano-SIM : à vérifier avant " +
    "d'acheter un import ou un reconditionné, parce qu'un opérateur français " +
    "peine parfois à activer une eSIM sur une ligne prépayée.",
};

/** Recherche dans la table iPhone (par sous-chaîne, insensible à la casse). */
export function modeleCorrespon(cible, liste = IPHONE) {
  const c = cible.toLowerCase();
  return liste.filter((m) => m.modele.toLowerCase().includes(c));
}

/** Date de la vérification, à afficher à côté de chaque tableau. */
export const TABLE_VERIF_ISO = "2026-08-28";
export const TABLE_VERIF_FR = "28 août 2026";
export const TABLE_SOURCES = [
  {
    nom: "Wikipedia — iOS 26 (appareils pris en charge)",
    url: "https://en.wikipedia.org/wiki/IOS_26",
  },
  {
    nom: "MacWorld — iOS compatibility, par modèle",
    url: "https://www.macworld.com/article/1811287/which-version-of-ios-can-my-iphone-run.html",
  },
  {
    nom: "itechguides — iOS 26 Supported Devices",
    url: "https://www.itechguides.com/ios-26-supported-devices-check-whether-your-iphone-can-update/",
  },
  {
    nom: "rottenwifi — iPad et Apple Intelligence (exigence M1 / A17 Pro)",
    url: "https://rottenwifi.com/which-ipad-models-support-apple-intelligence-and-which-dont-2026-guide/",
  },
];
