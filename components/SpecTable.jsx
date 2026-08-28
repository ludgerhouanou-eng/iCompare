import { PRODUCTS, QUICK_ROWS, SPEC_GROUPS, UPDATED } from "../lib/products.js";
import { AFFICHER_MONTANTS, ecartProduit } from "../lib/prix.js";
import { ficheUrl } from "../lib/fiches.js";

export default function SpecTable({ groups, compact = false }) {
  return (
    <div
      className="spec-table-wrap"
      role="region"
      aria-label="Tableau comparatif des caractéristiques techniques"
      tabIndex={0}
    >
      <table className="spec">
        <thead>
          <tr>
            <th scope="col">Caractéristique</th>
            {PRODUCTS.map((p) => (
              <th key={p.id} scope="col" className={p.rumored ? "col-rumor" : ""}>
                <div className="spec-head">
                  {!compact && (
                    <span className="swatch swatch-lg" style={{ background: p.color }} aria-hidden="true" />
                  )}
                  <span className="spec-head-name">
                    <a href={ficheUrl(p.id)}>{p.name}</a>
                  </span>
                  {p.rumored && <span className="badge badge-purple badge-xs">Rumeurs</span>}
                  {AFFICHER_MONTANTS ? (
                    <span className="spec-head-price">{p.priceNow}</span>
                  ) : (
                    // La date est dans la légende du tableau, juste en dessous :
                    // un en-tête de colonne n'a pas la place de la porter.
                    <span className="spec-head-price">
                      {p.rumored
                        ? "non commercialisé"
                        : ecartProduit(p)
                          ? `−${ecartProduit(p).pourcent} % vs Apple`
                          : "au prix conseillé"}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => (
            <SpecGroupRows key={g.id} g={g} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SpecGroupRows({ g }) {
  return (
    <>
      <tr className="spec-group">
        <th colSpan="4">{g.title}</th>
      </tr>
      {g.rows.map((r) => (
        <tr key={r.label}>
          <th scope="row">{r.label}</th>
          {r.values.map((v, i) => {
            const isBest = Array.isArray(r.best) ? r.best.includes(i) : r.best === i;
            const p = PRODUCTS[i];
            const cls = [
              isBest ? "best" : "",
              p.rumored ? "rumor" : "",
              p.rumored ? "col-rumor" : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <td key={i} className={cls || undefined}>
                <span>{v}</span>
                {isBest && (
                  <span className="best-tag" aria-label="meilleure valeur">
                    ★
                  </span>
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}

export { QUICK_ROWS, SPEC_GROUPS, UPDATED };
