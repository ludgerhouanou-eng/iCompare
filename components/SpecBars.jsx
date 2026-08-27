import { PRODUCTS } from "../lib/products.js";

/**
 * Barres comparatives visuelles (indexées sur la meilleure valeur).
 */
export default function SpecBars({ groups }) {
  return (
    <div className="bars">
      {groups.map((g) => (
        <div className="bar-group" key={g.label}>
          <div className="bar-group-title">{g.label}</div>
          {g.rows.map((r, i) => (
            <div className="bar-row" key={i}>
              <span className="bar-name">{PRODUCTS[i].name.replace("iPhone ", "")}</span>
              <div
                className="bar-track"
                role="img"
                aria-label={`iPhone ${i + 16} : ${r.value}`}
              >
                <div className={`bar-fill b-${PRODUCTS[i].id}`} style={{ width: `${r.pct}%` }} />
              </div>
              <span className="bar-val">{r.value}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
