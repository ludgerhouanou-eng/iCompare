import PhoneSVG from "../../components/PhoneSVG.jsx";
import SpecTable from "../../components/SpecTable.jsx";
import SpecBars from "../../components/SpecBars.jsx";
import FaqItem from "../../components/FaqItem.jsx";
import Disclosure from "../../components/Disclosure.jsx";
import BuyBar from "../../components/BuyBar.jsx";
import { SITE } from "../../lib/site.js";
import { AFFICHER_MONTANTS, PRIX_VETUSTE_MAX_JOURS, mentionEcart, ecartProduit } from "../../lib/prix.js";
import {
  PRODUCTS,
  VERDICTS,
  FAQS,
  BARS,
  SPEC_GROUPS,
  QUICK_ROWS,
  UPDATED,
  productLink,
} from "../../lib/products.js";

const TITLE = "iPhone 16 vs 17 vs 18 : comparatif 2026, fiches techniques & verdict";
const DESC =
  "iPhone 16, 17 ou 18 ? Fiches techniques comparées, écarts au prix Apple relevés le 27/08/2026, rumeurs iPhone 18 et notre verdict : quel iPhone choisir en 2026 ?";

export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/comparatif" },
  openGraph: {
    type: "article",
    locale: "fr_FR",
    url: "/comparatif",
    siteName: SITE.name,
    title: TITLE,
    description: DESC,
    publishedTime: "2026-08-27T09:00:00+02:00",
    modifiedTime: "2026-08-27T09:00:00+02:00",
    images: [
      {
        url: "/og-comparatif.jpg",
        width: 1200,
        height: 675,
        alt: "Comparatif iPhone 16 vs iPhone 17 vs iPhone 18",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/og-comparatif.jpg"],
  },
};

/* ---------- JSON-LD : BreadcrumbList + ItemList (Products) + FAQPage ---------- */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: SITE.url },
        {
          "@type": "ListItem",
          position: 2,
          name: "Comparatif iPhone 16 vs 17 vs 18",
          item: `${SITE.url}/comparatif`,
        },
      ],
    },
    {
      "@type": "ItemList",
      name: "Comparatif iPhone 16, iPhone 17 et iPhone 18",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Product",
            name: "Apple iPhone 16 (128 Go)",
            brand: { "@type": "Brand", name: "Apple" },
            description:
              "Puce A18, écran 6,1″ Super Retina XDR (2 000 nits), double caméra 48 + 12 MP, jusqu'à 22 h de vidéo, 170 g.",
            image: [`${SITE.url}/hero.jpg`],
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "Product",
            name: "Apple iPhone 17 (256 Go)",
            brand: { "@type": "Brand", name: "Apple" },
            description:
              "Puce A19, écran 6,3″ ProMotion 120 Hz (3 000 nits, Always-On), double caméra 48 MP, jusqu'à 30 h de vidéo, 177 g.",
            image: [`${SITE.url}/hero.jpg`],
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@type": "Product",
            name: "Apple iPhone 18 (rumeur, printemps 2027)",
            brand: { "@type": "Brand", name: "Apple" },
            description:
              "Produit non officiel. Rumeurs concordantes : puce A20 gravée en 2 nm (TSMC N2), écran 6,3″ 120 Hz, Dynamic Island réduite, modem Apple C2. À confirmer par Apple.",
            image: [`${SITE.url}/hero.jpg`],
          },
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

const PROFILES = [
  {
    title: "Budget serré / étudiant",
    pick: "iPhone 16",
    tone: "green",
    text: "C'est le plus abordable du trio : A18, 48 MP, et encore 3 à 4 ans de mises à jour devant lui.",
  },
  {
    title: "Le choix sans regret",
    pick: "iPhone 17",
    tone: "blue",
    text: "120 Hz, double 48 MP, 30 h d'autonomie : rien ne manque. C'est le meilleur achat global de 2026.",
  },
  {
    title: "Photo & vidéo",
    pick: "iPhone 17",
    tone: "blue",
    text: "Double 48 MP, avant 18 MP Center Stage, ralenti 240 fps. (Pour un zoom optique 4× et plus : gamme Pro, hors comparatif.)",
  },
  {
    title: "Gaming & performances",
    pick: "iPhone 17",
    tone: "blue",
    text: "L'A19 garde une belle marge pour les jeux gourmands et l'IA locale, avec une efficience énergétique en hausse.",
  },
  {
    title: "Je veux le plus récent",
    pick: "Attendre",
    tone: "purple",
    text: "iPhone 18 Pro : septembre 2026. iPhone 18 standard : printemps 2027. Ne commandez pas un 17 en septembre 2026 si vous visez le Pro.",
  },
];

const TIMELINE = [
  {
    date: "Fin août 2026",
    conf: "certain",
    title: "Les invitations arrivent",
    text: "Apple enverra très probablement ses invitations à la keynote cette semaine. La date exacte sera connue à ce moment-là — comme chaque année depuis plus de dix ans.",
  },
  {
    date: "8-9 septembre 2026 (attendu)",
    conf: "fort",
    title: "iPhone 18 Pro, Pro Max & iPhone Fold",
    text: "Puce A20 Pro gravée en 2 nm (TSMC N2), 12 Go de RAM, Dynamic Island réduite, meilleure batterie. Le premier iPhone pliable d'Apple devrait arriver en même temps et capter l'attention médiatique.",
  },
  {
    date: "Printemps 2027 (attendu)",
    conf: "moyen",
    title: "iPhone 18 standard & iPhone 18e",
    text: "Puce A20 en 2 nm, modem Apple C2, Dynamic Island réduite, Apple Intelligence renforcée. C'est cette version — le modèle grand public — qui occupe la 3e colonne de ce comparatif.",
  },
];

export default function ComparatifPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="buybar-page">
        <div className="container page-head">
          <nav className="breadcrumbs" aria-label="Fil d'Ariane">
            <a href="/">Accueil</a> / Comparatif iPhone 16, 17 et 18
          </nav>
          <p className="kicker">Comparatif · Mis à jour le {UPDATED}</p>
          <h1>
            iPhone 16 vs iPhone 17 vs iPhone 18 : le comparatif{" "}
            <span className="grad-text">complet 2026</span>
          </h1>
          <p className="lead">
            <strong>Réponse rapide :</strong> l'<a href="#verdict">iPhone 17</a> est le meilleur
            choix global en 2026 (écran 120 Hz, double 48 MP, 30 h d'autonomie) ; l'
            <a href="#verdict">iPhone 16</a> reste le plus abordable des trois ;
            l'iPhone 18 standard, attendu au <a href="#iphone-18">printemps 2027</a> avec sa
            puce A20 gravée en 2 nm, n'a pas de raison de vous faire attendre.
          </p>
          <Disclosure />
          <nav className="toc" aria-label="Sommaire">
            <span>Sommaire</span>
            <a href="#verdict">1. Verdict express</a>
            <a href="#rapide">2. Comparatif rapide</a>
            <a href="#fiches">3. Fiches techniques</a>
            <a href="#analyse">4. Analyse détaillée</a>
            <a href="#prix">5. Prix &amp; où acheter</a>
            <a href="#iphone-18">6. iPhone 18 : rumeurs</a>
            <a href="#profils">7. Quel iPhone choisir ?</a>
            <a href="#faq">8. FAQ</a>
          </nav>
          <figure className="page-banner">
            <img
              src="/phones/comparatif.png"
              alt="iPhone 16, iPhone 17 Pro et iPhone 18 présentés côte à face pour le comparatif"
              width={1319}
              height={742}
            />
            <figcaption>
              Les trois générations à comparer — de gauche à droite : iPhone 16, iPhone 17
              (ici la version Pro), iPhone 18 (rendu).
            </figcaption>
          </figure>
        </div>

        {/* ---------- 1. VERDICT ---------- */}
        <section className="section" id="verdict">
          <div className="container">
            <p className="kicker">1 · Le verdict en 30 secondes</p>
            <h2 className="section-title">Notre recommandation, sans blabla</h2>
            <div className="grid-3">
              {VERDICTS.map((v) => {
                const p = PRODUCTS.find((x) => x.id === v.productId);
                return (
                  <article key={p.id} className={`card verdict-card ${v.toneClass}`}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <PhoneSVG
                        id={`verd-${p.id}`}
                        color={p.color}
                        colorDark={p.colorDark}
                        height={64}
                        label={p.name}
                      />
                      <div>
                        <h3 style={{ margin: 0 }}>{p.name}</h3>
                        <span className={`badge badge-${p.badge.tone} badge-xs`}>
                          {p.badge.label}
                        </span>
                      </div>
                    </div>
                    <p className="verdict-title">{v.title}</p>
                    <p>{v.text}</p>
                    {p.available ? (
                      <a
                        className="btn btn-ghost btn-sm"
                        href={productLink(p)}
                        target="_blank"
                        rel="sponsored nofollow noopener"
                      >
                        Consulter le prix sur Amazon
                      </a>
                    ) : (
                      <a className="btn btn-ghost btn-sm" href="#iphone-18">
                        Lire les rumeurs ↓
                      </a>
                    )}
                    <a className="link-fiche" href={`/produit/${p.id}`}>
                      Fiche complète de l'{p.name} →
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- 2. COMPARATIF RAPIDE ---------- */}
        <section className="section section-alt" id="rapide">
          <div className="container">
            <p className="kicker">2 · L'essentiel</p>
            <h2 className="section-title">Comparatif rapide : les 8 critères qui comptent</h2>
            <p className="section-sub">
              Le gros du tableau en une seule vue. Le ★ marque la meilleure valeur de la ligne.
            </p>
            <SpecTable
              groups={[{ id: "essentiels", title: "Essentiels", rows: QUICK_ROWS }]}
              compact
            />
            <p className="table-legend">
              ★ = meilleure valeur dans la ligne · valeurs en italique = rumeurs non officielles
              (iPhone 18) · écarts au prix Apple relevés le {UPDATED}.
            </p>
          </div>
        </section>

        {/* ---------- 3. FICHES TECHNIQUES ---------- */}
        <section className="section" id="fiches">
          <div className="container">
            <p className="kicker">3 · Fiches techniques</p>
            <h2 className="section-title">La comparaison complète, critère par critère</h2>
            <p className="section-sub">
              35 lignes de caractéristiques, regroupées par catégorie. Faites défiler
              horizontalement sur mobile, la première colonne reste visible.
            </p>
            <SpecTable groups={SPEC_GROUPS} />
            <p className="table-legend">
              Sources : fiches techniques officielles Apple (iPhone 16, iPhone 17), presse
              spécialisée, et sources de la chaîne d'approvisionnement pour l'iPhone 18
              (non officiel).
            </p>
          </div>
        </section>

        {/* ---------- 4. ANALYSE ---------- */}
        <section className="section section-alt" id="analyse">
          <div className="container">
            <p className="kicker">4 · Analyse détaillée</p>
            <h2 className="section-title">Ce que ces chiffres changent vraiment</h2>
            <p className="section-sub">
              Les barres sont indexées sur la meilleure valeur de chaque critère.
            </p>
            <div className="analysis-grid">
              <SpecBars groups={BARS} />
              <div className="analysis-text analysis-stack">
                <div>
                  <h3>1. L'écran : le saut 120 Hz</h3>
                  <p>
                    C'est <strong>le</strong> critère qui change la sensation d'usage. L'iPhone 17
                    est le premier modèle standard à passer à 120 Hz (ProMotion), avec en prime
                    l'Always-On Display, 3 000 nits de luminosité de pointe et 33 % de reflets en
                    moins. Une fois habitué au 120 Hz, revenir à 60 Hz sur l'iPhone 16 fait
                    vraiment date.
                  </p>
                </div>
                <div>
                  <h3>2. La puce : A18, A19, A20</h3>
                  <p>
                    L'A19 progresse d'environ 10 à 15 % sur le CPU par rapport à l'A18, avec une
                    meilleure efficience. L'A20, gravée en 2 nm (premier process de la génération),
                    promettait côté Pro <strong>+18 % de performances et −30 % de consommation</strong> ;
                    la version standard devrait hériter d'une partie de ces gains, surtout pour
                    l'IA locale (Apple Intelligence).
                  </p>
                </div>
                <div>
                  <h3>3. La photo : le double 48 MP change les choses</h3>
                  <p>
                    L'iPhone 17 double l'ultra grand-angle (48 MP contre 12 MP) : meilleure photo
                    macro, plus de flexibilité au montage, de la lumière faible gagnée. La caméra
                    avant passe à 18 MP avec le mode Center Stage (recadrage automatique). L'
                    iPhone 18 (rumeurs) améliorerait le capteur principal et la caméra avant. Pour
                    un vrai zoom optique 4× et plus, il faudra viser la gamme Pro.
                  </p>
                </div>
                <div>
                  <h3>4. La batterie : de 22 h à 30 h, c'est énorme</h3>
                  <p>
                    Huit heures de vidéo en plus d'un modèle à l'autre, et une charge qui recharge
                    50 % en 20 minutes sur l'iPhone 17 (~40 W) contre 30 minutes sur l'iPhone 16.
                    Avec le MagSafe 25 W et une autonomie d'une journée franche, c'est l'un des
                    arguments les plus concrets du comparatif.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- 5. PRIX ---------- */}
        <section className="section" id="prix">
          <div className="container">
            <p className="kicker">5 · Où acheter</p>
            <h2 className="section-title">Prix &amp; où acheter au bon moment</h2>
            <p className="section-sub">
              Prix relevés le {UPDATED}. Les iPhone fluctuent régulièrement sur Amazon — les plus
              belles baisses arrivent souvent autour des grands événements de vente (Prime Day,
              Black Friday).
            </p>
            <div className="grid-3">
              {PRODUCTS.map((p) => (
                <article key={p.id} className="card price-card">
                  <span className={`badge badge-${p.badge.tone} badge-xs`}>{p.badge.label}</span>
                  <h3>{p.name}</h3>
                  <div>
                    {AFFICHER_MONTANTS ? (
                      <>
                        <span className="price-big">{p.priceDisplay}</span>
                        <span className="price-note">{p.priceNote}</span>
                      </>
                    ) : (
                      <>
                        <span className="price-big price-big-mention">
                          {mentionEcart(ecartProduit(p)) ?? "Non commercialisé"}
                        </span>
                        <span className="price-note">
                          {p.available
                            ? "Montant et disponibilité : sur la fiche Amazon"
                            : "Aucun prix officiel avant l’annonce"}
                        </span>
                      </>
                    )}
                  </div>
                  {p.available ? (
                    <a
                      className="btn btn-amber btn-block"
                      href={productLink(p)}
                      target="_blank"
                      rel="sponsored nofollow noopener"
                    >
                      Consulter le prix sur Amazon
                    </a>
                  ) : (
                    <span className="btn btn-disabled btn-block">
                      Précommandes : printemps 2027
                    </span>
                  )}
                </article>
              ))}
            </div>
            <div className="method-box" style={{ marginTop: 28 }}>
              <h3>Pourquoi acheter votre iPhone sur Amazon ?</h3>
              <ul className="usp-list">
                <li>Livraison Prime rapide (souvent 2 jours ouvrés, express en option)</li>
                <li>Retours gratuits sous 30 jours</li>
                <li>Paiement en plusieurs fois 0 % possible</li>
                <li>La boutique officielle Apple est présente sur Amazon</li>
                <li>Les modèles sortis passent souvent sous le tarif conseillé</li>
                <li>Paiement sécurisé : Apple Pay ou carte bancaire</li>
              </ul>
            </div>
            <div
              className="method-box"
              style={{
                marginTop: 16,
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 4px" }}>Complétez votre setup Apple</h3>
                <p style={{ margin: 0, color: "var(--text-2)", fontSize: 14.5 }}>
                  Apple Watch, AirPods, iPad et anciens iPhone : la sélection boutique,
                  un lien vers la fiche Amazon de chaque référence.
                </p>
              </div>
              <a className="btn btn-ghost btn-sm" href="/boutique">
                Voir la boutique Apple →
              </a>
            </div>
          </div>
        </section>

        {/* ---------- 6. IPHONE 18 RUMEURS ---------- */}
        <section className="section section-alt" id="iphone-18">
          <div className="container">
            <p className="kicker">6 · iPhone 18 : ce que nous savons (août 2026)</p>
            <h2 className="section-title">
              Le lancement en deux vagues qui bouscule les habitudes
            </h2>
            <p className="section-sub">
              Apple n'a rien officialisé, mais les fuites concordent (Bloomberg/Mark Gurman,
              Ming-Chi Kuo, Nikkei) : la génération 18 sera lancée en deux temps — d'abord le haut
              de gamme, ensuite le grand public.
            </p>
            <div className="timeline">
              {TIMELINE.map((t) => (
                <div key={t.title} className={`tl-item ${t.conf === "moyen" ? "conf-mid" : ""}`}>
                  <span className="tl-dot" aria-hidden="true"></span>
                  <div className="tl-date">{t.date}</div>
                  <h4>{t.title}</h4>
                  <p>{t.text}</p>
                </div>
              ))}
            </div>
            <div className="note-box" style={{ marginTop: 30 }}>
              <strong>⚠️ Niveau de confiance des rumeurs :</strong> le calendrier en deux temps est
              le point le plus solide — confirmé par plusieurs sources indépendantes depuis 2025
              et recentré par Nikkei. En revanche, les caractéristiques détaillées de l'iPhone 18
              standard (colonne 3 de ce comparatif) ne sont pas officielles : chaque valeur est
              marquée « rumeur ». Cette page sera mise à jour dès la keynote d'Apple.
            </div>
          </div>
        </section>

        {/* ---------- 7. PROFILS ---------- */}
        <section className="section" id="profils">
          <div className="container">
            <p className="kicker">7 · Quel iPhone choisir ?</p>
            <h2 className="section-title">Selon votre profil, la réponse change</h2>
            <p className="section-sub">
              Il n'y a pas un meilleur iPhone : il y a l'iPhone qui correspond à votre usage
              et à votre budget.
            </p>
            <div className="grid-5">
              {PROFILES.map((pr) => (
                <article key={pr.title} className="card profile-card">
                  <h4>{pr.title}</h4>
                  <p>{pr.text}</p>
                  <span className={`badge badge-${pr.tone}`}>{pr.pick}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 8. FAQ ---------- */}
        <section className="section section-alt" id="faq">
          <div className="container" style={{ maxWidth: 880 }}>
            <p className="kicker">8 · FAQ</p>
            <h2 className="section-title">Questions fréquentes</h2>
            <p className="section-sub">
              Tout ce qu'on nous demande sur le comparatif iPhone 16 / 17 / 18.
            </p>
            {FAQS.map((f, i) => (
              <FaqItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
            ))}
          </div>
        </section>

        {/* ---------- MÉTHODE ---------- */}
        <section className="section" id="methode">
          <div className="container">
            <div className="method-box">
              <h3>Comment nous avons construit ce comparatif</h3>
              <p>
                <strong>iPhone 16 et iPhone 17 :</strong> chaque caractéristique provient des
                fiches techniques officielles d'Apple, recoupées avec les tests et mesures de la
                presse spécialisée (Les Numériques, Frandroid, Phototrend, etc.). Les prix sont
                relevés à la main sur Amazon.fr pour en tirer un écart au prix de lancement, daté ;
                le montant lui-même n'est pas recopié ici — hors API Amazon, nous n'aurions pas le
                droit de l'afficher, et il serait faux dans la semaine.
              </p>
              <p>
                <strong>iPhone 18 :</strong> produit non officiel. Nous nous appuyons sur les
                informations les plus concordantes de la chaîne d'approvisionnement (Mark Gurman /
                Bloomberg, Ming-Chi Kuo / TF International, Nikkei Asia, MacRumors). Aucune
                caractéristique n'est confirmée par Apple : toute valeur non officielle est
                explicitement marquée « rumeur » ou « attendu ».
              </p>
              <p>
                <strong>Fréquence de mise à jour :</strong> les relevés sont refaits avant chaque
                publication, et la date du dernier est rappelée sur chaque page — une page dont le
                relevé dépasse {PRIX_VETUSTE_MAX_JOURS} jours s'affiche elle-même en alerte. La
                section iPhone 18 sera actualisée dès la keynote d'Apple (attendue début
                septembre 2026).
              </p>
            </div>
          </div>
        </section>

        {/* ---------- CTA FINAL ---------- */}
        <section className="cta-final">
          <div className="container">
            <h2>Vous savez lequel choisir ?</h2>
            <p>
              Vérifiez le prix du jour avant de commander : les iPhone bougent vite sur Amazon,
              surtout avant les grands événements de vente.
            </p>
            <div className="hero-ctas" style={{ justifyContent: "center" }}>
              <a
                className="btn btn-amber"
                href={productLink(PRODUCTS[1])}
                target="_blank"
                rel="sponsored nofollow noopener"
              >
                Voir le prix de l'iPhone 17
              </a>
              <a
                className="btn btn-ghost"
                href={productLink(PRODUCTS[0])}
                target="_blank"
                rel="sponsored nofollow noopener"
              >
                Voir le prix de l'iPhone 16
              </a>
            </div>
          </div>
        </section>
      </div>

      <BuyBar />
    </>
  );
}
