import PhoneSVG from "./PhoneSVG.jsx";
import { PRODUCTS, productLink, UPDATED } from "../lib/products.js";

/**
 * Barre d'achat fixe (bas d'écran) : conversion rapide vers Amazon.
 * Affichée uniquement sur la page comparatif.
 */
export default function BuyBar() {
  return (
    <div className="buybar" aria-label="Achat rapide">
      <div className="container buybar-inner">
        {PRODUCTS.filter((p) => p.available).map((p) => (
          <a
            key={p.id}
            className="btn btn-amber btn-sm"
            href={productLink(p)}
            target="_blank"
            rel="sponsored nofollow noopener"
          >
            <PhoneSVG id={`bb-${p.id}`} color={p.color} colorDark={p.colorDark} height={26} label="" />
            {p.name} — voir le prix
          </a>
        ))}
        <span className="buybar-note">Liens affiliés Amazon · Prix vérifiés le {UPDATED}</span>
      </div>
    </div>
  );
}
