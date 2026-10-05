import type { ReactNode } from "react";
import { site } from "../config/site.ts";
import { isHttpsUrl } from "../config/selectors.ts";
import { BrandImage } from "./BrandImage.tsx";
import { ExternalLink } from "./ExternalLink.tsx";

const PAGE_LINKS = [
  { href: "#story", label: "Story" },
  { href: "#boss-test", label: "Boss Test" },
  { href: "#token-facts", label: "Tokenomics" },
  { href: "#how-to-buy", label: "How to Buy" },
];

export function Footer() {
  const xLink = isHttpsUrl(site.social.x) ? site.social.x : null;
  const telegram = isHttpsUrl(site.social.telegram) ? site.social.telegram : null;

  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <a className="brand" href="#top">
            <BrandImage image={site.assets.logoPlain} alt="" className="brand-mark" />
            <span className="brand-text">
              <span className="brand-name">{site.name}</span>
              <span className="brand-ticker">{site.ticker}</span>
            </span>
          </a>
          <p className="footer-tag">{site.tagline}</p>
        </div>
        <div>
          <h2>On this page</h2>
          <ul className="footer-links">
            {PAGE_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Official links</h2>
          <div className="social-icons">
            <SocialIcon href={xLink} label="X">
              <XIcon />
            </SocialIcon>
            <SocialIcon href={telegram} label="Telegram">
              <TelegramIcon />
            </SocialIcon>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string | null;
  label: string;
  children: ReactNode;
}) {
  if (!href) {
    return (
      <span className="social-icon" role="img" aria-label={label}>
        {children}
      </span>
    );
  }
  return (
    <ExternalLink href={href} className="social-icon">
      {children}
      <span className="sr-only">{label}</span>
    </ExternalLink>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.5 3.4 2.7 10.7c-1.3.5-1.3 1.2-.2 1.5l4.8 1.5 1.9 5.8c.2.7.1 1 .9.9l2.7-2.6 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.9-1.4-1.5zM9.2 14.2l9.4-5.9c.5-.3.9 0 .5.4l-7.7 7-.3 3.2-1.9-4.7z"
      />
    </svg>
  );
}
