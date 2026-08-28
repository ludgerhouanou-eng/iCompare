import CategoryTabs from "../../components/CategoryTabs.jsx";
import ProductCard from "../../components/ProductCard.jsx";
import { SITE } from "../../lib/site.js";
import { ficheUrl } from "../../lib/fiches.js";
import {
  CATEGORIES,
  BOUTIQUE_PRODUCTS,
  productLink,
  CATALOG_UPDATED,
} from "../../lib/catalog.js";

const TITLE = "Apple Watch, anciens iPhone, iPad & AirPods : la sélection 2026";
const DESC =
  "Apple Watch SE 3, Series 11, Ultra 3, anciens iPhone (17e, 16, 15, 13 renewed), iPad A16 & Air M3, AirPods Pro 3 : 15 références sélectionnées, un lien vers la fiche Amazon de chacune pour le prix et le stock du jour.";

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
      // Products sans `offers` : la page n'affiche plus de montant, et un
      // prix dans le JSON-LD que le lecteur ne voit pas est une donnée
      // enrichie en désaccord avec la page (refusée par Google, et de toute
      // façon hors autorisation chez Amazon sans PA API). On déclare donc la
      // sélection, et on renvoie vers la fiche qui, elle, assume ses chiffres.
      itemListElement: BOUTIQUE_PRODUCTS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: `${p.name} — ${p.sub}`,
          brand: { "@type": "Brand", name: p.brand || "Apple" },
          description: p.tagline,
          url: `${SITE.url}${ficheUrl(p.id)}`,
        },
      })),
    },
  ],
};

const TIPS = [
  {
    title: "Pourquoi acheter un « ancien » iPhone ?",
    text: "L'iPhone 17e et l'iPhone 15 offrent l'essentiel d'un iPhone 17 — iOS 26 et Apple Intelligence compris — pour plusieurs centaines d'euros de moins : l'écart exact, seule la fiche Amazon le sait. L'iPhone 13 « Renewed » est le choix budget étudiant/famille : 90 jours pour changer d'avis + 1 an de garantie via le programme Amazon Renewed.",
  },
  {
    title: "Quelle Apple Watch selon votre usage ?",
    text: "SE 3 : l'essentiel au meilleur prix (mais sans ECG ni tension). Series 11 : le compromis complet avec ECG, tension artérielle, 2 000 nits et 24 h d'autonomie. Ultra 3 : le modèle pro de l'extérieur — satellite, GPS double fréquence, 42 h d'autonomie — si vous en faites vraiment votre activité principale.",
  },
  {
    title: "Audio : trois niveaux, zéro hésitation",
    text: "AirPods 4 avec ANC pour le quotidien ; AirPods Pro 3 pour la meilleure réduction de bruit du segment et le suivi cardiaque pendant le sport — c'est la référence qui était le plus nettement sous son prix de lancement à notre relevé ; AirPods Max 2 pour les auditeurs qui veulent du supra-auriculaire premium. Pensez au chargeur 30 W officiel : il n'est pas toujours inclus.",
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
        <p className="kicker">Boutique · {BOUTIQUE_PRODUCTS.length} références · prix et stock chez Amazon</p>
        <h1>
          L'univers Apple : Apple Watch, anciens iPhone, iPad{" "}
          <span className="grad-text">&amp; AirPods</span>
        </h1>
        <p className="lead">
          Le comparatif <a href="/comparatif">iPhone 16 / 17 / 18</a> n'est pas tout :
          voici aussi notre sélection courte sur le reste de l'écosystème — montres,
          iPhone des générations précédentes (souvent les plus grosses économies),
          iPad, casques et chargeurs. <strong>{BOUTIQUE_PRODUCTS.length} produits</strong>,
          chacun avec sa fiche et son lien Amazon. Nous n'affichons pas les montants
          ici : un prix relevé à la main est périmé en quelques jours, celui
          d'Amazon est celui du jour. Seule la mention de remise porte notre date
          ({CATALOG_UPDATED}).
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
