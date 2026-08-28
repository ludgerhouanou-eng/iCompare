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
npm run start   # sert le build
```

## Déployer sur Vercel (2 façons)

**A. Via le dashboard (recommandé)**
1. Poussez le dépôt sur GitHub (voir ci-dessous).
2. vercel.com → *Add New… → Project* → connectez votre GitHub → importez le dépôt.
3. Vercel détecte automatiquement Next.js → **Deploy**.
4. Le site est en ligne sur `https://<projet>.vercel.app`.
5. **Important** : mettez à jour `lib/site.js` → `SITE.url` avec votre URL Vercel
   (ou votre futur domaine), puis repoussez sur GitHub (déploiement auto).

**B. Via le CLI**
```bash
npm i -g vercel
vercel        # première fois : configuration interactive
vercel --prod # mise en production
```

Aucune variable d'environnement nécessaire.

## Structure

```
app/
  layout.jsx          → header, nav, footer, métas globales
  page.jsx            → Accueil (/) : hero + DIAPORAMA + 3 cartes iPhone
  comparatif/page.jsx → Page SEO principale : 35 specs, prix, rumeurs, FAQ
  boutique/page.jsx   → 15 produits, 5 onglets (Watch, iPhone, iPad, audio, accessoires)
  globals.css         → design system (blanc + teintes bleu/rose)
  sitemap.js          → 3 URL (utilise SITE.url)
  robots.js           → robots.txt + lien vers le sitemap
components/
  HeroSlider.jsx      → diaporama (auto, flèches, points, swipe)
  PhoneSVG.jsx        → illustration iPhone (fallback sans photo)
  ProductArt.jsx      → illustrations SVG boutique (fallback sans image)
  SpecTable.jsx       → tableau comparatif 3 colonnes
  SpecBars.jsx        → barres visuelles écran/puce/batterie
  FaqItem.jsx, Disclosure.jsx, BuyBar.jsx, BoutiqueClient.jsx
lib/
  site.js             → ⚙️ DOMAINE + TAG AMAZON (à renseigner !)
  products.js         → iPhone 16/17/18 : specs, verdicts, FAQ, barres
  catalog.js          → 15 produits boutique (champ "image" à renseigner)
public/
  phones/             → photos iPhone (gamme, face à face, 16, 17, 18)
  og-comparatif.jpg   → image Open Graph
```

## Affiliation Amazon (état de la configuration)

Le **tag d'associé est intégré** : il est extrait du lien court
`https://amzn.to/4wXCOF4`, qui redirige vers
`amazon.com/…/dp/B0FSFLTSFS?…&tag=icompare0d-20`. Comme tous les liens du
site sont fabriqués par `amazonLink()` dans `lib/site.js`, ce tag est posé
automatiquement sur **chaque fiche produit** : 25 liens sortants sur
`/`, `/comparatif` et `/boutique` (16 ASIN distincts), plus les URL des
données structurées JSON-LD. Aucun lien ne part « nu » vers Amazon.

Un `next build` **avertit dans les journaux** si la configuration ne peut
pas créditer de commission (tag placeholder, ou suffixe de marché qui ne
correspond pas au domaine lié). Rien n'est affiché au visiteur.

### ⚠️ Le seul point qui bloque encore les commissions

Le suffixe d'un identifiant Amazon désigne le **programme national** qui
encaisse : `-20` = amazon.com, `-84` = amazon.fr. Le site est en euros et
relie **amazon.fr**, mais le tag relevé est **`icompare0d-20`** (marché US).
Dans cet état, Amazon ne crédite rien. Deux issues, au choix :

- **Programme France (recommandé, cohérent avec les prix affichés)** :
  créez un identifiant de suivi dans votre compte Associates FR, puis
  `AMAZON_TAG=votretag-84` en variable d'environnement — ou
  `amazonTag` dans `lib/site.js`.
- **Programme États-Unis** : `AMAZON_DOMAIN=amazon.com`. Il faudra alors
  relire les prix : ils passent en dollars et en disponibilité US.

Les variables `AMAZON_TAG`, `AMAZON_DOMAIN` et `SITE_URL` évitent de
repousser du code pour changer de marché.

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
3. **Renseigner `SITE_URL` et `AMAZON_TAG`** en variables d'environnement,
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

1. **Domaine** → `lib/site.js` : `SITE.url = "https://votredomaine.fr"`
   (alimente les canonical, le sitemap, l'Open Graph et le JSON-LD).
   Le nom de domaine doit être **déclaré et approuvé** dans votre compte
   Associates, sinon les liens sont refusés. Un placeholder présent dans la
   page vaut aussi un canonical erroné pour Google.
3. **Vraies images produits** (une fois votre compte Amazon créé) :
   Amazon Associates → **Link Builder** → cocher « Include product » + « Product Image »
   (seule utilisation légale des images Amazon, ToS §5.3), puis remplir le champ
   `image` de chaque produit dans `lib/catalog.js`. En attendant, des illustrations
   SVG locales sont affichées (zéro risque ToS).

## SEO inclus

- Meta descriptions + Open Graph + Twitter Card sur les 3 pages
- JSON-LD : BreadcrumbList, ItemList de Products (with AggregateOffer), FAQPage (7 Q)
- Sitemap XML + robots.txt (routes Next.js natives)
- Balises canonical, prix datés « vérifiés le 27 août 2026 »
- Rumeurs iPhone 18 sourcées et étiquetées (pas de contenu inventé)
- Google Search Console : après déploiement, soumettez `<SITE.url>/sitemap.xml`

## Règles d'affiliation respectées

- Disclosure visible en haut de chaque page + footer (« Partenaire Amazon »).
- Liens produits : `target="_blank" rel="sponsored nofollow noopener"`.
- Jamais « Amazon » dans les `<title>`.
- Prix indicatifs + date de relevé (champs `UPDATED` dans `lib/*.js`).

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
