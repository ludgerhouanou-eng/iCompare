import "./globals.css";
import { SITE } from "../lib/site.js";

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "iCompare — Comparateur iPhone : 16, 17, 18 comparés",
    template: "%s | iCompare",
  },
  description:
    "Fiches techniques comparées, prix Amazon vérifiés et verdicts clairs : trouvez le bon iPhone (16, 17, 18…) en 2026, sans noyade technique.",
  keywords: [
    "comparatif iphone",
    "iphone 16",
    "iphone 17",
    "iphone 18",
    "fiche technique iphone",
    "quel iphone acheter 2026",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE.url,
    siteName: SITE.name,
    title: "iCompare — Comparateur iPhone 2026",
    description: "iPhone 16, 17 ou 18 ? Fiches techniques, prix Amazon et verdicts clairs.",
    images: [
      { url: "/og-comparatif.jpg", width: 1200, height: 675, alt: "Comparatif iPhone 16, 17 et 18" },
    ],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#050507",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <a className="brand" href="/" aria-label="Accueil iCompare">
              <span className="brand-mark" aria-hidden="true"></span>
              iCompare<span className="brand-year">.fr</span>
            </a>
            <nav className="nav" aria-label="Navigation principale">
              <a href="/comparatif">Comparatif 16 / 17 / 18</a>
              <a href="/boutique">Boutique Apple</a>
              <a href="/comparatif#prix">Prix &amp; promos</a>
              <a href="/comparatif#iphone-18">iPhone 18 : rumeurs</a>
              <a href="/comparatif#faq">FAQ</a>
            </nav>
          </div>
        </header>

        <main id="contenu">{children}</main>

        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div>
                <a className="brand" href="/">
                  <span className="brand-mark" aria-hidden="true"></span>
                  iCompare<span className="brand-year">.fr</span>
                </a>
                <p>
                  Le comparateur iPhone qui va droit au but : fiches techniques comparées,
                  prix Amazon vérifiés et verdicts sans blabla. Mis à jour régulièrement.
                </p>
              </div>
              <div>
                <h5>Navigation</h5>
                <ul>
                  <li><a href="/">Accueil</a></li>
                  <li><a href="/comparatif">Comparatif iPhone 16 / 17 / 18</a></li>
                  <li><a href="/boutique">Boutique Apple (Watch, iPad, AirPods…)</a></li>
                  <li><a href="/comparatif#prix">Prix &amp; où acheter</a></li>
                  <li><a href="/comparatif#faq">Questions fréquentes</a></li>
                </ul>
              </div>
              <div>
                <h5>Mentions &amp; transparence</h5>
                <p>
                  En tant que Partenaire Amazon, nous réalisons un bénéfice sur les achats
                  remplissant les conditions requises. Les prix affichés sont indicatifs et
                  sujets à modification.
                </p>
                <p>
                  Apple, iPhone, iOS, Apple Intelligence, MagSafe sont des marques déposées
                  d'Apple Inc. Ce site est indépendant et n'est pas affilié à Apple.
                  Amazon et les logos Amazon sont des marques d'Amazon.com, Inc. et de ses
                  affiliés. Les caractéristiques de l'iPhone 18 sont des rumeurs non officielles.
                </p>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© 2026 iCompare — Tous droits réservés.</span>
              <span>Site indépendant · Non affilié à Apple Inc. ou Amazon</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
