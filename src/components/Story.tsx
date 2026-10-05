import { site } from "../config/site.ts";
import { isHttpsUrl } from "../config/selectors.ts";
import { BrandImage } from "./BrandImage.tsx";
import { ExternalLink } from "./ExternalLink.tsx";

const PANELS = [
  {
    index: "01",
    title: "Smarter every year",
    body: "Humans built brighter cities, faster machines, and scanners that could name anything on the road.",
    art: "city",
  },
  {
    index: "02",
    title: "One grey interruption",
    body: "A tiny kitten in a reflective vest walked into the beam and sat down, entirely unbothered.",
    art: "kitten",
  },
  {
    index: "03",
    title: "Self-appointed boss",
    body: "The scanner asked for a category. The kitten kept the vest, showed one fang, and took the title.",
    art: "boss",
  },
] as const;

export function Story() {
  const news = site.news && isHttpsUrl(site.news.url) ? site.news : null;
  const wide = site.assets.bannerWide;
  const small = site.assets.bannerWideSmall;

  return (
    <section id="story" className="section section-charcoal" aria-labelledby="story-title">
      <div className="wrap">
        <p className="eyebrow">Origin</p>
        <h2 id="story-title">The tiniest plot twist in tech.</h2>
        <p className="section-intro">
          A fictional brand story. The kitten is a character, not a real pet, and not a claim about any person.
        </p>
        <div className="story-grid">
          {PANELS.map((panel) => (
            <article key={panel.index} className="story-card">
              <p className="story-index">{panel.index}</p>
              <div className="story-art" aria-hidden={panel.art !== "kitten"}>
                {panel.art === "city" ? <CityArt /> : null}
                {panel.art === "kitten" ? (
                  <BrandImage
                    image={site.assets.logoPlain}
                    alt="The grey kitten mascot in a neon yellow safety vest."
                    className="story-kitten"
                  />
                ) : null}
                {panel.art === "boss" ? <BossArt /> : null}
              </div>
              <h3>{panel.title}</h3>
              <p>{panel.body}</p>
            </article>
          ))}
        </div>
        <p className="closer">No spaceship. No supercomputer. Just a cat with exceptional confidence.</p>
        {news ? (
          <p className="news-link">
            <ExternalLink href={news.url}>Read the inspiration</ExternalLink>
            <span> · {news.date}</span>
          </p>
        ) : null}
        <figure className="art-strip">
          <picture>
            <source
              type="image/webp"
              srcSet={`${small.webp} 800w, ${wide.webp} 1800w`}
              sizes="(min-width: 1200px) 1120px, 100vw"
            />
            <img
              src={wide.png}
              alt="Night-road illustration with cyan city lights, the title Elon’s Final Boss, and the grey kitten mascot in a safety vest."
              width={wide.width}
              height={wide.height}
              loading="lazy"
              decoding="async"
            />
          </picture>
          <figcaption>Night-road artwork. The lettering is part of the illustration.</figcaption>
        </figure>
      </div>
    </section>
  );
}

function CityArt() {
  return (
    <svg viewBox="0 0 160 96" className="story-svg" aria-hidden="true">
      <rect x="8" y="38" width="22" height="50" fill="#12283A" />
      <rect x="36" y="18" width="28" height="70" fill="#0E2233" />
      <rect x="70" y="30" width="18" height="58" fill="#163044" />
      <rect x="94" y="10" width="26" height="78" fill="#0E2233" />
      <rect x="126" y="34" width="22" height="54" fill="#12283A" />
      <g fill="#00DCEF">
        <rect x="14" y="46" width="4" height="4" />
        <rect x="22" y="58" width="4" height="4" />
        <rect x="42" y="28" width="4" height="4" />
        <rect x="52" y="44" width="4" height="4" />
        <rect x="100" y="22" width="4" height="4" />
        <rect x="110" y="40" width="4" height="4" />
      </g>
      <g fill="#DFFF00">
        <rect x="42" y="58" width="4" height="4" />
        <rect x="76" y="42" width="4" height="4" />
        <rect x="132" y="48" width="4" height="4" />
      </g>
      <path d="M18 14c28 16 96 16 124 0" fill="none" stroke="#00DCEF" strokeWidth="2" />
    </svg>
  );
}

function BossArt() {
  return (
    <svg viewBox="0 0 160 96" className="story-svg" aria-hidden="true">
      <circle cx="80" cy="48" r="30" fill="none" stroke="#00DCEF" strokeWidth="2" />
      <circle cx="80" cy="48" r="40" fill="none" stroke="#00DCEF" strokeWidth="1.5" strokeDasharray="4 6" />
      <path d="M80 22v8M80 66v8M54 48h8M98 48h8" stroke="#DFFF00" strokeWidth="2" />
      <text x="80" y="53" textAnchor="middle" fill="#F5F8FC" fontFamily="Barlow Condensed, sans-serif" fontSize="16" fontWeight="700">
        BOSS
      </text>
    </svg>
  );
}
