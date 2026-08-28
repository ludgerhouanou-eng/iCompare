# Suivi du trafic — relevé du lundi (15 minutes)

Un tableau par semaine, trois colonnes qui décident. L'intérêt n'est pas la
statistique : c'est de pouvoir dire, trois mois plus tard, **quel canal a
produit une vente** — et de couper ce qui n'en produit jamais.

## Où lire chaque chiffre

| Ce qu'on note | Où | Ce que ça veut dire |
| --- | --- | --- |
| Impressions / clics / requêtes | Google Search Console → Performance (propriété *préfixe d'URL* `https://icomparev2.vercel.app`) | les impressions montent = Google teste vos pages ; les clics montent = vos titres sont lisibles |
| Pages indexées | GSC → Pages → « Pourquoi les pages ne sont pas indexées » | un site de 30 pages qui affiche 12 pages indexées a un problème de maillage, pas de contenu |
| Clics / commandes / conversions | Tableau de bord Partenaires Amazon | le seul indicateur qui compte ici : un clic Amazon = une intention d'achat |
| Ventes qualifiantes | Partenaires → « Adhésion » (dont l'échéance des 180 jours) | 3 ventes = accès à la PA API, donc aux prix officiels **et** aux visuels officiels |
| Liens entrants | Ahrefs Webmaster Tools (gratuit, 1 domaine vérifié) | ce qui explique le progrès en 2026 ; si ça ne bouge pas, le SEO plafonne |

Une ligne vide n'est pas un échec : c'est la donnée qui dit qu'il faut changer
de canal cette semaine-là.

## Hebdomadaire

| Semaine | Impressions | Clics GSC | Pages indexées | Clics Amazon | Commandes | Liens entrants | Décision prise |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 (____) | | | | | | | |
| S2 (____) | | | | | | | |
| S3 (____) | | | | | | | |
| S4 (____) | | | | | | | |
| S5 (____) | | | | | | | |
| S6 (____) | | | | | | | |
| S7 (____) | | | | | | | |
| S8 (____) | | | | | | | |
| S10 (____) | | | | | | | |
| S12 (____) | | | | | | | |

## Par page : la règle des 8 semaines

Un guide (ou une fiche) sans **aucune** impression mesurée après 8 semaines :
1. réécrire le `<title>` et le premier `<h2>` sur la formulation réelle de la
   requête (lue dans GSC → Requêtes, pas devinée) ;
2. si rien après 4 nouvelles semaines : fusionner avec une page voisine et
   laisser une redirection, plutôt que d'empiler une page morte de plus —
   l'accumulation de pages à faible valeur est ce que Google appelle un abus de
   contenu à l'échelle.

| Page | Première impression (semaine) | Requêtes qui l'ont fait voir | Clics Amazon | Verdict |
| --- | --- | --- | --- | --- |
| `/guides/ios-26-quels-iphone-compatibles` | | | | |
| `/guides/apple-intelligence-verifier-iphone` | | | | |
| `/guides/verifier-garantie-iphone-numero-de-serie` | | | | |
| `/guides/esim-iphone-compatibilite` | | | | |
| `/guides/iphone-verrouille-operateur-comment-verifier` | | | | |
| `/guides/quel-chargeur-pour-iphone` | | | | |
| `/guides/iphone-renewed-ce-que-ca-couvre` | | | | |
| `/guides/ios-26-sur-iphone-13-14-15` | | | | |
| `/boutique` | | | | |
| `/comparatif` | | | | |

## Relevé des écarts (le jeu de données qui rend citable)

15 minutes par semaine, même jour, même heure. Ce fichier garde la trace ; le
site n'affiche que l'écart daté, jamais un prix du jour — c'est la ligne que le
règlement du Programme Partenaires impose, et c'est aussi ce qui rendra ces
chiffres publiables sans risque.

| Date | Produit | Écart constaté vs prix de lancement Apple | Vendeur | Note |
| --- | --- | --- | --- | --- |
| 2026-08-27 | iPhone 16 | −23 % | Amazon.fr | relevé initial du catalogue |
| 2026-08-27 | iPhone 17 | −11 % | Amazon.fr | idem |
| | | | | |

Après huit relevés : une note de synthèse (« ce que devient un iPhone dans les
90 jours qui suivent une keynote »), envoyée à deux médias tech. C'est le seul
média-level lien qu'un domaine neuf peut obtenir sans en acheter un.
