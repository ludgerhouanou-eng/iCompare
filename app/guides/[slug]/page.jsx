import { notFound } from "next/navigation";
import { SITE, storeSpaceUrl } from "../../../lib/site.js";
import { GUIDES, getGuide, SOURCES_COMMUNES } from "../../../lib/guides.js";
import { IPHONE, IPAD, REGLE_IA } from "../../../lib/modeles.js";

/**
 * Un guide par question de vérification. 8 pages prérendues ; une URL
 * inconnue répond 404 (même contrat que /produit/[slug]).
 */
export const dynamicParams = false;
export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

const DATE_PUBLICATION_ISO = "2026-08-28";

function titreDe(g) {
  return g.titreSeo || g.titre;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  const url = `/guides/${g.slug}`;
  return {
    title: titreDe(g),
    description: g.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "fr_FR",
      url,
      siteName: SITE.name,
      title: titreDe(g),
      description: g.description,
      publishedTime: `${DATE_PUBLICATION_ISO}T08:00:00+02:00`,
      modifiedTime: `${DATE_PUBLICATION_ISO}T08:00:00+02:00`,
      images: [{ url: "/hero.jpg", width: 1200, height: 675, alt: g.titre }],
    },
    twitter: {
      card: "summary_large_image",
      title: titreDe(g),
      description: g.description,
      images: ["/hero.jpg"],
    },
  };
}

/** Tableau construit depuis lib/modeles.js — jamais recopié dans le contenu. */
function Tableau({ table }) {
  const source = table.tableFrom === "ipad" ? IPAD : IPHONE;
  const lignes = table.filtre
    ? source.filter((m) => table.filtre.some((f) => m.modele.includes(f)))
    : source;
  const colonnes = table.colonnes || [
    "Modèle",
    "Puce",
    "Mémoire",
    "iOS 26",
    "Apple Intelligence",
  ];
  const cle = {
    Modèle: "modele",
    Puce: "puce",
    Mémoire: "ram",
    "iOS 26": "ios26",
    "iPadOS 26": "ios26",
    "Apple Intelligence": "ia",
  };
  return (
    <div className="guide-table-wrap">
      <table className="guide-table">
        <caption>{table.legende}</caption>
        <thead>
          <tr>
            {colonnes.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lignes.map((m) => (
            <tr key={m.modele} className={m.ia ? "is-oui" : undefined}>
              {colonnes.map((c) => {
                const v = m[cle[c] || c];
                const rendu =
                  typeof v === "boolean" ? (v ? "Oui" : "Non") : v ?? "—";
                if (c === "Modèle") {
                  return (
                    <th key={c} scope="row">
                      {rendu}
                    </th>
                  );
                }
                return (
                  <td key={c} className={typeof v === "boolean" ? (v ? "ok" : "no") : undefined}>
                    {rendu}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {table.note && <p className="guide-note">{table.note}</p>}
    </div>
  );
}

function Encart({ encart }) {
  const estVerifier = encart.type === "verifier";
  return (
    <div className={`guide-encart ${estVerifier ? "is-verifier" : "is-info"}`}>
      <p className="guide-encart-titre">
        <span aria-hidden="true">{estVerifier ? "⚠️" : "ℹ️"}</span> {encart.titre}
      </p>
      <p>{encart.texte}</p>
    </div>
  );
}

export default function GuidePage({ params }) {
  const { slug } = params;
  const g = getGuide(slug);
  if (!g) notFound();

  const url = `${SITE.url}/guides/${g.slug}`;
  const cta = storeSpaceUrl(g.cta?.store);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: g.titre,
        description: g.description,
        inLanguage: "fr",
        datePublished: DATE_PUBLICATION_ISO,
        dateModified: DATE_PUBLICATION_ISO,
        author: { "@type": "Organization", name: SITE.name, url: SITE.url },
        publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      },
      // FAQPage : les réponses sont les nôtres, pas un copier-coller d'un
      // autre site — c'est ce qui rend le bloc légitime en résultat enrichi.
      ...(g.faq?.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: g.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: SITE.url },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE.url}/guides` },
          { "@type": "ListItem", position: 3, name: g.titreSeo || g.titre, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="container page-head guide-head">
        <nav className="breadcrumbs" aria-label="Fil d'Ariane">
          <a href="/">Accueil</a> / <a href="/guides">Guides</a> / {g.titreSeo || g.titre}
        </nav>
        <p className="kicker">
          Guide de vérification · lecture {g.lecture} min · relevé du {g.maj}
        </p>
        <h1>{g.titre}</h1>
        <p className="lead">{g.chapeau}</p>
        <p className="guide-exigence">
          <strong>La règle qui décide</strong> — iPhone : {REGLE_IA.iphone}. iPad :{" "}
          {REGLE_IA.ipad}.
        </p>
      </article>

      <section className="section" style={{ paddingTop: 12 }}>
        <div className="container guide-corps">
          {g.blocs.map((b, i) => (
            <div className="guide-bloc" key={b.h2}>
              <h2>{b.h2}</h2>
              {b.p?.map((par) => (
                <p key={par.slice(0, 40)}>{par}</p>
              ))}
              {b.liste && (
                <ul className="guide-liste">
                  {b.liste.map((li) => (
                    <li key={li.slice(0, 40)}>{li}</li>
                  ))}
                </ul>
              )}
              {b.encart && <Encart encart={b.encart} />}
              {g.table && i === g.blocs.length - 1 && <Tableau table={g.table} />}
            </div>
          ))}

          {cta && (
            <aside className="guide-cta">
              <div>
                <p className="kicker">Où regarder les montants</p>
                <h2>{g.cta.titre}</h2>
                <p>{g.cta.texte}</p>
              </div>
              <a
                className="btn btn-amber"
                href={cta}
                target="_blank"
                rel="sponsored nofollow noopener"
              >
                Ouvrir l'espace d'achat →
              </a>
            </aside>
          )}

          {g.faq?.length ? (
            <section className="section section-alt guide-faq">
              <div className="container">
                <p className="kicker">Questions fréquentes</p>
                <h2>Ce qu'on nous demande avant d'acheter</h2>
                <dl>
                  {g.faq.map((f) => (
                    <div key={f.q} className="guide-qa">
                      <dt>{f.q}</dt>
                      <dd>{f.a}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>
          ) : null}

          <section className="guide-sources">
            <h2>Sources et méthode</h2>
            <p>
              Ce guide s'appuie sur {g.sources?.length || 0} source
              {g.sources?.length > 1 ? "s" : ""} externe{g.sources?.length > 1 ? "s" : ""} et sur
              notre table de compatibilité interne, relevée le {g.maj}. Les tableaux sont générés
              depuis cette table : si une valeur change, les pages changent ensemble — c'est le
              seul moyen de ne pas avoir dix versions d'une même réponse.
            </p>
            <ul>
              {[...(g.sources || []), ...SOURCES_COMMUNES].map((s, i) => (
                <li key={`${s.url}-${i}`}>
                  <a href={s.url} target="_blank" rel="nofollow noopener">
                    {s.nom}
                  </a>{" "}
                  <span className="guide-src-date">({CONSULT(s)})</span>
                </li>
              ))}
            </ul>
            <p className="guide-note">
              Nous n'affichons ni prix ni disponibilité : ces informations appartiennent à la
              fiche Amazon du produit, reachable par le bouton ci-dessus. Une caractéristique que
              nous n'avons pas pu vérifier est marquée « à confirmer », jamais présentée comme un
              fait.
            </p>
          </section>

          <nav className="guide-voir-aussi" aria-label="À lire aussi">
            <h2>À lire aussi</h2>
            <ul>
              {g.liens.map((l) => (
                <li key={l}>
                  <a href={l}>{TITRES[l] || l}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}

function CONSULT(s) {
  return s.consulte ? `consultée le ${s.consulte}` : "consultée le 28 août 2026";
}

/** Libellés du maillage interne (sinon on affiche des slugs aux lecteurs). */
const TITRES = {
  "/comparatif": "Comparatif iPhone 16 / 17 / 18",
  "/boutique": "La boutique Apple : 5 rayons, 15 références",
  "/guides": "Tous les guides de vérification",
  "/guides/ios-26-quels-iphone-compatibles": "iOS 26 : quels iPhone sont compatibles",
  "/guides/apple-intelligence-verifier-iphone": "Apple Intelligence : vérifier en deux écrans",
  "/guides/verifier-garantie-iphone-numero-de-serie": "Vérifier la garantie d'un iPhone",
  "/guides/iphone-renewed-ce-que-ca-couvre": "iPhone Renewed : ce que ça couvre",
  "/guides/esim-iphone-compatibilite": "eSIM sur iPhone : compatibilité et pièges",
  "/guides/quel-chargeur-pour-iphone": "Quel chargeur pour quel iPhone",
  "/guides/iphone-verrouille-operateur-comment-verifier": "iPhone verrouillé : le vérifier",
  "/guides/ios-26-sur-iphone-13-14-15": "iOS 26 sur iPhone 13, 14 et 15",
  "/produit/iphone-16": "Fiche iPhone 16",
  "/produit/iphone-15": "Fiche iPhone 15",
  "/produit/iphone-13": "Fiche iPhone 13 (Renewed)",
  "/produit/iphone-17e": "Fiche iPhone 17e",
  "/produit/apple-30w": "Fiche adaptateur Apple 30 W",
};
