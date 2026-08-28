import ProductGlyph from "./ProductGlyph.jsx";
import { ficheUrl, getFiche } from "../lib/fiches.js";
import { AFFICHER_MONTANTS, mentionEcart } from "../lib/prix.js";

/**
 * Carte produit de la boutique — rendue côté serveur, donc présente dans le
 * HTML indexé même sans JavaScript, et absente du payload d'hydratation.
 *
 * AUCUN MONTANT N'EST AFFICHÉ ICI. Ce n'est pas une préférence de design :
 * les Politiques du Programme Partenaires Amazon FR (rubrique « Liens présents
 * sur votre site », mise à jour du 14 avril 2026) n'autorisent un Site à
 * indiquer les prix et la disponibilité que si (a) Amazon fournit le lien qui
 * les affiche, ou (b) le Partenaire les obtient par la PA API. Nos montants,
 * eux, viennent d'un relevé à la main : ils ne peuvent pas être présentés
 * comme le prix du jour. La politique impose par ailleurs de retirer toute
 * mention de promotion dès qu'elle prend fin — ce qu'un build statique ne sait
 * pas détecter.
 *
 * D'où le contrat de cette carte : le prix vit chez Amazon, atteint par le
 * bouton ; la carte ne garde qu'un rappel daté, formulé en écart au prix de
 * lancement Apple (un fait historique, qui ne se périme pas), jamais en « offre
 * du moment ». Le garde-fou `npm run check` vérifie qu'aucun « € » ne subsiste
 * sur /boutique.
 */
export default function ProductCard({ product, urlAffilie }) {
  const fiche = ficheUrl(product.id);
  // La remise est calculée à partir des mêmes montants que la fiche produit :
  // un seul relevé en amont, deux rendus en aval — jamais deux chiffres à jour
  // indépendamment l'un de l'autre.
  const reduction = getFiche(product.id)?.reduction ?? null;

  return (
    <article className="card phone-card" data-cat={product.category}>
      {product.badge && (
        <span className={`badge badge-${product.badgeTone} phone-badge`}>{product.badge}</span>
      )}

      <div className="art-stage art-stage-compact">
        <ProductGlyph kind={product.kind} color={product.artColor} label={product.name} />
        <div className="art-meta">
          <h3>
            <a href={fiche}>{product.name}</a>
          </h3>
          <p className="phone-tag">{product.sub}</p>
        </div>
      </div>

      <p className="product-tagline">{product.tagline}</p>

      <div className="phone-price">
        {AFFICHER_MONTANTS ? (
          <>
            <span className="price-now">{product.price}</span>
            <span className="price-note">{product.priceNote}</span>
          </>
        ) : (
          <>
            {reduction && (
              <span className="price-remise">{mentionEcart(reduction)}</span>
            )}
            <span className="price-note">
              Prix et disponibilité : seuls ceux affichés par Amazon font foi
            </span>
          </>
        )}
      </div>

      <div className="card-actions">
        {urlAffilie ? (
          <a
            className="btn btn-amber btn-block"
            href={urlAffilie}
            target="_blank"
            rel="sponsored nofollow noopener"
          >
            Consulter le prix sur Amazon
          </a>
        ) : (
          <span className="btn btn-disabled btn-block">Aucun lien disponible</span>
        )}
        <a className="link-fiche" href={fiche}>
          Fiche complète ({product.kind === "phone" ? "caractéristiques" : "détails"}) →
        </a>
      </div>
    </article>
  );
}
