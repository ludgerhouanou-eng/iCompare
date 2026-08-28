"use client";

import { useState } from "react";
import PhoneSVG from "./PhoneSVG.jsx";
import ProductArt from "./ProductArt.jsx";
import { productLink } from "../lib/catalog.js";

/**
 * Boutique : onglets de filtrage par catégorie.
 * Toutes les sections sont rendues dans le HTML initial (SEO),
 * les onglets ne font que masquer/afficher côté client.
 */
export default function BoutiqueClient({ categories, products }) {
  const [active, setActive] = useState("all");
  const visible = (catId) => active === "all" || active === catId;

  return (
    <div className="boutique">
      <nav className="tabs" aria-label="Filtrer par catégorie">
        <button
          type="button"
          className={active === "all" ? "tab-btn active" : "tab-btn"}
          onClick={() => setActive("all")}
        >
          Tout voir ({products.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            className={active === c.id ? "tab-btn active" : "tab-btn"}
            onClick={() => setActive(c.id)}
          >
            <span aria-hidden="true">{c.icon}</span> {c.name}
          </button>
        ))}
      </nav>

      {categories.map((c) => {
        const items = products.filter((p) => p.category === c.id);
        return (
          <section
            key={c.id}
            id={c.id}
            className={`cat-section ${visible(c.id) ? "" : "is-hidden"}`}
            aria-label={c.name}
          >
            <div className="cat-head">
              <h2>
                <span aria-hidden="true">{c.icon}</span> {c.name}
              </h2>
              <p>{c.longBlurb}</p>
            </div>
            <div className="grid-3">
              {items.map((p) => (
                <article key={p.id} className="card phone-card">
                  <span className={`badge badge-${p.badgeTone} phone-badge`}>
                    {p.badge}
                  </span>
                  <div className="art-stage">
                    {p.kind === "phone" ? (
                      <PhoneSVG
                        id={`bq-${p.id}`}
                        color={p.artColor}
                        colorDark={p.artDark}
                        height={210}
                        label={p.name}
                      />
                    ) : (
                      <ProductArt
                        id={`bq-${p.id}`}
                        kind={p.kind}
                        color={p.artColor}
                        colorDark={p.artDark}
                        height={185}
                        label={p.name}
                      />
                    )}
                  </div>
                  <div className="phone-info">
                    <h3>{p.name}</h3>
                    <p className="phone-tag">{p.sub}</p>
                    <p className="product-tagline">{p.tagline}</p>
                    <div className="phone-price">
                      <span className="price-now">{p.price}</span>
                      <span className="price-note">{p.priceNote}</span>
                    </div>
                    <a
                      className="btn btn-amber btn-block"
                      href={productLink(p)}
                      target="_blank"
                      rel="sponsored nofollow noopener"
                    >
                      Voir le prix sur Amazon
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
