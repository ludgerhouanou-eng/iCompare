# iCompare — Comparateur iPhone & boutique Apple

Site SEO **iPhone 16 vs 17 vs 18 + boutique Apple** (affiliation Amazon.fr), 100 % en français.
**Stack : Next.js 15 (App Router) + React 19** — 9 pages 100 % statiques, ~100 kB First Load,
prêt pour **Vercel**.

> ⚠️ Version antérieure en WordPress conservée dans le workspace (`/home/user/wordpress/`)
> comme backup. La version livrée ici est celle à déployer sur Vercel.

## Lancer le site

```bash
npm install
npm run dev     # développement (port 3000)
npm run build   # production
npm run check   # contrôle le HTML LIVRÉ (voir « Contrôle du build »)
npm run start   # sert le build
```

## Contrôle du build (`npm run check`)

`tools/check-build.mjs` ne teste pas le code, il teste **ce que le visiteur
reçoit** : il lit le HTML statique sorti par Next et vérifie, page par page —

- un seul `<h1>`, un `<title>` et une `description` présents et **uniques à
  l'échelle du site** (le contrôle a attrapé 17 fiches qui partageaient le
  `<title>` de la page mère, après qu'une réécriture eut fait disparaître
  `generateMetadata` : le build, lui, passait) ;
- `rel=canonical` présent et cohérent avec l'URL de la page ;
- chaque lien Amazon portant le tag d'associé configuré, `rel="sponsored"`,
  sans `?tag=` vide ;
- aucun `href="null"` (produit non vendu → bouton masqué, pas lien cassé) ;
- chaque bloc JSON-LD parsable ;
- **aucune page avec un montant** : zéro « € » dans le HTML visible des 21
  pages, aucune `Offer` (ni `AggregateOffer`) dans les JSON-LD, aucun
  `InStock` — et 15 boutons « Consulter le prix sur Amazon » pour 15 cartes
  rendues sur `/boutique`. La règle lit le drapeau `AFFICHER_MONTANTS` de
  `lib/prix.js`, celui-là même que lisent les gabarits ; avec `SHOW_PRICES=1`,
  elle bascule et recontrôle que chaque `Offer` égale le minimum du montant
  affiché sur la même page, `euroMini()` étant **importée de `lib/prix.js`**
  et non réécrite ici (un test qui réimplémente la logique du site ne teste
  que lui-même) ;
- chaque lien interne correspondant à une page réellement construite ;
- aucun poids de page anormal (> 220 Ko : signe qu'une page mérite d'être
  découpée) et aucun placeholder (`votretag`, `votredomaine`) dans le HTML.

Il sort **code 1** au premier problème : à passer avant chaque déploiement
(ou en CI). Un contrôle qui ne peut pas échouer ne protège rien — il a été
validé en retirant volontairement le canonical de l'accueil, ce qu'il a
signalé.

## Déployer sur Vercel (2 façons)

**A. Via le dashboard (recommandé)**
1. Poussez le dépôt sur GitHub (voir ci-dessous).
2. vercel.com → *Add New… → Project* → connectez votre GitHub → importez le dépôt.
3. Vercel détecte automatiquement Next.js → **Deploy**.
4. Le site est en ligne sur `https://<projet>.vercel.app`.
5. **Important** : `SITE.url` retombe déjà sur `https://icomparev2.vercel.app`
   (le domaine de production). Le jour où un domaine personnel pointe ici,
   réglez `SITE_URL` dans Vercel → *Settings → Environment Variables* — rien à
   repousser, un redéploiement suffit.

**B. Via le CLI**
```bash
npm i -g vercel
vercel        # première fois : configuration interactive
vercel --prod # mise en production
```

Aucune variable d'environnement n'est nécessaire pour publier : les valeurs par
défaut de `lib/site.js` et `lib/prix.js` sont celles de la production. Trois
surcharges existent — `SITE_URL` (domaine), `AMAZON_TAG` (identifiant
partenaire du marché lié), `AMAZON_DOMAIN` (marché) — plus `SHOW_PRICES=1`, qui
réaffiche les montants **uniquement** une fois la PA API branchée derrière.

## Structure

```
app/
  layout.jsx          → header, nav, footer, métas globales
  page.jsx            → Accueil (/) : hero + DIAPORAMA + 3 cartes iPhone
  comparatif/page.jsx → Page SEO principale : 35 specs, écarts datés, rumeurs, FAQ
  boutique/page.jsx   → 5 rayons cliquables (espace d'achat Amazon) + 15 produits
                        avec un visuel par produit
  guides/page.jsx     → index des guides de vérification (trafic longue traîne)
  guides/[slug]/      → 8 guides prérendus, une question par URL, 404 sinon
  globals.css         → design system (blanc + teintes bleu/rose)
  sitemap.js          → 21 URL (utilise SITE.url)
  robots.js           → robots.txt + lien vers le sitemap
components/
  HeroSlider.jsx      → diaporama (auto, flèches, points, swipe)
  PhoneSVG.jsx        → illustration iPhone (fallback sans photo)
  ProductArt.jsx      → illustrations SVG boutique (fallback sans image)
  SpecTable.jsx       → tableau comparatif 3 colonnes
  SpecBars.jsx        → barres visuelles écran/puce/batterie
  FaqItem.jsx, Disclosure.jsx, BuyBar.jsx, BoutiqueClient.jsx
lib/
  site.js             → ⚙️ DOMAINE + TAG AMAZON (à renseigner !) + espaces du store Apple
  products.js         → iPhone 16/17/18 : specs, verdicts, FAQ, barres
  catalog.js          → 15 produits boutique (champ "image" à renseigner)
  guides.js           → 8 guides : questions, réponses, FAQ, sources, maillage
  modeles.js          → table de compatibilité (iOS 26 / Apple Intelligence), source unique
public/
  produits/           → 5 illustrations de rayon (JPG 14-27 Ko, dessinées pour le site)
  phones/             → rendus iPhone (gamme, face à face, 16, 17, 18)
  og-comparatif.jpg   → image Open Graph
```

## Affiliation Amazon (état de la configuration)

Un **identifiant de suivi est posé sur chaque lien sortant** :
`ludgerhouanou-21`, relevé dans un lien que l'éditeur a fourni (et qui se
termine par le suffixe des programmes européens). Tous les liens du site sont
fabriqués par `amazonLink()` dans `lib/site.js`, donc rien ne part « nu » ni
avec un tag collé deux fois : **53 liens Amazon sur les 21 pages** — 25 sur
`/`, `/comparatif` et `/boutique` (16 ASIN distincts), 12 sur `/bons-plans`
dont le bouton « toutes les offres », 16 sur les fiches produit (la fiche
iPhone 18 en est dépourvue : aucun ASIN vérifié n'existe pour ce modèle). Les
URL des données structurées JSON-LD portent le même tag.

Un `next build` **avertit dans les journaux** si la configuration ne peut pas
créditer de commission (tag placeholder ou absent, suffixe non reconnu, ou
suffixe qui ne couvre pas le domaine lié). Rien n'est affiché au visiteur.
`npm run check` recontrôle le résultat sur le HTML livré : un lien sans tag ou
sans `rel="sponsored"` fait échouer le build.

### Le tag : quel suffixe pour quel programme

Un identifiant partenaire Amazon porte le suffixe du **programme national** qui
encaisse. Deux points à retenir, vérifiés dans l'aide officielle plutôt que
devinés :

- Les programmes **européens** (France, Allemagne, Espagne, Italie,
  Royaume-Uni, Pays-Bas, Pologne, Suède…) partagent le suffixe **`-21`** :
  l'aide Partenaires Amazon FR indique que « notre logiciel ajoute
  automatiquement `-21` à la fin de toutes les identifications partenaires ».
  Il n'y a donc **pas** de suffixe français dédié — un `-84` serait un tag
  inconnu d'Amazon, donc non rémunéré.
- Le programme **États-Unis / Canada** utilise **`-20`**.

Le site relie `amazon.fr` et est en euros : `lib/site.js` utilise donc
`ludgerhouanou-21`. **Cet identifiant est bien celui de l'éditeur** — confirmé
le 28 août 2026 ; ce n'est donc pas un tag de courtoisie emprunté à un compte
tiers, et il ne faut pas le remplacer par `icompare0d-20`, qui appartient au
programme américain. `affiliateIssues()` compare le suffixe au domaine et
avertit au build en cas d'incohérence — c'est ce contrôle qui avait signalé, à
juste titre, le tag `-20` sur des liens `.fr`.

Une chose reste **à vérifier dans le tableau de bord**, le code ne peut pas la
voir : que le compte Partners qui porte `ludgerhouanou-21` **rémunère bien la
France** — c'est-à-dire que `www.amazon.fr` figure dans ses marchés (Account
settings → Markets / « Earn globally »), avec profil fiscal et moyen de
paiement validés pour ce marché. Un compte qui n'a pas la France dans ses
marchés ne crédite rien, quel que soit le suffixe collé dans l'URL. Deux
autres cases conditionnent le versement, et elles sont hors du dépôt :

- le **domaine du site doit être déclaré** dans le compte (Account settings →
  Website list) : sans déclaration, les clics ne sont pas attribués ;
- **3 ventes qualifiantes dans les 180 jours** suivant l'inscription, sinon le
  compte est fermé et les commissions en cours sont perdues.

### Le lien `link.amazon` n'est pas un lien produit

Vous avez fourni `https://link.amazon/B06gD11hu`. Mesuré : il renvoie vers
`amzlinks.in` (302), qui renvoie vers
`amazon.fr/s?k=iPhone&i=specialty-aps&srs=95175955031&tag=ludgerhouanou-21`.
Trois conséquences :

- la destination est une **liste de résultats** (recherche filtrée), pas une
  fiche produit : ce lien ne peut équiper ni `dp/<ASIN>` ni le JSON-LD ;
- `B06gD11hu` n'est pas un ASIN (9 caractères avec minuscules ; un ASIN en
  compte 10, majuscules) — `link.amazon` renvoie d'ailleurs 302 pour n'importe
  quelle chaîne en forme d'ASIN et 403 pour le reste, sans vérifier que le
  produit existe ;
- la chaîne traverse un **domaine tiers** (réponse portant l'en-tête
  `x-access-control-allow-origin: https://api.amzlinks.in`) dont rien
  n'établit qu'il appartienne à Amazon : sa destination peut changer après
  votre mise en ligne, ce que le règlement des Partenaires interdit
  précisément (pas de masquage du lien de destination).

Ce qui est récupérable dans ce lien, c'est **le tag et la page d'offres**.
`offresLink()` (`lib/site.js`) reconstruit donc cette page
`amazon.fr/s?…` **en direct**, sans le relais tiers et sans le jeton
`ascsubtag` rotatif, et elle sert au bouton « Voir toutes les offres » de
`/bons-plans`. Les fiches produits, elles, gardent des liens
`amazon.fr/dp/<ASIN>?tag=…` vérifiés un par un.

### Épingler un lien précis sur un article

Si vous préférez votre propre URL (lien SiteStripe, promotion, boutique
d'un vendeur) à l'URL construite depuis l'ASIN, ajoutez un champ `link` à
l'objet produit dans `lib/catalog.js` ou `lib/products.js` :

```js
{
  id: "watch-se3",
  asin: "B0FQG55GFH",
  link: "https://amzn.to/4wXCOF4", // prioritaire sur l'ASIN, tag ajouté si absent
}
```

`productLink()` renvoie alors cette URL telle quelle (et y ajoute le tag si
elle en est dépourvue). À réserver aux liens qui **montrent le produit annoncé
sur la fiche** : un lien qui mène ailleurs que le produit décrit viole le
contrat Associates et coûte des conversions.

## Ordre réel des étapes (le plus rentable)

Le compteur du programme Amazon démarre **à l'inscription**, pas à la mise en
ligne : 3 ventes éligibles en 180 jours, sinon le compte est fermé et les
commissions sont perdues. Dans cet ordre :

1. **Publier le site** sur un domaine que vous contrôlez (pas de `*.vercel.app`
   durable : Amazon vérifie le domaine déclaré).
2. **Déclarer ce domaine** dans le compte Associates du marché visé, et seulement
   ensuite demander un identifiant de suivi de ce marché.
3. **Renseigner `SITE_URL` et `AMAZON_TAG`** en variables d'environnement
   (`SITE_URL` n'est plus obligatoire depuis que `https://icomparev2.vercel.app`
   est le repli de `lib/site.js`, mais une variable d'environnement reste la
   bonne façon de changer de domaine sans repousser de code) ;
   repousser, vérifier dans le HTML livré que chaque lien porte le bon tag.

En attendant : `AMAZON_TAG=""` produit des liens Amazon **sans tag** (le build ne
sonne plus l'alerte « tag manquant » comme une erreur de marché, mais elle reste
affichée) — c'est propre et conforme, simplement non rémunéré. Retirez alors la
mention « Partenaire Amazon » du pied de page : elle affirme une qualité que vous
n'avez pas encore auprès d'Amazon Europe.

### Éligibilité du nom de domaine

AFNIC réserve le `.fr` aux personnes **résidant dans un État membre de l'UE, en
Islande, au Liechtenstein, en Norvège ou en Suisse** (et aux entités qui y ont
leur siège). Un résident hors de cette liste ne peut pas enregistrer un `.fr`
en son nom propre : préférer un `.com` descriptif (vérifier la disponibilité
via RDAP avant d'acheter) ou un enregistrement par l'intermédiaire d'une
personne/structure éligible.

## Avant de mettre en ligne (à faire)

1. **Domaine** — le repli de `lib/site.js` est désormais le domaine de
   production réel, `https://icomparev2.vercel.app` : canonical, sitemap,
   Open Graph et JSON-LD sont donc justes tels quels. Ce que le code ne peut
   pas faire à votre place : **déclarer cette URL exacte** dans la liste des
   sites du compte Associates (Account settings → « Your websites »). Un lien
   posé depuis un domaine non déclaré n'est pas attribué. Quand un domaine
   personnel remplacera le sous-domaine Vercel, réglez-le avec la variable
   d'environnement `SITE_URL` (rien à repousser) — un sous-domaine
   `*.vercel.app` reste une adresse empruntée, et un comparateur de prix a
   intérêt à loger ailleurs.
2. **Marché France** — vérifier que le compte qui porte `ludgerhouanou-21`
   rémunère bien `amazon.fr` (profil fiscal + moyen de paiement validés), puis
   faire les **3 ventes qualifiantes dans les 180 jours** qui débloquent le
   compte, l'accès aux rapports détaillés et — c'est la même porte — la
   **PA API**, seule voie légale pour afficher un prix sur ce site.
3. **Deux liens à confirmer par l'éditeur** : les 13 ASIN de la boutique ont
   été revérifiés un à un (page 200 **et** titre du produit concordant avec la
   carte : capacité, coloris, état). Les deux accessoires de montre n'ont pas
   pu l'être depuis ici — Amazon répond `503` (mur anti-robot) sur
   `dp/B0DWMPW319` (câble AOOZTO) et `dp/B0F1C4XV6B` (chargeur RUXELY).
   Ouvrez-les dans un navigateur : si l'un des deux n'est plus vendu ou n'est
   plus le bon, remplacez l'`asin` par un lien SiteStripe épinglé dans le champ
   `link` de l'objet, ou retirez la référence. Comme ces deux-
   là ne portent aucune donnée technique et aucun prix affiché, une fiche
   d'accessoire au lien mort est ce que le site a de plus fragile.
4. **Vraies images produits** (une fois le compte approuvé) : Associates →
   **Link Builder** → cocher « Include product » + « Product Image », puis
   remplir le champ `image` de chaque produit dans `lib/catalog.js`. Les
   visuels doivent venir des outils Amazon : la section « Licence IP » des
   Politiques du programme encadre l'usage du Contenu du Programme, et une
   copie taken ailleurs est le motif de fermeture le plus courant. En
   attendant, des illustrations SVG locales sont affichées (zéro risque).

## Fiches produit et bons plans (depuis v1.3)

Une URL par article : `/produit/[slug]` est générée pour les **17 références**
(3 iPhone du comparatif + 15 de la boutique, `iphone-16` fusionné car présent
dans les deux catalogues). Chaque fiche porte son propre `<title>`, sa
`description`, son `rel=canonical`, son fil d'Ariane, un `Product` + `Offer`
JSON-LD et **son lien affilié taggé**. `/comparatif` et `/boutique` ne sont
plus des impasses : chaque carte renvoie vers la fiche.

`/bons-plans` n'affiche que les remises **démontrables** : minimum de la
fourchette relevée contre prix de lancement cité dans les données. Faute de
l'un des deux, aucune badge — donc aucun « −70 % » inventé. Le pourcentage est
calculé par `lib/prix.js`, jamais recopié à la main.

### Ajouter un produit (un seul objet à écrire)

```js
// lib/catalog.js → BOUTIQUE_PRODUCTS
{
  id: "magic-keyboard-ipad",       // devient le slug /produit/<id>
  name: "Magic Keyboard for iPad",
  sub: "Alcantera · Noir",
  category: "ipad",
  kind: "accessoire",              // phone|watch|ipad|buds|over|charger|cable
  badge: "Officiel Apple", badgeTone: "gray",
  tagline: "…",
  price: "≈ 279 – 299 €",          // fourchette → le MINIMUM est retenu
  priceNote: "Prix constaté Amazon, 27/08/2026 (349 € au lancement)",
  asin: "B0XXXXXXXX",              // null = aucune fiche d'achat, bouton masqué
}
```

La fiche `/produit/magic-keyboard-ipad`, l'entrée de `/bons-plans` (si une
remise est chiffrable), le sitemap et le maillage des cartes se mettent à jour
tout seuls. `link: "https://amzn.to/…"` en plus d'`asin` force une destination
personnalisée.

### Fraîcheur des prix

`lib/prix.js` expose `PRIX_DATE_ISO` (date du relevé manuel). Passé
`PRIX_VETUSTE_MAX_JOURS` (45 jours), les pages affichent un bandeau
« à revérifier » au lieu de faire semblant d'être un prix. Au-delà, un
comparateur qui ment sur un montant perd plus de clics qu'il n'en gagne :
changez la date quand vous revoyez les chiffres, et le site redevient honnête.

### Les cinq rayons de la boutique

La boutique est rangée en cinq rayons, une tuile chacun, dans l'esprit de la
page « Apple » d'Amazon.fr : **la tuile entière — l'image comprise — ouvre
l'espace d'achat du rayon**, où Amazon liste lui-même tous les modèles,
tailles, coloris et capacités, avec le prix et le stock du jour. Chaque en-tête
de section répète le lien (« Tout le rayon iPad sur Amazon »), et le visuel de
chaque produit est cliquable vers la fiche Amazon de ce produit.

Les cinq destinations sont des pages officielles du store Apple, relevées dans
sa barre de navigation puis stockées dans `lib/site.js` (`APPLE_STORE`). Elles
ont été revérifiées une par une en HTTP le 28 août 2026 avec le tag
partenaire en paramètre :

| Rayon iCompare | Espace d'achat Amazon FR | HTTP relevé |
| --- | --- | --- |
| iPhone | `stores/page/088CCA0B-B604-40D3-A70F-09E7504B164F` | 200 · « Amazon.fr: Apple: iPhone » |
| iPad | `stores/page/BB383B02-5AC6-4C18-8606-DDB879140AD1` | 200 · « Amazon.fr: Apple: iPad » |
| Apple Watch | `stores/page/FD773DA5-056E-45F5-9EE1-9705C9BBAA42` | 200 · « Amazon.fr: Apple: Apple Watch » |
| Audio (AirPods) | `stores/page/06893AEF-254D-4C91-9ECD-6F00D0B265C3` | 200 · « Amazon.fr: Apple: AirPods » |
| Accessoires | `stores/page/CDC2986B-5D39-4958-A019-3E04D21C19A0` | 200 · « Amazon.fr: Apple: Accessoires » |
| Espace Apple (racine) | `stores/page/5054D112-2A90-487A-8F8A-A4C700E6C15C` | 200 · « Amazon.fr: Apple » |

Règle du dépôt, plus stricte qu'à l'habitude sur cette page : **aucune URL
Amazon n'est devinée**. Pas de `srs=`, pas de `node=`, pas d'ASIN approximatif,
pas de lien « au feeling ». Si un rayon n'a pas d'espace vérifié,
`storeSpaceUrl()` renvoie `null` et le composant n'affiche pas de lien — il ne
l'invente pas. `npm run check` refuse une tuile dont la page de store ne figure
pas dans `APPLE_STORE`, dont le tag manque, dont `rel="sponsored"` a disparu,
ou qui manquerait à l'appel (5 tuiles attendues = 5 catégories).

**Les images.** `public/produits/rayon-*.jpg` habillent les tuiles : cinq
illustrations de 14 à 27 Ko, dessinées pour le site, sans logo ni texte
incrustés, `alt` = « Illustration iCompare : le rayon … ». Les 15 produits ont
chacun leur illustration vectorielle (`ProductArt` pour une montre, des
écouteurs, un chargeur ; `PhoneSVG` pour un iPhone), colorée par produit —
l'Ultra 3 en titane et la SE 3 Starlight ne se ressemblent pas.

Pourquoi ce ne sont pas les photos officielles d'Amazon : le Programme
Partenaires n'autorise à publier que les visuels qu'il fournit lui-même (PNG
générés par Link Builder, ou `Images.primary.large` de la PA API). Rapatrier à
la main une image `images-fr.amazon.com/…` serait du scraping d'actifs, et la
PA API suppose 3 ventes qualifiantes dans les 180 jours — le compte n'y est
pas encore.

Le branchement est prêt : ajoutez `image: "…"` (au besoin
`imageWidth` / `imageHeight`) sur un produit de `lib/catalog.js`. La carte
affiche alors la photo à la place du vectoriel, avec un `alt` construit sur le
nom et le sous-titre du produit ; les dimensions sont exigées par le contrôle
de build, pour qu'aucune carte ne fasse danser la page au chargement.

### /guides : les pages qui amènent le trafic

Huit pages de vérification (`/guides/ios-26-quels-iphone-compatibles`,
`/guides/apple-intelligence-verifier-iphone`,
`/guides/verifier-garantie-iphone-numero-de-serie`, `/guides/esim-iphone-compatibilite`,
`/guides/iphone-verrouille-operateur-comment-verifier`, `/guides/quel-chargeur-pour-iphone`,
`/guides/iphone-renewed-ce-que-ca-couvre`, `/guides/ios-26-sur-iphone-13-14-15`).
Choix de ciblage assumé : les requêtes « iPhone 17 prix » réclament un montant
affiché (interdit sans PA API) et sont trustées par des sites de dix ans ; les
requêtes « mon iPhone est-il compatible », « ma garantie court-elle encore »,
« ce chargeur sert-il à quelque chose » sont à la portée d'un domaine neuf, et
leur lecteur a besoin du lien vers la fiche — le clic affilié y est un service
rendu, pas un piège.

Trois règles rédactionnelles, toutes contrôlées au build :

- **aucune spécification recopiée à la main** : les tableaux de compatibilité
  sont construits à l'affichage depuis `lib/modeles.js` (une ligne par modèle,
  une source par colonne). Huit valeurs sont épinglées dans `npm run check`
  avec leur source et leur date — les retourner fait échouer le build ;
- **une source datée par affirmation externe**, listée en bas de page, et un
  encart « à confirmer » explicite quand on ne peut pas trancher (dates
  d'abandon logiciel, grilles de désimlockage, langues prises en charge :
  nous ne les publions pas, elles bougent) ;
- **un seul lien monétisé par guide** — l'espace d'achat du rayon concerné,
  taggé et `rel="sponsored"` — plus des citations en `rel="nofollow"`. Et au
  moins un lien du bloc « À lire aussi » vers une page où l'on peut acheter :
  un guide qui ne mène nulle part fait grossir Google, pas vous.

Au passage, trois affirmations du catalogue ont été corrigées, parce qu'un
guide sur le sujet les aurait contredites : ni l'iPhone 15 ni l'iPhone 13 ne
portent Apple Intelligence (la fonction exige une puce A17 Pro et 8 Go), et
l'iPad (A16) de 2025 non plus (sur tablette, le plancher est M1, à l'exception
du mini A17 Pro). `npm run check` refuse désormais, sur toute page du site,
une phrase qui prêterait Apple Intelligence à un matériel exclu — les phrases
interrogatives et les formulations négatives sont laissées tranquilles, sinon
le garde-fou hurlerait sur sa propre liste d'exclusions.

### Poids des pages

Mesuré sur le build statique actuel (`gzip -9` sur `.next/server/app/*.html`,
donc ce qui traverse vraiment le réseau) :

| Page | HTML brut | gzip |
| --- | --- | --- |
| `/` | 47,4 Ko | 9,3 Ko |
| `/comparatif` | 158,8 Ko | 25,9 Ko |
| `/boutique` | 160,4 Ko | 22,3 Ko |
| `/bons-plans` | 47,2 Ko | 7,6 Ko |
| les 8 guides (moyenne) | 47,7 Ko | 9,4 Ko |
| les 17 fiches produit (moyenne) | 34,4 Ko | 6,9 Ko |
| **les 30 pages** | **1 414 Ko** | **264,6 Ko** |

Le visuel est réapparu sur les 15 cartes de la boutique à dessein — demande de
l'éditeur : une image par produit. Coût mesuré en A/B (même build, carte au
glyphe de 300 octets contre carte illustrée) : **+55,3 Ko de HTML et +6,2 Ko
de gzip pour 15 illustrations**, la page passant de 102,5/15,3 Ko à 157,8/21,5
Ko. `npm run check` veille au plafond (220 Ko par page). Bascule chaque carte
sur une photo Link Builder (`image:`, plus bas) et le SVG sort de la page : un
`<img>` pèse ~200 octets de HTML, contre ~3,7 Ko par illustration.

### Aucun montant sur les 21 pages

Choix de l'éditeur, et obligation du règlement : les Politiques du Programme
Partenaires Amazon FR (« Liens présents sur votre site », mise à jour du
14 avril 2026) limitent ainsi l'affichage des prix :

> « Sachant que la disponibilité et les prix des Produits que vous avez
> répertoriés sur votre Site sont susceptibles de changer, votre Site peut
> indiquer uniquement les prix et la disponibilité si : (a) nous fournissons le
> lien affichant le prix et la disponibilité du Produit ou (b) vous obtenez les
> prix et la disponibilité des Produits via une PA API […]. »

Les montants de ce dépôt viennent d'un relevé manuel : ils ne remplissent ni
(a) ni (b). La même page impose par ailleurs de retirer « dès la fin de la
promotion » toute mention de remise limitée dans le temps — ce qu'un build
statique ne sait pas détecter. **Aucune page n'affiche donc de prix** : ni
`/`, ni `/comparatif`, ni `/boutique`, ni `/bons-plans`, ni les 17 fiches.

Ce qui reste affiché, et pourquoi c'est défendable :

- **un écart daté** — « −23 % sous le prix de lancement Apple, relevé le
  27 août 2026 ». Un fait historique, pas une offre en cours ; la date est
  rappelée à côté, et le bandeau d'alerte de vétusté (`PRIX_VETUSTE_MAX_JOURS`)
  prévient quand le relevé n'a plus à être cru ;
- **un bouton** — « Consulter le prix sur Amazon » sur chaque produit : le
  montant vient d'Amazon, il est donc toujours juste au moment du clic ;
- **aucune disponibilité affirmée** : le `availability: InStock` que
  déclaraient 17 pages a été retiré, la page d'aide soumet la disponibilité à
  la même restriction que le prix, et un build ne peut pas savoir ce qui est en
  stock le jour où le lecteur clique.

Ce que cela coûte, à connaître : les pages ne sont plus éligibles aux résultats
enrichis « Marchandises » (plus de `Offer` du tout), et un internaute qui
compare deux ongles d'œil sur la page doit cliquer pour voir les montants. Les
données, elles, ne sont pas supprimées : `price`, `priceNote`, `priceNow`,
`priceLaunch` restent dans `lib/catalog.js` et `lib/products.js`, parce que
c'est là que l'écart est calculé.

**Pour tout réafficher** (le jour où la PA API est branchée) : `SHOW_PRICES=1`
comme variable d'environnement de build. Un seul drapeau, dans `lib/prix.js`
(`AFFICHER_MONTANTS`), lu à la fois par les gabarits et par `npm run check` —
les pages et le contrôle basculent ensemble, ils ne peuvent pas se contredire.
Dans ce mode, le contrôle redevient ce qu'il était : recoupement de chaque
`Offer` avec le montant affiché sur la même page (16 prix vérifiés).

### Un seul prix par produit

Il existait deux sources de vérité pour le même montant : la fourchette
affichée (`price: "≈ 650 – 720 €"`) et un `priceValue` tapé à la main pour le
JSON-LD. Sur 15 produits, deux avaient déjà dérivé (iPhone 17e déclaré à
719 € pour un affichage à 650 €, chargeur RUXELY à 13 € pour 14 € affichés).
Un désaccord entre la page et ses données structurées, c'est un résultat
enrichi refusé par Google — et un lecteur qui clique sur un prix qui n'est
pas celui qu'on lui promettait.

`priceValue` est donc **supprimé des données** : le prix déclaré aux moteurs
est déduit de la fourchette au moment du build (`euroMini`, dans
`lib/prix.js`), et une fiche dont le prix n'est pas chiffrable n'a tout
simplement **pas d'`Offer`** plutôt qu'un prix inventé. Le contrôle
`npm run check` recoupe les deux et échoue si jamais ils se remettent à
diverger.

Pareil pour les tableaux : « Prix de lancement » et « Prix constaté » étaient
tapés **deux fois**, une fois dans `QUICK_ROWS` (tableau rapide) et une fois
dans `SPEC_GROUPS` (fiche technique). Les deux lignes sont sorties de là pour
devenir `LIGNES_MONTANTS`, une seule définition, affichée seulement avec
`SHOW_PRICES=1` ; à la place, les deux tableaux partagent `LIGNE_ECART`, dont
les pourcentages sont **calculés** sur les montants (`ecartProduit`), pas
recopiés à la main.

## SEO inclus

- Meta descriptions + Open Graph + Twitter Card sur les 3 pages
- JSON-LD : BreadcrumbList partout ; Product (sans `offers`, puisque la page
  n'affiche aucun montant) sur la boutique, le comparatif et les 17 fiches ;
  FAQPage (7 questions) ; ItemList sur les bons plans. Aucun prix, aucune
  disponibilité déclarés aux moteurs : ce qui n'est pas visible ne doit pas
  être déclaré
- Sitemap XML + robots.txt (routes Next.js natives)
- Balises canonical ; montants datés sur les pages qui en affichent
- Rumeurs iPhone 18 sourcées et étiquetées (pas de contenu inventé)
- Google Search Console : après déploiement, soumettez `<SITE.url>/sitemap.xml`

## Règles d'affiliation respectées

- Disclosure visible en haut de chaque page + footer (« Partenaire Amazon »).
- Liens produits : `target="_blank" rel="sponsored nofollow noopener"`.
- Jamais « Amazon » dans les `<title>`.
- Aucun prix et aucune disponibilité affichés hors PA API ; à la place, un
  écart au prix de lancement daté (champs `UPDATED`/`PRIX_DATE_FR`) et un lien
  vers la fiche Amazon, seule source du montant du jour.
- Aucune promotion affichée comme « en cours » : seule une remise **constatée à
  une date**, à retirer au prochain rafraîchissement des données.

## GitHub

Le dépôt est initialisé localement. Pour pousser :

```bash
# 1. Créer le dépôt vide sur github.com (ex. "icompare")
# 2. Ici :
git remote add origin https://github.com/VOTRE-USER/icompare.git
git push -u origin main
```

Chaque `git push` sur `main` déclenche un déploiement automatique sur Vercel
(si le repo est connecté).
