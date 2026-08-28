"use client";

import { useEffect, useState } from "react";

/**
 * Onglets de filtrage de la boutique.
 *
 * Volontairement AVIDE de données : les cartes sont rendues côté serveur
 * (visibles sans JavaScript et dans le HTML indexé), et ce composant ne fait
 * que masquer/afficher des sections déjà présentes dans le DOM. Un client
 * component qui reçoit les 15 produits en props les fait atterrir une seconde
 * fois dans le payload RSC — c'est exactement ce qui alourdissait la page.
 */
export default function CategoryTabs({ categories, total }) {
  const [active, setActive] = useState("all");

  useEffect(() => {
    const sections = document.querySelectorAll("[data-cat-section]");
    for (const s of sections) {
      const match = active === "all" || s.dataset.catSection === active;
      s.classList.toggle("is-hidden", !match);
    }
  }, [active]);

  const bouton = (id, libelle, compteur) => (
    <button
      key={id}
      type="button"
      className={active === id ? "tab-btn active" : "tab-btn"}
      aria-pressed={active === id}
      onClick={() => setActive(id)}
    >
      {libelle}
      {compteur != null && <span className="tab-count">{compteur}</span>}
    </button>
  );

  return (
    <nav className="tabs" aria-label="Filtrer la boutique par catégorie">
      {bouton("all", "Tout voir", total)}
      {categories.map((c) =>
        bouton(c.id, `${c.icon} ${c.name}`, c.count)
      )}
    </nav>
  );
}
