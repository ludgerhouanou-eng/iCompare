import CategoryTabs from "../../components/CategoryTabs.jsx";
import ProductCard from "../../components/ProductCard.jsx";
import { euroMini } from "../../lib/prix.js";
import { SITE } from "../../lib/site.js";
import {
  CATEGORIES,
  BOUTIQUE_PRODUCTS,
  productLink,
  CATALOG_UPDATED,
} from "../../lib/catalog.js";

const TITLE = "Apple Watch, anciens iPhone, iPad & AirPods : bons prix 2026";
const DESC =
  "Apple Watch SE 3, Series 11, Ultra 3, anciens iPhone (17e, 16, 15, 13 renewed), iPad A16 & Air M3, AirPods Pro 3 : sélection courte avec prix Amazon vérifiés le 27/08/2026.";

export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/boutique" },
  openGraph: {
    type: "article",
    locale: "fr_FR",
    url: "/boutique",
    siteName: SITE.name,
    title: TITLE,
    description: DESC,
    publishedTime: "2026-08-27T09:00:00+02:00",
    modifiedTime: "2026-08-27T09:00:00+02:00",
    images: [
      { url: "/hero.jpg", width: 1200, height: 675, alt: "Boutique Apple : Apple Watch, iPhone, iPad et AirPods" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/hero.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: SITE.url },
        {
          "@type": "ListItem",
          position: 2,
          name: "Boutique Apple",
          item: `${SITE.url}/boutique`,
        },
      ],
    },
    {
      "@type": "ItemList",
      name: "Boutique Apple : sélection d'Apple Watch, iPhone, iPad, AirPods et accessoires",
      numberOfItems: BOUTIQUE_PRODUCTS.length,
      itemListElement: BOUTIQUE_PRODUCTS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: `${p.name} — ${p.sub}`,
          brand: { "@type": "Brand", name: p.brand || "Apple" },
          description: p.tagline,
          offers: {
            "@type": "Offer",
            // Le prix déclaré à Google doit être celui que le lecteur voit.
            // Deux fiches portaient un priceValue divergent du texte affiché
            // (iphone-17e : 719 € déclaré pour « ≈ 650 – 720 € » ; chargeur
            // RUXELY : 13 € pour « ≈ 14 € ») — écart de prix = donnée enrichie
            // refusée ou pénalisée. On prend le minimum de la fourchette.
            price: String(euroMini(p.price) ?? p.priceValue),
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: productLink(p),
          },
        },
      })),
    },
  ],
};

const TIPS = [
  {
    title: "Pourquoi acheter un « ancien » iPhone ?",
    text: "L'iPhone 17e (719 €) et l'iPhone 15 (~650 €) offrent 80 % de l'expérience d'un iPhone 17 pour 250 à 300 € de moins — et tous supportent iOS 26 et Apple Intelligence. L'iPhone 13 « Renewed » (~400 €) est le choix budget étudiant/famille : 90 jours pour changer d'avis + 1 an de garantie via le programme Amazon Renewed.",
  },
  {
    title: "Quelle Apple Watch selon votre usage ?",
    text: "SE 3 : l'essentiel au meilleur prix (mais sans ECG ni tension). Series 11 : le compromis complet avec ECG, tension artérielle, 2 000 nits et 24 h d'autonomie. Ultra 3 : le modèle pro de l'extérieur — satellite, GPS double fréquence, 42 h d'autonomie — si vous en faites vraiment votre activité principale.",
  },
  {
    title: "Audio : trois niveaux, zéro hésitation",
    text: "AirPods 4 avec ANC (~160 €) pour le quotidien ; AirPods Pro 3 (198 € ce mois-ci, −20 %) pour la meilleure réduction de bruit du segment et le suivi cardiaque pendant le sport ; AirPods Max 2 (~555 €) pour les auditeurs qui veulent du supra-auriculaire premium. Pensez au chargeur 30 W officiel : il n'est pas toujours inclus.",
  },
];

export default function BoutiquePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container page-head">
        <nav className="breadcrumbs" aria-label="Fil d'Ariane">
          <a href="/">Accueil</a> / Boutique Apple
        </nav>
        <p className="kicker">Boutique · Prix Amazon vérifiés le {CATALOG_UPDATED}</p>
        <h1>
          L'univers Apple : Apple Watch, anciens iPhone, iPad{" "}
          <span className="grad-text">&amp; AirPods</span>
        </h1>
        <p className="lead">
          Le comparatif <a href="/comparatif">iPhone 16 / 17 / 18</a> n'est pas tout :
          voici aussi notre sélection courte sur le reste de l'écosystème — montres,
          iPhone des générations précédentes (souvent les plus grosses économies),
          iPad, casques et chargeurs. <strong>{BOUTIQUE_PRODUCTS.length} produits</strong>,
          prix relevés le {CATALOG_UPDATED}, zéro blabla.
        </p>
      </div>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container">
          <CategoryTabs
            categories={CATEGORIES.map((c) => ({
              ...c,
              count: BOUTIQUE_PRODUCTS.filter((p) => p.category === c.id).length,
            }))}
            total={BOUTIQUE_PRODUCTS.length}
          />

          {CATEGORIES.map((c) => (
            <section
              key={c.id}
              id={c.id}
              className="cat-section"
              data-cat-section={c.id}
              aria-label={c.name}
            >
              <div className="cat-head">
                <h2>
                  <span aria-hidden="true">{c.icon}</span> {c.name}
                </h2>
                <p>{c.longBlurb}</p>
              </div>
              <div className="grid-3">
                {BOUTIQUE_PRODUCTS.filter((p) => p.category === c.id).map((p) => (
                  <ProductCard key={p.id} product={p} urlAffilie={productLink(p)} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <p className="kicker">Conseils d'achat</p>
          <h2 className="section-title">Trois réflexes avant de commander</h2>
          <p className="section-sub">Ce qu'on répète sur toutes nos pages, adapté à la boutique.</p>
          <div className="grid-3">
            {TIPS.map((t) => (
              <div key={t.title} className="card">
                <h3>{t.title}</h3>
                <p style={{ color: "var(--text-2)", fontSize: 14.5 }}>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-3">
            <a className="card profile-card" href="/comparatif">
              <h4>📊 Comparer les derniers iPhone</h4>
              <p>iPhone 16 vs 17 vs 18 : fiches techniques, prix et verdict. La page qui a lancé le site.</p>
              <span className="badge badge-blue">Comparatif complet</span>
            </a>
            <a className="card profile-card" href="/comparatif#iphone-18">
              <h4>🔮 Rumeurs iPhone 18</h4>
              <p>Septembre 2026 : iPhone 18 Pro et Fold. Printemps 2027 : iPhone 18 standard. Tout le calendrier.</p>
              <span className="badge badge-purple">À suivre</span>
            </a>
            <a className="card profile-card" href="/bons-plans">
              <h4>💸 Les remises du moment</h4>
              <p>Les références passées sous leur prix Apple, triées par économie réelle en euros.</p>
              <span className="badge badge-green">Bons plans</span>
            </a>
          </div>
        </div>
      </section>

      <section className="cta-final">
        <div className="container">
          <h2>Vous cherchiez un produit précis ?</h2>
          <p>
            Les prix bougent vite sur Amazon (surtout avant le Prime Day et le Black
            Friday). Si vous voyez un produit Apple qui manque ici, dites-le-nous :
            la sélection évolue chaque mois.
          </p>
          <a className="btn btn-amber" href="/comparatif">
            Revenir au comparatif iPhone 16 / 17 / 18 →
          </a>
        </div>
      </section>
    </>
  );
}
