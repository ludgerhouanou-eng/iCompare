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
  AFFICHER_MONTANTS,
  mentionEcart,
  dateGeneration,
  joursDepuisReleve,
  prixPerime,
} from "../../../lib/prix.js";
import PhoneSVG from "../../../components/PhoneSVG.jsx";
import ProductArt from "../../../components/ProductArt.jsx";
import Disclosure from "../../../components/Disclosure.jsx";

/** 17 fiches prérendues ; une URL inconnue répond 404, pas une fiche vide. */
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
      ? AFFICHER_MONTANTS
        ? fiche.reduction
          ? `Prix relevé le ${PRIX_DATE_FR} : ${fiche.prix}, soit ${fiche.reduction.pourcent} % sous le prix de lancement (${fiche.reduction.lancement} €).`
          : `Prix relevé le ${PRIX_DATE_FR} : ${fiche.prix}.`
        : `${mentionEcart(fiche.reduction) ?? "Pas d’écart relevé avec son prix de lancement"}. Montant et disponibilité affichés par Amazon sur la fiche du produit.`
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

  // Aucune Offer, même avec un lien valide : la page n'affiche plus de montant,
  // et « InStock » affirmait une disponibilité que le build ne peut pas savoir.
  // Les deux ne reviennent qu'avec SHOW_PRICES=1, c'est-à-dire avec la PA API
  // derrière (Google pénalise un prix déclaré qui n'apparaît pas sur la page).
  const plancher = AFFICHER_MONTANTS ? prixPlancher(fiche) : null;
  if (fiche.vente && fiche.urlAffilie && plancher) {
    product.offers = {
      "@type": "Offer",
      url: fiche.urlAffilie,
      priceCurrency: "EUR",
      price: String(plancher),
      itemCondition: "https://schema.org/NewCondition",
    };
  } else {
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
          Fiche produit · relevé iCompare du {PRIX_DATE_FR}, prix affiché par Amazon
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
                {AFFICHER_MONTANTS ? (
                  <>
                    <span className="price-now">{fiche.prixAffiche}</span>
                    {fiche.reduction && (
                      <span className="eco">
                        −{fiche.reduction.pourcent} % · {fiche.reduction.euros} € sous le prix Apple
                        de {fiche.reduction.lancement} €
                      </span>
                    )}
                    <span className="price-note">{fiche.prixNote}</span>
                  </>
                ) : (
                  <>
                    <span className="price-now price-now-mention">
                      {mentionEcart(fiche.reduction) ?? "Prix affiché par Amazon"}
                    </span>
                    <span className="price-note">
                      {fiche.vente
                        ? "Le montant du jour, seul Amazon en a un : bouton ci-dessous."
                        : "Aucun montant n’est publié avant la commercialisation du produit."}
                    </span>
                  </>
                )}
              </div>

              {fiche.vente && fiche.urlAffilie ? (
                <a
                  className="btn btn-amber btn-block"
                  href={fiche.urlAffilie}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                >
                  Consulter le prix sur Amazon
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
              <strong>À revérifier :</strong> l&#39;écart affiché ci-dessus vient d&#39;un relevé du{" "}
              {PRIX_DATE_FR}, il y a {age} jours — une promotion Amazon prend fin sans nous prévenir.
              Seul le montant affiché par Amazon sur la fiche fait foi.
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
                    {AFFICHER_MONTANTS ? (
                      <span className="price-note">{v.prixAffiche}</span>
                    ) : (
                      <span className="price-note">
                        {v.reduction
                          ? `sous le prix Apple au relevé du ${PRIX_DATE_FR}`
                          : "Notice complète, prix affiché par Amazon"}
                      </span>
                    )}
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
