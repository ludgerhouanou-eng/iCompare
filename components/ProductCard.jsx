import ProductGlyph from "./ProductGlyph.jsx";
import { ficheUrl } from "../lib/fiches.js";

/**
 * Carte produit de la boutique — rendue côté serveur, donc présente dans le
 * HTML indexé même sans JavaScript, et absente du payload d'hydratation.
 */
export default function ProductCard({ product, urlAffilie }) {
  const fiche = ficheUrl(product.id);
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
        <span className="price-now">{product.price}</span>
        <span className="price-note">{product.priceNote}</span>
      </div>

      <div className="card-actions">
        {urlAffilie ? (
          <a
            className="btn btn-amber btn-block"
            href={urlAffilie}
            target="_blank"
            rel="sponsored nofollow noopener"
          >
            Voir le prix sur Amazon
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
