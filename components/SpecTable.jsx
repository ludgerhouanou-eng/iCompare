import PhoneSVG from "./PhoneSVG.jsx";
import { PRODUCTS, QUICK_ROWS, SPEC_GROUPS, UPDATED } from "../lib/products.js";

export default function SpecTable({ groups }) {
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
                  <PhoneSVG
                    id={`head-${p.id}`}
                    color={p.color}
                    colorDark={p.colorDark}
                    height={84}
                    label={p.name}
                  />
                  <span className="spec-head-name">{p.name}</span>
                  {p.rumored && <span className="badge badge-purple badge-xs">Rumeurs</span>}
                  <span className="spec-head-price">{p.priceNow}</span>
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
