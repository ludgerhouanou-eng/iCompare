import { notFound } from "next/navigation";
import { SITE } from "../../../lib/site.js";
import {
  FICHE_SLUGS,
  getFiche,
  ficheUrl,
  fichesVoisines,
  faitsRapides,
  prixPlancher,
} from "../../../lib/fiches.js";
import {
  PRIX_DATE_ISO,
  PRIX_DATE_FR,
  dateGeneration,
  joursDepuisReleve,
  prixPerime,
} from "../../../lib/prix.js";
import PhoneSVG from "../../../components/PhoneSVG.jsx";
import ProductArt from "../../../components/ProductArt.jsx";
import Disclosure from "../../../components/Disclosure.jsx";

/** 18 fiches prérendues ; une URL inconnue répond 404, pas une fiche vide. */
export const dynamicParams = false;
export function generateStaticParams() {
  return FICHE_SLUGS.map((slug) => ({ slug }));
}

/**
 * Titre et description propres à chaque fiche : sans cela, les 17 URLs
 * partagent le <title> de la page mère (contenu dupliqué aux yeux de Google,
 * et un snippet identique dans les résultats de recherche).
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const fiche = getFiche(slug);
  if (!fiche) return {};
  const url = ficheUrl(fiche.slug);
  const desc = descriptionDe(fiche);
  return {
    title: fiche.titre,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "fr_FR",
      url: `${SITE.url}${url}`,
      siteName: SITE.name,
      title: `${fiche.nom} — iCompare`,
      description: desc,
      modifiedTime: `${PRIX_DATE_ISO}T09:00:00+02:00`,
      images: [{ url: "/og-comparatif.jpg", width: 1200, height: 675, alt: `iCompare — ${fiche.nom}` }],
    },
    twitter: { card: "summary_large_image" },
  };
}

function descriptionDe(fiche) {
  const parts = [
    fiche.sousTitre ? `${fiche.nom} — ${fiche.sousTitre.trim().replace(/\.$/, "")}.` : `${fiche.nom}.`,
    fiche.vente
      ? fiche.reduction
        ? `Prix relevé le ${PRIX_DATE_FR} : ${fiche.prix}, soit ${fiche.reduction.pourcent} % sous le prix de lancement (${fiche.reduction.lancement} €).`
        : `Prix relevé le ${PRIX_DATE_FR} : ${fiche.prix}.`
      : "Produit non commercialisé à ce jour : aucun lien d'achat n'est proposé.",
    fiche.specs.length
      ? "Fiche technique complète, verdict iCompare et où le trouver."
      : "Ce que la fiche sait (et ne sait pas) de ce modèle, et où le trouver.",
  ];
  return parts.join(" ").replace(/\s+/g, " ");
}

function schemaLd(fiche) {
  const product = {
    "@type": "Product",
    name: fiche.nom,
    description: descriptionDe(fiche),
    image: [`${SITE.url}/hero.jpg`],
    brand: { "@type": "Brand", name: fiche.marque },
    category: fiche.categorieLabel,
  };
  if (fiche.asin) product.sku = fiche.asin;

  const plancher = prixPlancher(fiche);
  if (fiche.vente && fiche.urlAffilie && plancher) {
    product.offers = {
      "@type": "Offer",
      url: fiche.urlAffilie,
      priceCurrency: "EUR",
      price: String(plancher),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    };
  } else {
    // Ni prix fiable ni lien : on n'invente pas d'Offer (Google les pénalise).
    product.offers = undefined;
  }

  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: SITE.url },
        {
          "@type": "ListItem",
          position: 2,
          name: fiche.categorieLabel,
          item: `${SITE.url}/${fiche.famille === "iphone" ? "comparatif" : "boutique"}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: fiche.nom,
          item: `${SITE.url}${ficheUrl(fiche.slug)}`,
        },
      ],
    },
    { "@context": "https://schema.org", ...product },
  ];
}

export default async function FicheProduit({ params }) {
  const { slug } = await params;
  const fiche = getFiche(slug);
  if (!fiche) notFound();

  const voisins = fichesVoisines(fiche.slug);
  const faits = faitsRapides(fiche.slug);
  const perime = prixPerime();
  const age = joursDepuisReleve();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLd(fiche)) }}
      />

      <div className="container page-head">
        <nav className="breadcrumbs" aria-label="Fil d'Ariane">
          <a href="/">Accueil</a> /{" "}
          <a href={fiche.famille === "iphone" ? "/comparatif" : "/boutique"}>
            {fiche.categorieLabel}
          </a>{" "}
          / {fiche.nom}
        </nav>
        <p className="kicker">
          Fiche produit · prix Amazon relevés le {PRIX_DATE_FR}
        </p>
        <h1>{fiche.nom}</h1>
        <p className="lead">{fiche.sousTitre}</p>
      </div>

      <section className="section" style={{ paddingTop: 18 }}>
        <div className="container">
          <header className="fiche-grid">
            <div className="fiche-art">
              {fiche.art.kind === "phone" ? (
                <PhoneSVG
                  id={`f-${fiche.slug}`}
                  color={fiche.art.color}
                  colorDark={fiche.art.colorDark}
                  height={300}
                  label={fiche.legende}
                />
              ) : (
                <ProductArt
                  id={`f-${fiche.slug}`}
                  kind={fiche.art.kind}
                  color={fiche.art.color}
                  colorDark={fiche.art.colorDark}
                  height={230}
                  label={fiche.legende}
                />
              )}
            </div>

            <div className="fiche-head">
              {fiche.badge && (
                <span className={`badge badge-${fiche.badge.tone || "gray"}`}>
                  {fiche.badge.label}
                </span>
              )}

              <div className="prix-box">
                <span className="price-now">{fiche.prixAffiche}</span>
                {fiche.reduction && (
                  <span className="eco">
                    −{fiche.reduction.pourcent} % · {fiche.reduction.euros} € sous le prix Apple de{" "}
                    {fiche.reduction.lancement} €
                  </span>
                )}
                <span className="price-note">{fiche.prixNote}</span>
              </div>

              {fiche.vente && fiche.urlAffilie ? (
                <a
                  className="btn btn-amber btn-block"
                  href={fiche.urlAffilie}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                >
                  Voir le prix sur Amazon
                </a>
              ) : (
                <span className="btn btn-disabled btn-block">
                  Non commercialisé — aucun lien d'achat
                </span>
              )}

              {fiche.rumeur && (
                <p className="price-note">
                  Modèle non sorti : les données ci-dessous sont des rumeurs sourcées, pas des
                  spécifications officielles.
                </p>
              )}

              {fiche.coloris.length > 0 && (
                <ul className="coloris" aria-label="Coloris annoncés">
                  {fiche.coloris.map((c) => (
                    <li key={c} className="colori">
                      <span className="swatch" aria-hidden="true" style={{ background: fiche.art.color }} />
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </header>

          {fiche.atouts.length > 0 && (
            <ul className="chip-row" aria-label="Points clés">
              {fiche.atouts.map((h) => (
                <li key={h} className="chip">
                  {h}
                </li>
              ))}
            </ul>
          )}

          <Disclosure />

          {perime && (
            <p className="note-box" role="note">
              <strong>À revérifier :</strong> relevé du {PRIX_DATE_FR}, il y a {age} jours. Montant à
              contrôler sur la fiche Amazon avant d'acheter.
            </p>
          )}

          {fiche.verdict && (
            <section className="fiche-bloc">
              <h2>Notre verdict</h2>
              <p className="verdict-title">{fiche.verdict.title}</p>
              <p>{fiche.verdict.text}</p>
            </section>
          )}

          {faits.length > 0 && (
            <section className="fiche-bloc">
              <h2>L'essentiel, ligne par ligne</h2>
              <table className="spec spec-simple">
                <caption className="sr-only">
                  Caractéristiques clés de {fiche.nom} ; ★ = meilleure valeur des trois iPhone comparés
                </caption>
                <tbody>
                  {faits.map((f) => (
                    <tr key={f.label}>
                      <th scope="row">{f.label}</th>
                      <td className={f.meilleur ? "best" : undefined}>
                        <span>{f.value}</span>
                        {f.meilleur && (
                          <span className="best-tag" aria-label="meilleure valeur de la ligne">
                            ★
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {fiche.specs.length > 0 && (
            <section className="fiche-bloc">
              <h2>Fiche technique</h2>
              {fiche.specs.map((g) => (
                <div key={g.id} className="spec-block">
                  <h3>{g.title}</h3>
                  <table className="spec spec-simple">
                    <tbody>
                      {g.rows.map((r) => (
                        <tr key={r.label}>
                          <th scope="row">{r.label}</th>
                          <td className={r.meilleur ? "best" : undefined}>
                            <span>{r.value}</span>
                            {r.meilleur && (
                              <span className="best-tag" aria-label="meilleure valeur de la ligne">
                                ★
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </section>
          )}

          {fiche.aVerifier && <p className="note-box">{fiche.aVerifier}</p>}

          <nav className="voisins" aria-label="Autres fiches à comparer">
            <h2>À comparer avant d'acheter</h2>
            <ul className="grid-3">
              {voisins.map((v) => (
                <li key={v.slug} className="card voisin">
                  <a href={ficheUrl(v.slug)}>
                    <strong>{v.nom}</strong>
                    <span className="price-note">{v.prixAffiche}</span>
                    {v.reduction && <span className="eco">−{v.reduction.pourcent} %</span>}
                  </a>
                </li>
              ))}
            </ul>
            <p className="table-legend">
              Page générée le {dateGeneration()} à partir des données relevées le {PRIX_DATE_FR}.
            </p>
          </nav>
        </div>
      </section>
    </>
  );
}
