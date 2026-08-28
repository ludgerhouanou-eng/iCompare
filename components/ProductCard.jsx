import ProductArt from "./ProductArt.jsx";
import PhoneSVG from "./PhoneSVG.jsx";
import { ficheUrl, getFiche } from "../lib/fiches.js";
import { AFFICHER_MONTANTS, mentionEcart } from "../lib/prix.js";

/**
 * Le visuel du produit. Un `image` fourni (URL d'un visuel officiel récupéré
 * via Link Builder / la PA API) prime ; sinon on dessine le produit soi-même,
 * en vectoriel : 1 Ko, net à toute résolution, jamais une photo volée.
 * `kind` + `artColor` + `artDark` sont saisis par produit, donc l'Apple Watch
 * Ultra 3 en titane et la SE 3 Starlight ne se ressemblent pas.
 */
function Visuel({ product, height = 150 }) {
  if (product.image) {
    return (
      <img
        className="product-photo"
        src={product.image}
        width={product.imageWidth || 320}
        height={product.imageHeight || 240}
        alt={`${product.name} — ${product.sub}`}
        loading="lazy"
      />
    );
  }
  const label = `Illustration : ${product.name}, ${product.sub}`;
  if (product.kind === "phone") {
    return (
      <PhoneSVG
        color={product.artColor}
        colorDark={product.artDark}
        id={product.id}
        height={height}
        label={label}
      />
    );
  }
  return (
    <ProductArt
      kind={product.kind}
      color={product.artColor}
      colorDark={product.artDark}
      id={product.id}
      height={height}
      label={label}
    />
  );
}

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
 * visuel ET par le bouton ; la carte ne garde qu'un rappel daté, formulé en
 * écart au prix de lancement Apple (un fait historique, qui ne se périme pas),
 * jamais en « offre du moment ». Le garde-fou `npm run check` vérifie
 * qu'aucun « € » ne subsiste sur /boutique et qu'aucune carte n'est sans
 * visuel ni sans porte de sortie.
 */
export default function ProductCard({ product, urlAffilie }) {
  const fiche = ficheUrl(product.id);
  // La remise est calculée à partir des mêmes montants que la fiche produit :
  // un seul relevé en amont, deux rendus en aval — jamais deux chiffres à jour
  // indépendamment l'un de l'autre.
  const reduction = getFiche(product.id)?.reduction ?? null;
  // Le visuel est cliquable : c'est « cliquer sur l'image pour accéder à
  // l'espace d'achat ». Sans lien affilié connu, il mène à notre fiche, et non
  // pas à une destination devinée.
  const destination = urlAffilie || fiche;

  return (
    <article className="card phone-card" data-cat={product.category}>
      {product.badge && (
        <span className={`badge badge-${product.badgeTone} phone-badge`}>{product.badge}</span>
      )}

      <a
        className="product-hit"
        href={destination}
        {...(urlAffilie ? { target: "_blank", rel: "sponsored nofollow noopener" } : {})}
        aria-label={
          urlAffilie
            ? `Ouvrir ${product.name} sur Amazon`
            : `Fiche ${product.name} sur iCompare`
        }
      >
        <span className="art-stage art-stage-card">
          <Visuel product={product} />
        </span>
      </a>

      <div className="art-meta">
        <h3>
          <a href={fiche}>{product.name}</a>
        </h3>
        <p className="phone-tag">{product.sub}</p>
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
