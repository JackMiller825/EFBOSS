import { useRef } from "react";
import { site } from "../config/site.ts";
import { canPurchase, contractAddressText, isHttpsUrl } from "../config/selectors.ts";
import { useOnScreen } from "../hooks/useMedia.ts";
import { BrandImage } from "./BrandImage.tsx";
import { CopyAddressButton } from "./CopyAddressButton.tsx";
import { ExternalLink } from "./ExternalLink.tsx";

export function Hero() {
  const frameRef = useRef<HTMLDivElement>(null);
  const visible = useOnScreen(frameRef, 0.2);
  const live = canPurchase(site);
  const buyHref = live ? site.purchaseUrl : null;
  const telegram = isHttpsUrl(site.social.telegram) ? site.social.telegram : null;
  const xLink = isHttpsUrl(site.social.x) ? site.social.x : null;

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="wrap hero">
        <div className="hero-copy">
          <p className="eyebrow">{site.name} · {site.ticker}</p>
          <h1 id="hero-title">
            Small cat.
            <br />
            Final boss.
          </h1>
          <div className="headline-mark" aria-hidden="true" />
          <p className="lede">
            Humanity built advanced AI. A grey kitten became the plot twist. Meet {site.ticker}, an
            independent Ethereum meme project with nine lives and absolutely no respect for the scanner.
          </p>
          <div className="actions">
            {buyHref ? (
              <a className="btn btn-primary" href={buyHref} target="_blank" rel="noopener noreferrer">
                Buy {site.ticker}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <button type="button" className="btn btn-disabled" disabled>
                Buy {site.ticker}
              </button>
            )}
            <a className={buyHref ? "btn btn-secondary" : "btn btn-primary"} href="#boss-test">
              Meet the Boss
            </a>
          </div>
          {telegram || xLink ? (
            <p className="quiet-links">
              {telegram ? <ExternalLink href={telegram}>Telegram</ExternalLink> : null}
              {xLink ? <ExternalLink href={xLink}>X</ExternalLink> : null}
            </p>
          ) : null}
          <p className="hero-contract">
            <span className="hero-contract-label">Contract Address:</span>
            <span className="hero-contract-pair">
              <span className="hero-contract-value">{contractAddressText(site)}</span>
              <CopyAddressButton />
            </span>
          </p>
        </div>
        <div className="hero-art">
          <div ref={frameRef} className={visible ? "hero-frame" : "hero-frame is-paused"}>
            <span className="orbit orbit-a" aria-hidden="true" />
            <span className="orbit orbit-b" aria-hidden="true" />
            <span className="scanline" aria-hidden="true" />
            <span className="bracket bracket-tl" aria-hidden="true" />
            <span className="bracket bracket-tr" aria-hidden="true" />
            <span className="bracket bracket-bl" aria-hidden="true" />
            <span className="bracket bracket-br" aria-hidden="true" />
            <BrandImage
              image={site.assets.logoPlain}
              priority
              alt="Grey kitten mascot with lime eyes, a small fang, and a neon yellow safety vest, framed by cyan scanner rings."
            />
          </div>
          <p className="hud-caption">Scanner online. The subject is unimpressed.</p>
        </div>
      </div>
    </section>
  );
}
