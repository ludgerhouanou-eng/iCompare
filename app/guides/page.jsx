import { SITE } from "../../lib/site.js";
import { GUIDES } from "../../lib/guides.js";

const TITLE = "Guides : vérifier avant d'acheter un iPhone ou un produit Apple";
const DESC =
  "Compatibilité iOS 26, Apple Intelligence, garantie et numéro de série, eSIM, verrouillage opérateur, chargeur, reconditionné : les guides iCompare pour trancher une question de vérification avant de commander.";

export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/guides" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/guides",
    siteName: SITE.name,
    title: TITLE,
    description: DESC,
    images: [{ url: "/hero.jpg", width: 1200, height: 675, alt: "Guides de vérification iCompare" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/hero.jpg"] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ItemList",
      name: "Guides de vérification iCompare",
      numberOfItems: GUIDES.length,
      itemListElement: GUIDES.map((g, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE.url}/guides/${g.slug}`,
        name: g.titreSeo || g.titre,
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: SITE.url },
        { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE.url}/guides` },
      ],
    },
  ],
};

export default function GuidesIndex() {
  const parGroupe = GUIDES.reduce((acc, g) => {
    const cle = g.slug.includes("iphone-renewed") || g.slug.includes("garantie") || g.slug.includes("verrouille") || g.slug.includes("esim")
      ? "Avant de payer"
      : g.slug.includes("chargeur")
        ? "Bien choisir l'accessoire"
        : "S'y retrouver dans iOS 26";
    (acc[cle] ||= []).push(g);
    return acc;
  }, {});

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container page-head">
        <nav className="breadcrumbs" aria-label="Fil d'Ariane">
          <a href="/">Accueil</a> / Guides
        </nav>
        <p className="kicker">Guides · {GUIDES.length} vérifications · relevé du 28 août 2026</p>
        <h1>
          La question que vous posez <span className="grad-text">avant le paiement</span>
        </h1>
        <p className="lead">
          Le comparatif dit quel iPhone choisir. Ces guides répondent à ce qui bloque juste avant :
          mon appareil est-il compatible, ma garantie court-elle encore, ce chargeur sert-il à
          quelque chose, cet iPhone d'occasion est-il libre. Chaque page part d'un relevé daté et
          cite ses sources — et aucune n'affiche de prix : le montant vit sur la fiche Amazon.
        </p>
      </div>

      {Object.entries(parGroupe).map(([groupe, guides]) => (
        <section className="section" key={groupe}>
          <div className="container">
            <p className="kicker">{groupe}</p>
            <h2 className="section-title">{groupe}</h2>
            <div className="grid-3 guide-index">
              {guides.map((g) => (
                <a className="card guide-card" key={g.slug} href={`/guides/${g.slug}`}>
                  <h3>{g.titreSeo || g.titre}</h3>
                  <p>{g.description}</p>
                  <span className="badge badge-blue">Lecture {g.lecture} min</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section section-alt">
        <div className="container">
          <div className="guide-methode">
            <h2>Notre méthode sur ces pages</h2>
            <ul>
              <li>
                Une exigence matérielle se vérifie sur l'appareil, pas dans un article : chaque
                guide donne le chemin exact dans Réglages avant de donner une liste.
              </li>
              <li>
                Les tableaux de compatibilité sont générés depuis une table unique, relevée le
                28 août 2026 et contrôlée au build — une valeur changée l'est partout, et une
                divergence fait échouer le build.
              </li>
              <li>
                Ce que nous n'avons pas pu confirmer est écrit « à confirmer ». Nous ne publions
                pas de date d'abandon logiciel, pas de grille de désimlockage, pas de liste de
                langues : ces données bougent et nous ne les devinons pas.
              </li>
              <li>
                Un seul lien sortant par guide, vers l'espace d'achat du bon rayon. Pas de bannière,
                pas de comparateur de prix : nous touchons une commission Amazon sur les achats
                éligibles, c'est écrit ici comme sur le site.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="cta-final">
        <div className="container">
          <h2>Vous cherchez une réponse qui n'est pas là ?</h2>
          <p>
            Les guides suivent les questions réellement posées. Écrivez-nous la vôtre : si elle est
            vérifiable, elle devient une page avec ses sources.
          </p>
          <a className="btn btn-amber" href="/boutique">
            Voir les 5 rayons de la boutique →
          </a>
        </div>
      </section>
    </>
  );
}
