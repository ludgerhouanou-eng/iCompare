// ============================================================
// DONNÉES — iPhone 16 / iPhone 17 / iPhone 18 (comparatif)
//
// Sources :
//  - Fiches techniques officielles Apple (iphone 16, iphone 17)
//  - Presse spécialisée : Les Numériques, Frandroid, Phototrend,
//    idealo (prix constatés)
//  - Rumeurs sourcées pour l'iPhone 18 (non officiel) :
//    Bloomberg / Mark Gurman, Ming-Chi Kuo, Nikkei Asia, MacRumors
// ============================================================

import { amazonLink } from "./site.js";
import { AFFICHER_MONTANTS, PRIX_DATE_FR, ecartProduit } from "./prix.js";

export const UPDATED = "27 août 2026";

export const PRODUCTS = [
  {
    id: "iphone-16",
    name: "iPhone 16",
    tagline: "Le rapport qualité-prix",
    badge: { label: "Meilleur prix", tone: "green" },
    color: "#4a72d8",
    colorDark: "#2c4796",
    colorName: "Ultra marine",
    asin: "B0DGHN7913", // Apple iPhone 16 (128 Go) - amazon.fr
    available: true,
    rumored: false,
    priceLaunch: "969 € (128 Go)",
    priceNow: "≈ 750 – 820 €",
    priceDisplay: "≈ 750 – 820 €",
    priceNote: "Prix constatés sur Amazon, le 27/08/2026",
    colors: ["Noir", "Blanc", "Rose", "Turquoise", "Ultra marine"],
    highlights: [
      "Puce A18",
      "Écran 6,1″ Super Retina XDR",
      "48 MP + 12 MP",
      "Jusqu'à 22 h de vidéo",
    ],
  },
  {
    id: "iphone-17",
    name: "iPhone 17",
    tagline: "Le choix global",
    badge: { label: "Meilleur choix", tone: "blue" },
    color: "#e0813d",
    colorDark: "#9c5420",
    colorName: "Orange",
    asin: "B0FQHLZZLF", // Apple iPhone 17 (256 Go, noir) - amazon.fr
    available: true,
    rumored: false,
    priceLaunch: "969 € (256 Go)",
    priceNow: "859 – 969 €",
    priceDisplay: "dès 859 €",
    priceNote: "Dès 859 € constaté sur Amazon, le 27/08/2026",
    colors: ["Noir", "Blanc", "Bleu", "Orange", "Lavande"],
    highlights: [
      "Puce A19",
      "Écran 6,3″ 120 Hz · 3 000 nits",
      "Double 48 MP",
      "Jusqu'à 30 h de vidéo",
    ],
  },
  {
    id: "iphone-18",
    name: "iPhone 18",
    tagline: "Le futur (rumeurs)",
    badge: { label: "À surveiller", tone: "purple" },
    color: "#7d8595",
    colorDark: "#4d5563",
    colorName: "Titane (attendu)",
    asin: null, // Non commercialisé — aucun lien affilié
    available: false,
    rumored: true,
    priceLaunch: "≈ 969 € (estimation)",
    priceNow: "Non commercialisé",
    priceDisplay: "≈ 969 € (attendu)",
    priceNote: "Sortie du modèle standard attendue au printemps 2027",
    colors: ["Non confirmés (Dark Cherry évoqué pour le Pro)"],
    highlights: [
      "Puce A20 en 2 nm — rumeur",
      "Dynamic Island réduite — rumeur",
      "Modem Apple C2 — rumeur",
      "Printemps 2027 — rumeur",
    ],
  },
];

/** Lien affilié Amazon d'un produit (null si non commercialisé). */
export function productLink(p) {
  if (!p) return null;
  const link = amazonLink({ asin: p.asin || null, link: p.link || null });
  return link;
}

export const VERDICTS = [
  {
    productId: "iphone-16",
    toneClass: "v-green",
    title: "Le meilleur rapport qualité-prix",
    text: "L'iPhone 16 affiche maintenant ses prix les plus bas depuis sa sortie. Puce A18, 48 MP, 22 h de vidéo : c'est l'iPhone « sage » quand le budget compte. Il recevra encore plusieurs années de mises à jour.",
  },
  {
    productId: "iphone-17",
    toneClass: "v-blue",
    title: "Le choix global recommandé",
    text: "120 Hz enfin sur un modèle standard, double caméra 48 MP, 3 000 nits et 30 h d'autonomie : l'iPhone 17 comble presque tous les écarts avec la gamme Pro, au prix de lancement de cette gamme — souvent moins sur Amazon.",
  },
  {
    productId: "iphone-18",
    toneClass: "v-purple",
    title: "À surveiller — pas à attendre",
    text: "Puce A20 gravée en 2 nm, Dynamic Island réduite, Apple Intelligence renforcée : la génération 18 s'annonce sérieuse. Mais la version standard n'arriverait qu'au printemps 2027 : aucune raison de vous en priver 7 mois de plus.",
  },
];

export const FAQS = [
  {
    q: "Quand sort l'iPhone 18 ?",
    a: "Selon les fuites concordantes de la presse spécialisée (Bloomberg/Mark Gurman, Ming-Chi Kuo, Nikkei), Apple scinde sa prochaine génération : les iPhone 18 Pro, Pro Max et le premier modèle pliable seraient présentés en septembre 2026, tandis que l'iPhone 18 standard et l'iPhone 18e glisseraient au printemps 2027 (mars-avril). Rien n'est officiel à ce jour.",
  },
  {
    q: "Puis-je acheter l'iPhone 18 maintenant ?",
    a: "Non. L'iPhone 18 n'est pas encore commercialisé — et la version standard n'est pas attendue avant le printemps 2027. Les seuls iPhone 18 que vous pourrez commander en avant-première seront les modèles Pro (septembre 2026). Méfiez-vous des sites qui vendent un « iPhone 18 » avant cette date : il s'agit d'arnaques.",
  },
  {
    q: "Faut-il attendre l'iPhone 18 ou acheter maintenant ?",
    a: "Si votre priorité est un modèle abordable : non, il faudrait attendre plus de 7 mois pour l'iPhone 18 standard. L'iPhone 17, régulièrement sous son prix de lancement sur Amazon, est un excellent achat en 2026. Si vous visez le haut de gamme, les iPhone 18 Pro de septembre 2026 (A20 Pro, 12 Go de RAM) valent effectivement l'attente.",
  },
  {
    q: "Quelle est la différence principale entre l'iPhone 17 et l'iPhone 16 ?",
    a: "Quatre points marquent l'écart : l'écran passe à 6,3 pouces avec ProMotion 120 Hz et l'Always-On Display, la luminosité grimpe à 3 000 nits (contre 2 000), la caméra ultra grand-angle passe de 12 à 48 MP (macro et meilleure flexibilité), et l'autonomie monte à 30 h de vidéo contre 22 h. Le stockage de base passe aussi de 128 à 256 Go.",
  },
  {
    q: "L'iPhone 16 recevra-t-il encore des mises à jour ?",
    a: "Oui. L'iPhone 16 est sorti avec iOS 18 et reçoit la dernière version (iOS 26). Apple supporte généralement ses iPhone 6 à 7 ans : attendez-vous à plusieurs années de mises à jour, dont les futures versions d'iOS 27, avec Apple Intelligence.",
  },
  {
    q: "Est-ce plus avantageux d'acheter un iPhone sur Amazon ?",
    a: "Amazon propose régulièrement l'iPhone 17 sous le prix conseillé d'Apple, avec une livraison Prime rapide, des retours simples et un paiement en plusieurs fois. La boutique officielle Apple est aussi présente sur Amazon. Le prix varie beaucoup : comparez avant de vous lancer, surtout pendant les événements de vente comme le Prime Day.",
  },
  {
    q: "Que signifie « liens affiliés » ?",
    a: "Quand vous achetez via nos liens Amazon, nous touchons une petite commission d'Amazon, sans aucun supplément pour vous. Cela finance notre travail de comparatif, qui reste indépendant : nous ne mettons pas un produit en avant parce que nous touchons une commission.",
  },
];

/* Barres de l'analyse visuelle (valeurs indexées sur le meilleur) */
export const BARS = [
  {
    label: "Fluidité — taux de rafraîchissement",
    rows: [{ pct: 50, value: "60 Hz" }, { pct: 100, value: "120 Hz" }, { pct: 100, value: "120 Hz (est.)" }],
  },
  {
    label: "Luminosité de pointe",
    rows: [{ pct: 67, value: "2 000 nits" }, { pct: 100, value: "3 000 nits" }, { pct: 100, value: "3 000+ nits (rumeur)" }],
  },
  {
    label: "Performance puce (estimation)",
    rows: [{ pct: 78, value: "A18" }, { pct: 92, value: "A19" }, { pct: 100, value: "A20 (rumeur)" }],
  },
  {
    label: "Système photo",
    rows: [{ pct: 82, value: "48 + 12 MP" }, { pct: 94, value: "Double 48 MP" }, { pct: 100, value: "Amélioré (rumeur)" }],
  },
  {
    label: "Autonomie vidéo (max)",
    rows: [{ pct: 73, value: "22 h" }, { pct: 100, value: "30 h" }, { pct: 100, value: "> 30 h attendu (rumeur)" }],
  },
];

/* Lignes du comparatif rapide (8 critères clés) */
/*
 * Une seule définition des lignes de prix : le tableau rapide du haut de page
 * et le tableau technique du bas les affichaient en double, tapées à la main
 * deux fois — deux occasions de les voir diverger.
 *
 * LIGNE_ECART est affichable sans PA API (écart daté, pas de montant) ;
 * LIGNES_MONTANTS ne sort qu'avec SHOW_PRICES=1.
 */
const LIGNES_MONTANTS = [
  { label: "Prix de lancement", values: ["969 € (128 Go)", "969 € (256 Go)", "≈ 969 € (estimation)"], best: 1 },
  { label: "Prix constaté (août 2026)", values: ["≈ 750 – 820 €", "859 – 969 €", "—"], best: 0 },
];

const LIGNE_ECART = {
  label: `Écart au prix Apple, relevé le ${PRIX_DATE_FR}`,
  values: PRODUCTS.map((p) => {
    const r = ecartProduit(p);
    return r ? `\u2212${r.pourcent} %` : "non commercialisé";
  }),
  best: 0, // le plus fort écart (16) est l'argument de prix de cette ligne
};

export const QUICK_ROWS = [
  { label: "Taux de rafraîchissement", values: ["60 Hz", "120 Hz (ProMotion)", "120 Hz (ProMotion)"], best: [1, 2] },
  { label: "Luminosité de pointe", values: ["2 000 nits", "3 000 nits", "3 000+ nits (rumeur)"], best: 1 },
  { label: "Puce", values: ["A18 (3 nm)", "A19 (3 nm)", "A20 (2 nm, rumeur)"], best: 2 },
  { label: "Photo", values: ["48 + 12 MP", "Double 48 MP", "Double 48 MP amélioré (rumeur)"], best: [1, 2] },
  { label: "Autonomie vidéo (max)", values: ["22 h", "30 h", "> 30 h attendu (rumeur)"], best: 1 },
  { label: "Stockage de base", values: ["128 Go", "256 Go", "256 Go (estimé)"], best: [1, 2] },
  LIGNE_ECART,
  ...(AFFICHER_MONTANTS ? LIGNES_MONTANTS : []),
];

/* Fiches techniques complètes */
export const SPEC_GROUPS = [
  {
    id: "general",
    title: "Informations générales",
    rows: [
      { label: "Statut", values: ["Disponible", "Disponible", "Non sorti"], best: null },
      { label: "Date de sortie", values: ["Septembre 2024", "Septembre 2025", "Printemps 2027 (rumeur)"], best: null },
      LIGNE_ECART,
      ...(AFFICHER_MONTANTS ? LIGNES_MONTANTS : []),
    ],
  },
  {
    id: "ecran",
    title: "Écran",
    rows: [
      { label: "Taille", values: ["6,1″", "6,3″", "6,3″ (estimé)"], best: null },
      { label: "Définition", values: ["2 556 × 1 179 px", "2 622 × 1 206 px", "2 622 × 1 206 px (estimé)"], best: [1, 2] },
      { label: "Taux de rafraîchissement", values: ["60 Hz", "120 Hz (ProMotion)", "120 Hz (ProMotion)"], best: [1, 2] },
      { label: "Luminosité de pointe", values: ["2 000 nits", "3 000 nits", "3 000+ nits (rumeur)"], best: 1 },
      { label: "Always-On Display", values: ["✗", "✓", "✓ (attendu)"], best: [1, 2] },
      { label: "Dynamic Island", values: ["✓", "✓", "Version réduite (rumeur)"], best: null },
      { label: "Verre avant", values: ["Ceramic Shield", "Ceramic Shield 2 (3× plus résistant)", "Ceramic Shield 2 (attendu)"], best: 1 },
    ],
  },
  {
    id: "puce",
    title: "Puce & performances",
    rows: [
      { label: "Puce", values: ["Apple A18", "Apple A19", "Apple A20 (rumeur)"], best: 2 },
      { label: "Gravure", values: ["3 nm", "3 nm", "2 nm (TSMC N2)"], best: 2 },
      { label: "CPU", values: ["6 cœurs", "6 cœurs", "6 cœurs (rumeur)"], best: null },
      { label: "GPU", values: ["5 cœurs", "5 cœurs", "5 cœurs (rumeur)"], best: null },
      { label: "Mémoire vive", values: ["8 Go", "8 Go", "8 Go (rumeur)"], best: null },
      { label: "Stockages", values: ["128 / 256 / 512 Go", "256 / 512 Go", "256 / 512 Go (estimé)"], best: [1, 2] },
    ],
  },
  {
    id: "photo",
    title: "Photo & vidéo",
    rows: [
      { label: "Capteur principal", values: ["48 MP f/1,6", "48 MP f/1,6", "48 MP amélioré (rumeur)"], best: 2 },
      { label: "Ultra grand-angle", values: ["12 MP f/2,2", "48 MP f/2,2", "48 MP (rumeur)"], best: [1, 2] },
      { label: "Zoom", values: ["2× (optique qualité 48 MP)", "2× (optique qualité 48 MP)", "2× (rumeur)"], best: null },
      { label: "Photo macro", values: ["✓", "✓", "✓ (attendu)"], best: null },
      { label: "Caméra avant", values: ["12 MP", "18 MP (Center Stage)", "18 MP (attendu)"], best: [1, 2] },
      { label: "Vidéo max", values: ["4K 60 fps", "4K 60 fps · ralenti 240 fps", "4K 60 fps (attendu)"], best: 1 },
      { label: "Dolby Vision", values: ["✓", "✓", "✓ (attendu)"], best: null },
    ],
  },
  {
    id: "batterie",
    title: "Batterie & charge",
    rows: [
      { label: "Capacité", values: ["3 561 mAh", "3 692 mAh", "Plus grande (rumeur)"], best: 2 },
      { label: "Autonomie vidéo (max)", values: ["22 h", "30 h", "> 30 h attendu (rumeur)"], best: 1 },
      { label: "Charge rapide", values: ["50 % en ~30 min", "50 % en 20 min (~40 W)", "— (non confirmé)"], best: 1 },
      { label: "MagSafe", values: ["25 W", "25 W", "25 W (attendu)"], best: null },
      { label: "Charge sans fil inversée", values: ["✗", "✗", "✗ (rumeur)"], best: null },
    ],
  },
  {
    id: "reseau",
    title: "Réseau & connectivité",
    rows: [
      { label: "5G", values: ["✓", "✓", "✓"], best: null },
      { label: "Modem", values: ["Qualcomm X71", "Qualcomm", "Apple C2 (rumeur)"], best: 2 },
      { label: "Wi-Fi", values: ["6E", "7", "7 (attendu)"], best: [1, 2] },
      { label: "Bluetooth", values: ["5.3", "6", "6 (attendu)"], best: [1, 2] },
      { label: "Port", values: ["USB-C (USB 2.0)", "USB-C (USB 3.0)", "USB-C (USB 3.0, attendu)"], best: [1, 2] },
      { label: "eSIM", values: ["✓", "✓", "✓"], best: null },
      { label: "SOS par satellite", values: ["✓", "✓", "✓ (attendu)"], best: null },
    ],
  },
  {
    id: "conception",
    title: "Conception",
    rows: [
      { label: "Dimensions (H × L × É)", values: ["147,6 × 71,6 × 7,8 mm", "149,6 × 71,5 × 8 mm", "≈ 150 × 71,5 × 7,8 mm (estimé)"], best: null },
      { label: "Poids", values: ["170 g", "177 g", "≈ 175 g (estimé)"], best: 0 },
      { label: "Résistance", values: ["IP68 (6 m / 30 min)", "IP68 (6 m / 30 min)", "IP68 (attendu)"], best: null },
      { label: "Coloris", values: ["5 coloris", "5 coloris", "Non confirmés"], best: null },
    ],
  },
  {
    id: "logiciel",
    title: "Logiciel",
    rows: [
      { label: "iOS de lancement", values: ["iOS 18", "iOS 26", "iOS 27 (attendu)"], best: 2 },
      { label: "Apple Intelligence (FR)", values: ["✓ (depuis iOS 26,4)", "✓", "✓ renforcée (rumeur)"], best: 2 },
      { label: "Mises à jour estimées", values: ["Jusqu'en 2030", "Jusqu'en 2031", "Jusqu'en 2033 (estimation)"], best: 2 },
    ],
  },
];
