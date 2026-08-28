import { SITE, offresLink } from "../../lib/site.js";
import { AFFICHER_MONTANTS, mentionEcart } from "../../lib/prix.js";
import { FICHES_PROMO, FICHES_EN_VENTE, ficheUrl } from "../../lib/fiches.js";
import {
  PRIX_DATE_FR,
  PRIX_VETUSTE_MAX_JOURS,
  dateGeneration,
  joursDepuisReleve,
  prixPerime,
} from "../../lib/prix.js";
import Disclosure from "../../components/Disclosure.jsx";

export const metadata = {
  title: "Bons plans Apple : les remises relevées sur Amazon",
  description: `Bons plans Apple (${PRIX_DATE_FR}) : ${FICHES_PROMO.length} références vendues sous leur prix de lancement, remises triées par économie, liens vers la fiche complète.`,
  alternates: { canonical: "/bons-plans" },
  openGraph: {
    type: "website",
    url: `${SITE.url}/bons-plans`,
    siteName: SITE.name,
    title: "Bons plans Apple — iCompare",
    description: `Écarts relevés le ${PRIX_DATE_FR} par rapport aux prix de lancement Apple : tri, dates et liens vers la fiche Amazon de chaque référence.`,
    images: [{ url: "/og-comparatif.jpg", width: 1200, height: 675, alt: "Bons plans Apple iCompare" }],
  },
};

/** Une page « bons plans » n'a de valeur que fraîche : on le dit, on le mesure. */
const age = joursDepuisReleve();
const perime = prixPerime();

const ecoMoyenne = FICHES_PROMO.length
  ? Math.round(FICHES_PROMO.reduce((s, f) => s + f.reduction.pourcent, 0) / FICHES_PROMO.length)
  : 0;

const schemaLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Bons plans Apple relevés sur Amazon",
  numberOfItems: FICHES_PROMO.length,
  itemListElement: FICHES_PROMO.map((f, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${SITE.url}${ficheUrl(f.slug)}`,
    name: f.nom,
  })),
};

export default function BonsPlans() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLd) }} />

      <div className="container page-head">
        <nav className="breadcrumbs" aria-label="Fil d'Ariane">
          <a href="/">Accueil</a> / Bons plans Apple
        </nav>
        <p className="kicker">Bons plans · relevé manuel du {PRIX_DATE_FR}</p>
        <h1>
          Les produits Apple vendus <span className="grad-text">sous leur prix de lancement</span>
        </h1>
        <p className="lead">
          Sur {FICHES_EN_VENTE.length} références suivies, {FICHES_PROMO.length} passent sous leur prix
          Apple. Écart moyen relevé : <strong>{ecoMoyenne} %</strong>. Triées par écart constaté, pas
          par « promo » déclarée — et sans montant recopié : le prix qui compte est celui qu’Amazon
          affiche au moment du clic.
        </p>
      </div>

      <section className="section" style={{ paddingTop: 18 }}>
        <div className="container">
          {perime ? (
            <p className="note-box" role="alert">
              <strong>Cette page est à rafraîchir :</strong> le relevé date de {age} jours (seuil de
              fiabilité : {PRIX_VETUSTE_MAX_JOURS} jours). Les écarts ci-dessous ne doivent plus être
              pris comme une remise en cours. Dernière génération du site : {dateGeneration()}.
            </p>
          ) : (
            <p className="note-box note-ok">
              Relevé vieux de {age} jour{age > 1 ? "s" : ""} — dans la fenêtre de fiabilité{" "}
              ({PRIX_VETUSTE_MAX_JOURS} jours). Page générée le {dateGeneration()}.
            </p>
          )}

          <Disclosure />

          <ol className="deals">
            {FICHES_PROMO.map((f) => (
              <li key={f.slug} className="card deal">
                <div className="deal-rank" aria-hidden="true">
                  {FICHES_PROMO.indexOf(f) + 1}
                </div>
                <div className="deal-body">
                  <p className="deal-cat">{f.categorieLabel}</p>
                  <h2>
                    <a href={ficheUrl(f.slug)}>{f.nom}</a>
                  </h2>
                  <p className="deal-sub">{f.atouts.join(" · ")}</p>
                </div>
                <div className="deal-price">
                  {AFFICHER_MONTANTS ? (
                    <>
                      <span className="price-now">{f.prixAffiche}</span>
                      <span className="eco">
                        −{f.reduction.pourcent} % · {f.reduction.euros} € sous les{" "}
                        {f.reduction.lancement} € Apple
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="eco eco-grand">{mentionEcart(f.reduction)}</span>
                      <span className="price-note">
                        Le montant du jour, seul Amazon l’a
                      </span>
                    </>
                  )}
                </div>
                <div className="deal-cta">
                  {f.urlAffilie && (
                    <a
                      className="btn btn-amber btn-sm"
                      href={f.urlAffilie}
                      target="_blank"
                      rel="sponsored nofollow noopener"
                    >
                      Consulter le prix
                    </a>
                  )}
                  <a className="btn btn-ghost btn-sm" href={ficheUrl(f.slug)}>
                    Lire la fiche
                  </a>
                </div>
              </li>
            ))}
          </ol>

          <div className="method-box" style={{ marginTop: 28 }}>
            <h3>Comment ce classement est construit</h3>
            <ul className="usp-list">
              <li>
                Chaque ligne part de deux montants relevés à la main sur Amazon le {PRIX_DATE_FR} : le
                bas de la fourchette affichée, et le prix pratiqué par Apple à la sortie du modèle.
                Seul l’écart entre les deux est publié — les montants, eux, ne sont pas recopiés :
                hors API Amazon, un prix affiché est un prix périmé.
              </li>
              <li>
                Une référence n'apparaît ici que si les deux montants de départ sont connus : pas de
                « −70 % » invérifiable, et aucun écart calculé sur un prix de lancement inventé.
              </li>
              <li>
                Les liens « Consulter le prix » sont des liens affiliés : ils ouvrent la fiche Amazon du
                produit concerné, pas une page d'accueil de marque, pas une recherche.
              </li>
              <li>
                Les prix bougent chaque semaine. Si le bandeau ci-dessus passe en alerte, ce relevé
                n'est plus une information — seulement une trace de date.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/*
        Bouton « toutes les offres » : la page d'offres vers laquelle menait le lien
        raccourci fourni par l'éditeur, reconstruite en direct sur amazon.fr. Un lien
        de recherche ne remplace pas les fiches produit taguées plus haut — il ne
        montre qu'une liste d'annonces, neuf et reconditionné mélangés.
      */}
      <section className="cta-final">
        <div className="container">
          <h2>Voir aussi les offres des autres vendeurs</h2>
          <p>
            La page Amazon ci-dessous regroupe les annonces de la boutique Apple et
            des revendeurs — y compris les générations précédentes, qui sortent de
            notre comparatif. Les montants y sont affichés par Amazon : eux seuls
            font foi, nos relevés datent du {PRIX_DATE_FR}.
          </p>
          <a
            className="btn btn-amber"
            href={offresLink()}
            target="_blank"
            rel="sponsored nofollow noopener"
          >
            Voir toutes les offres iPhone sur Amazon →
          </a>
        </div>
      </section>
    </>
  );
}
