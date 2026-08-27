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

## Avant de gagner des commissions (à faire)

1. **Tag Amazon** → `lib/site.js` : `SITE.amazonTag = "votretag-21"` (votre tag exact).
2. **Domaine** → `lib/site.js` : `SITE.url = "https://votredomaine.fr"`
   (cette URL alimente les canonical, le sitemap et le JSON-LD).
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
