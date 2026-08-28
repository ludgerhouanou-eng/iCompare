"use client";

import { useEffect, useRef, useState } from "react";

const SLIDES = [
  {
    src: "/phones/gamme-16.png",
    alt: "La gamme iPhone 16 présentée en cinq coloris : noir, blanc, rose, vert et bleu",
    kicker: "La gamme 2026",
    title: "Cinq coloris pour l'iPhone 16 — le roi du rapport qualité-prix",
    priority: true,
  },
  {
    src: "/phones/comparatif.png",
    alt: "iPhone 16, iPhone 17 Pro et iPhone 18 présentés côte à côte",
    kicker: "Face à face",
    title: "iPhone 16, 17 et 18 : le comparatif complet, fiche par fiche",
  },
  {
    src: "/phones/iphone-18.png",
    alt: "Rendu de l'iPhone 18 en bleu, triple caméra",
    kicker: "À venir — rumeurs",
    title: "iPhone 18 : puce A20 gravée en 2 nm, printemps 2027",
  },
  {
    src: "/phones/iphone-17.png",
    alt: "La gamme iPhone 17 en trois coloris : violet, bleu et orange",
    kicker: "Le choix sans regret",
    title: "iPhone 17 : écran 120 Hz, double 48 MP, 30 h d'autonomie",
  },
  {
    src: "/phones/iphone-16.png",
    alt: "iPhone 16 bleu, face avant et face arrière",
    kicker: "Le bon plan",
    title: "iPhone 16 : l'essentiel de l'iPhone 17, avec le plus large écart relevé sous son prix Apple",
  },
];

const DELAY = 5200;

export default function HeroSlider() {
  const [idx, setIdx] = useState(0);
  const paused = useRef(false);
  const x0 = useRef(null);

  useEffect(() => {
    const t = setInterval(() => {
      if (!paused.current) setIdx((i) => (i + 1) % SLIDES.length);
    }, DELAY);
    return () => clearInterval(t);
  }, []);

  const go = (i) => setIdx((i + SLIDES.length) % SLIDES.length);

  return (
    <div
      className="hero-slider"
      id="heroSlider"
      aria-roledescription="carrousel"
      aria-label="Galerie des iPhones"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onTouchStart={(e) => (x0.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (x0.current === null) return;
        const dx = e.changedTouches[0].clientX - x0.current;
        if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
        x0.current = null;
      }}
    >
      <div
        className="slider-track"
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {SLIDES.map((s, i) => (
          <div key={s.src} className={`slide ${i === idx ? "is-active" : ""}`}>
            <img
              src={s.src}
              alt={s.alt}
              width={1319}
              height={742}
              fetchPriority={s.priority ? "high" : undefined}
              loading={s.priority ? "eager" : "lazy"}
            />
            <div className="slide-caption">
              <span className="slide-kicker">{s.kicker}</span>
              <span className="slide-title">{s.title}</span>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="slider-arrow prev"
        aria-label="Image précédente"
        onClick={() => go(idx - 1)}
      >
        ←
      </button>
      <button
        type="button"
        className="slider-arrow next"
        aria-label="Image suivante"
        onClick={() => go(idx + 1)}
      >
        →
      </button>
      <div className="slider-dots">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            className={`slider-dot ${i === idx ? "active" : ""}`}
            aria-label={`Aller à l'image ${i + 1} sur ${SLIDES.length}`}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </div>
  );
}
