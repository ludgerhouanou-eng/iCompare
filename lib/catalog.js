// ============================================================
// CATALOGUE BOUTIQUE — sélection Apple (affiliation Amazon)
// Prix constatés sur Amazon.fr le 27/08/2026.
// Sources : pages produits Amazon.fr + presse spécialisée
// (Numerama, Les Numériques, Consomac…).
// ============================================================

import { amazonLink } from "./site.js";

export const CATALOG_UPDATED = "27 août 2026";

export const CATEGORIES = [
  {
    id: "watch",
    name: "Apple Watch",
    icon: "⌚",
    blurb: "SE 3, Series 11, Ultra 3",
    longBlurb:
      "Trois montres, trois budgets : l'entrée de gamme complète (SE 3), l'équilibre santé au quotidien (Series 11, première mesure de tension artérielle) et le modèle d'exception pour l'extérieur (Ultra 3, satellite, 42 h d'autonomie).",
  },
  {
    id: "iphone",
    name: "Anciens iPhone",
    icon: "📱",
    blurb: "17e, 16, 15, 13 (renewed)",
    longBlurb:
      "Les générations précédentes : les meilleures économies du catalogue. Tous supportent iOS 26 et Apple Intelligence, et l'iPhone 13 « Renewed » est le choix étudiant/famille — le moins cher de la sélection.",
  },
  {
    id: "ipad",
    name: "iPad",
    icon: "📲",
    blurb: "A16 & Air M3",
    longBlurb:
      "L'iPad (A16) est le choix par défaut : 11 pouces, Apple Intelligence, une journée d'autonomie. L'iPad Air (M3) ajoute la compatibilité Apple Pencil Pro et Magic Keyboard pour dessiner et travailler.",
  },
  {
    id: "audio",
    name: "Audio & casques",
    icon: "🎧",
    blurb: "Pro 3, 4, Max 2",
    longBlurb:
      "Trois niveaux : les AirPods 4 (ANC) pour le quotidien, les AirPods Pro 3 (meilleure réduction de bruit du segment, capteur cardiaque) et les AirPods Max 2, la référence supra-auriculaire.",
  },
  {
    id: "accessoires",
    name: "Accessoires",
    icon: "⚡",
    blurb: "Chargers & câbles",
    longBlurb:
      "L'indispensable pour accompagner vos achats : le chargeur officiel Apple 30 W pour la charge rapide, et des chargeurs de montre certifiés MFi pour toujours avoir un câble de secours.",
  },
];

export const BOUTIQUE_PRODUCTS = [
  // ---------- Apple Watch ----------
  {
    id: "watch-se3",
    name: "Apple Watch SE 3",
    sub: "GPS · 40 mm · Starlight",
    category: "watch",
    kind: "watch",
    badge: "Petit prix",
    badgeTone: "green",
    tagline:
      "Puce S10 (celle de la Series 10), écran Always-On, 18 h d'autonomie (32 h en mode basse conso). Tout l'essentiel de l'Apple Watch, au meilleur tarif.",
    price: "≈ 225 – 270 €",
    priceNote: "Prix constaté Amazon, 27/08/2026 (269 € au lancement)",
    asin: "B0FQG55GFH",
    artColor: "#e8e6e3",
    artDark: "#b9b5b0",
  },
  {
    id: "watch-series-11",
    name: "Apple Watch Series 11",
    sub: "GPS · 42 mm · Obsidienne",
    category: "watch",
    kind: "watch",
    badge: "Meilleur choix",
    badgeTone: "blue",
    tagline:
      "Première mesure de tension artérielle sur une Apple Watch, ECG, score de sommeil, 2 000 nits, 24 h d'autonomie (38 h en basse conso). Le modèle « sans hésiter » du quotidien.",
    price: "≈ 330 – 450 €",
    priceNote: "Prix constaté Amazon, 27/08/2026 (449 € au lancement)",
    asin: "B0FQFRSQLR",
    artColor: "#2a2a2e",
    artDark: "#141416",
  },
  {
    id: "watch-ultra-3",
    name: "Apple Watch Ultra 3",
    sub: "GPS + Cellular · 49 mm · Titane noir",
    category: "watch",
    kind: "watch",
    badge: "Premium",
    badgeTone: "purple",
    tagline:
      "Titane, 3 000 nits, GPS double fréquence, communications par satellite, 5G incluse, 42 h d'autonomie (72 h en mode basse conso). Le nec plus ultra pour l'aventure.",
    price: "≈ 800 – 900 €",
    priceNote: "Prix constaté Amazon, 27/08/2026 (899 € au lancement)",
    asin: "B0FQG23TB7",
    artColor: "#3a3f46",
    artDark: "#1e2126",
  },

  // ---------- Anciens iPhone ----------
  {
    id: "iphone-17e",
    name: "iPhone 17e",
    sub: "256 Go · Noir",
    category: "iphone",
    kind: "phone",
    badge: "Petit prix",
    badgeTone: "green",
    tagline:
      "L'entrée de gamme 2026 : puce A19, 6,1″, caméra 48 MP avec zoom 2×, Apple Intelligence, 256 Go de base. L'iPhone « simple et fiable » de la génération en cours.",
    price: "≈ 650 – 720 €",
    priceNote: "Prix constaté Amazon, 27/08/2026 (719 € au lancement)",
    asin: "B0GQWCGCJ1",
    artColor: "#e8b7c4",
    artDark: "#b57f95",
  },
  {
    id: "iphone-16",
    name: "iPhone 16",
    sub: "128 Go · Blanc",
    category: "iphone",
    kind: "phone",
    badge: "Génération 2024",
    badgeTone: "blue",
    tagline:
      "A18, 6,1″, double 48 + 12 MP, 22 h de vidéo : la précédente génération, déjà nettement sous son prix de lancement. Le choix « sage ».",
    price: "≈ 819 €",
    priceNote: "Prix constaté Amazon, 27/08/2026 (969 € au lancement)",
    asin: "B0DGHN7913",
    artColor: "#f5f5f7",
    artDark: "#c9c9ce",
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    sub: "128 Go · Noir",
    category: "iphone",
    kind: "phone",
    badge: "Bon plan",
    badgeTone: "amber",
    tagline:
      "Dynamic Island, USB-C, A16 Bionic et encore des années de mises à jour — nettement moins cher qu'un iPhone 16. Le meilleur rapport qualité-prix du catalogue.",
    price: "≈ 620 – 705 €",
    priceNote: "Prix constaté Amazon, 27/08/2026",
    asin: "B0CHXFCYCR",
    artColor: "#2a2a2e",
    artDark: "#101012",
  },
  {
    id: "iphone-13",
    name: "iPhone 13 (Renewed)",
    sub: "128 Go · Minuit · Reconditionné",
    category: "iphone",
    kind: "phone",
    badge: "Renouvelé",
    badgeTone: "gray",
    tagline:
      "Programme Amazon Renewed : 90 jours pour changer d'avis et 1 an de garantie incluse. Le choix budget étudiant/famille, encore très correct avec iOS 26.",
    price: "≈ 380 – 450 €",
    priceNote: "Prix constaté Amazon Renewed, 27/08/2026 (selon état)",
    asin: "B09MGFJK73",
    artColor: "#23252b",
    artDark: "#0e1013",
  },

  // ---------- iPad ----------
  {
    id: "ipad-a16",
    name: "iPad (11e gén., A16)",
    sub: "256 Go · Argent · Wi-Fi",
    category: "ipad",
    kind: "ipad",
    badge: "Le choix par défaut",
    badgeTone: "blue",
    tagline:
      "11″ Liquid Retina, puce A16 (celle de l'iPhone 15), Apple Intelligence, autonomie d'une journée, USB-C. La tablette « tout le monde » à prix correct.",
    price: "≈ 530 – 610 €",
    priceNote: "Prix constaté Amazon, 27/08/2026 (689 € au lancement, 256 Go)",
    asin: "B0DZ769BMS",
    artColor: "#e3e4e8",
    artDark: "#b9bcc4",
  },
  {
    id: "ipad-air-m3",
    name: "iPad Air 11 (M3)",
    sub: "128 Go · Bleu · Wi-Fi",
    category: "ipad",
    kind: "ipad",
    badge: "Dessiner & travailler",
    badgeTone: "purple",
    tagline:
      "Puce M3, Wi-Fi 6E, compatible Apple Pencil Pro et Magic Keyboard. Pour les cours, la retouche photo, la prise de notes et le vrai travail nomade.",
    price: "≈ 530 – 670 €",
    priceNote: "Prix constaté Amazon, 27/08/2026 (719 € au lancement)",
    asin: "B0DZ76441X",
    artColor: "#5a7fb8",
    artDark: "#33517f",
  },

  // ---------- Audio ----------
  {
    id: "airpods-pro-3",
    name: "AirPods Pro 3",
    sub: "Boîtier MagSafe USB-C",
    category: "audio",
    kind: "buds",
    badge: "Meilleur choix",
    badgeTone: "blue",
    tagline:
      "La meilleure réduction de bruit du segment, capteur de fréquence cardiaque pendant les séances, traduction instantanée, 8 h d'autonomie. En promo sur Amazon en ce moment.",
    price: "198 € (au lieu de 249 €)",
    priceNote: "Prix constaté Amazon, 27/08/2026",
    asin: "B0FQF32239",
    artColor: "#f4f4f8",
    artDark: "#d2d2d7",
  },
  {
    id: "airpods-4",
    name: "AirPods 4 (ANC)",
    sub: "Avec réduction active de bruit",
    category: "audio",
    kind: "buds",
    badge: "Petit prix",
    badgeTone: "green",
    tagline:
      "Puce H2, réduction active du bruit, audio adaptatif et mode Transparence, 30 h avec le boîtier. L'ANC au meilleur prix d'Apple.",
    price: "≈ 160 – 199 €",
    priceNote: "Prix constaté Amazon, 27/08/2026 (199 € au lancement)",
    asin: "B0DGHYDYJL",
    artColor: "#f4f4f8",
    artDark: "#d2d2d7",
  },
  {
    id: "airpods-max-2",
    name: "AirPods Max 2",
    sub: "Minuit",
    category: "audio",
    kind: "headphones",
    badge: "Premium",
    badgeTone: "purple",
    tagline:
      "1,5× plus de réduction de bruit que la génération précédente, audio Lossless en USB-C, 20 h d'écoute, Smart Case. La référence supra-auriculaire.",
    price: "≈ 555 – 579 €",
    priceNote: "Prix constaté Amazon, 27/08/2026 (579 € au lancement)",
    asin: "B0GSS4M55K",
    artColor: "#2f3138",
    artDark: "#17181d",
  },

  // ---------- Accessoires ----------
  {
    id: "apple-30w",
    name: "Chargeur Apple 30 W USB-C",
    sub: "Adaptateur secteur officiel",
    category: "accessoires",
    kind: "charger",
    badge: "Officiel Apple",
    badgeTone: "gray",
    tagline:
      "Le chargeur officiel pour exploiter la charge rapide de l'iPhone (jusqu'à ~30 W) et des iPad. Compact, et la référence fiabilité.",
    price: "≈ 35 – 45 €",
    priceNote: "Prix constaté Amazon, 27/08/2026",
    asin: "B08FCSS581",
    artColor: "#f4f4f8",
    artDark: "#d2d2d7",
  },
  {
    id: "watch-cable-aoozto",
    name: "Chargeur Apple Watch USB-C (MFi)",
    sub: "AOOZTO · Certifié Apple · 1 m",
    category: "accessoires",
    kind: "cable",
    badge: "MFi certifié",
    badgeTone: "blue",
    tagline:
      "Câble magnétique certifié Apple (MFi), compatible toutes les Apple Watch actuelles (SE, Series, Ultra). Le câble de secours indispensable.",
    price: "≈ 14,50 €",
    priceNote: "Prix constaté Amazon, 27/08/2026",
    asin: "B0DWMPW319",
    brand: "AOOZTO",
    artColor: "#f4f4f8",
    artDark: "#d2d2d7",
  },
  {
    id: "watch-charger-ruxely",
    name: "Chargeur magnétique Apple Watch 5 W",
    sub: "RUXELY · Dual USB-C / Lightning",
    category: "accessoires",
    kind: "cable",
    badge: "Top ventes Amazon",
    badgeTone: "amber",
    tagline:
      "4,4/5 sur plus de 2 000 avis Amazon. Connecteur double USB-C et Lightning : se branche directement sur un iPhone en cas de besoin.",
    price: "≈ 14 €",
    priceNote: "Prix constaté Amazon, 27/08/2026",
    asin: "B0F1C4XV6B",
    brand: "RUXELY",
    artColor: "#f4f4f8",
    artDark: "#d2d2d7",
  },
];

/**
 * Lien affilié Amazon d'un produit du catalogue.
 * Accepte l'objet produit (recommandé : il peut porter un `link`
 * court dédié) ou un ASIN nu.
 */
export function productLink(product) {
  const { asin = null, link = null } = typeof product === "string" ? { asin: product } : product || {};
  return amazonLink({ asin, link });
}
