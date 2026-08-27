import PhoneSVG from "../components/PhoneSVG.jsx";
import HeroSlider from "../components/HeroSlider.jsx";
import FaqItem from "../components/FaqItem.jsx";
import { PRODUCTS, VERDICTS, FAQS, productLink, UPDATED } from "../lib/products.js";
import { CATEGORIES, BOUTIQUE_PRODUCTS } from "../lib/catalog.js";

export const metadata = {
  title: "Comparateur iPhone 2026 : iPhone 16, 17 & 18 comparés",
  description:
    "Comparez iPhone 16, 17 et 18 : fiches techniques, prix Amazon vérifiés, verdicts et conseils d'achat. Trouvez le bon iPhone en 2026 sans vous tromper.",
};

const PHONE_PHOTOS = {
  "iphone-16": "/phones/iphone-16.png",
  "iphone-17": "/phones/iphone-17-gamme.png",
  "iphone-18": "/phones/iphone-18.png",
};

function PhoneCard({ p }) {
  const photo = PHONE_PHOTOS[p.id];
  return (
    <article className="card phone-card">
      <span className={`badge badge-${p.badge.tone} phone-badge`}>{p.badge.label}</span>
      <div className={photo ? "photo-stage" : "phone-stage"}>
        {photo ? (
          <img
            className="phone-photo"
            src={photo}
            alt={`${p.name} — vue du produit`}
            width={1319}
            height={742}
            loading="lazy"
          />
        ) : (
          <PhoneSVG id={`card-${p.id}`} color={p.color} colorDark={p.colorDark} height={230} label={`Représentation de l'${p.name}`} />
        )}
      </div>
      <div className="phone-info">
        <h3>{p.name}</h3>
        <p className="phone-tag">
          {p.tagline} · {p.available ? "En vente" : "Non sorti (rumeur)"}
        </p>
        <ul className="chip-row">
          {p.highlights.map((h) => (
            <li key={h} className="chip">{h}</li>
          ))}
        </ul>
        <div className="phone-price">
          <span className="price-now">{p.available ? p.priceNow : "Non commercialisé"}</span>
          <span className="price-note">{p.priceNote}</span>
        </div>
        {p.available ? (
          <a
            className="btn btn-amber btn-block"
            href={productLink(p)}
            target="_blank"
            rel="sponsored nofollow noopener"
          >
            Voir le prix sur Amazon
          </a>
        ) : (
          <span className="btn btn-disabled btn-block">Précommandes : printemps 2027</span>
        )}
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="kicker">Comparateur iPhone · Prix vérifiés le {UPDATED}</p>
          <h1>
            iPhone 16, 17 ou 18 ?
            <br />
            <span className="grad-text">Le bon iPhone, au bon prix.</span>
          </h1>
          <p className="hero-sub">
            Fiches techniques comparées, verdicts clairs et prix Amazon vérifiés.
            Trouvez l'iPhone fait pour vous en 3 minutes — sans noyade technique.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-amber" href="/comparatif">Voir le comparatif complet →</a>
            <a className="btn btn-ghost" href="/comparatif#verdict">Le verdict en 30 secondes</a>
          </div>
        </div>
        <div className="container hero-img-wrap">
          <HeroSlider />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="kicker">La gamme en 2026</p>
          <h2 className="section-title">Les 3 iPhone à considérer en 2026</h2>
          <p className="section-sub">
            Deux sont en vente, un arrive. Voici où en est chacun, et ce que chacun vaut vraiment.
          </p>
          <div className="grid-3">
            {PRODUCTS.map((p) => (
              <PhoneCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <p className="kicker">Notre verdict</p>
          <h2 className="section-title">En 30 secondes, on vous dit quoi</h2>
          <p className="section-sub">Pas de blabla : trois profils, trois recommandations.</p>
          <div className="grid-3">
            {VERDICTS.map((v) => {
              const p = PRODUCTS.find((x) => x.id === v.productId);
              return (
                <article key={p.id} className={`card verdict-card ${v.toneClass}`}>
                  <span className={`badge badge-${p.badge.tone}`}>{p.badge.label}</span>
                  <h3 className="verdict-title">{p.name} — {v.title}</h3>
                  <p>{v.text}</p>
                </article>
              );
            })}
          </div>
          <p style={{ marginTop: 26 }}>
            <a className="btn btn-ghost" href="/comparatif">
              Lire le comparatif complet, fiche technique par fiche technique →
            </a>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="kicker">Méthode</p>
          <h2 className="section-title">Comment nous comparons</h2>
          <p className="section-sub">
            Un comparatif n'a de valeur que si ses chiffres sont sérieux. Voici notre méthode.
          </p>
          <div className="grid-3">
            <div className="card">
              <h3>1. Fiches officielles</h3>
              <p style={{ color: "var(--text-2)", fontSize: 14.5 }}>
                Écran, puce, capteurs, batterie : chaque caractéristique des iPhone 16 et 17
                est issue des fiches techniques officielles d'Apple, recoupées avec les mesures
                de la presse spécialisée.
              </p>
            </div>
            <div className="card">
              <h3>2. Rumeurs sourcées</h3>
              <p style={{ color: "var(--text-2)", fontSize: 14.5 }}>
                L'iPhone 18 n'existe pas encore : chaque valeur de la colonne 3 provient de
                sources identifiables (Bloomberg, Ming-Chi Kuo, Nikkei) et est marquée
                « rumeur ». Jamais de chiffre inventé.
              </p>
            </div>
            <div className="card">
              <h3>3. Prix suivis</h3>
              <p style={{ color: "var(--text-2)", fontSize: 14.5 }}>
                Les prix Amazon sont relevés manuellement et la date de relevé est indiquée
                sur la page. Les iPhone bougent vite : on re-vérifie régulièrement, surtout
                avant les gros événements de vente.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <p className="kicker">FAQ</p>
          <h2 className="section-title">Les questions qu'on nous pose le plus</h2>
          <p className="section-sub">
            Les 3 plus fréquentes ici, les 7 autres dans le comparatif.
          </p>
          {FAQS.slice(0, 3).map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
          ))}
          <p style={{ marginTop: 20 }}>
            <a className="btn btn-ghost" href="/comparatif#faq">
              Toutes les questions fréquentes →
            </a>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="kicker">L'univers Apple</p>
          <h2 className="section-title">Et le reste de l'écosystème ?</h2>
          <p className="section-sub">
            Apple Watch, anciens iPhone, iPad, AirPods et accessoires : la même méthode —
            sélection courte, prix Amazon vérifiés le {UPDATED}, liens affiliés.
          </p>
          <div className="grid-5">
            {CATEGORIES.map((c) => {
              const count = BOUTIQUE_PRODUCTS.filter((p) => p.category === c.id).length;
              return (
                <a key={c.id} className="card profile-card" href={`/boutique#${c.id}`}>
                  <h4>
                    <span aria-hidden="true">{c.icon}</span> {c.name}
                  </h4>
                  <p>{c.blurb}</p>
                  <span className="badge badge-blue">{count} produits</span>
                </a>
              );
            })}
          </div>
          <p style={{ marginTop: 26 }}>
            <a className="btn btn-amber" href="/boutique">
              Explorer la boutique Apple →
            </a>
          </p>
        </div>
      </section>

      <section className="cta-final">
        <div className="container">
          <h2>Prêt à choisir votre iPhone ?</h2>
          <p>
            Le comparatif complet attend : 35 lignes de caractéristiques, une analyse
            écran/puce/photo/batterie, les prix Amazon du {UPDATED} et une FAQ complète.
          </p>
          <a className="btn btn-amber" href="/comparatif">
            Ouvrir le comparatif iPhone 16 / 17 / 18 →
          </a>
        </div>
      </section>
    </>
  );
}
