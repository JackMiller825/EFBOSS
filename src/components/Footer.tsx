import { site, statements } from "../config/site.ts";
import { communityChannels, explorerLink } from "../config/selectors.ts";
import { BrandImage } from "./BrandImage.tsx";
import { ExternalLink } from "./ExternalLink.tsx";

const PAGE_LINKS = [
  { href: "#story", label: "Story" },
  { href: "#boss-test", label: "Boss Test" },
  { href: "#token-facts", label: "Token Facts" },
  { href: "#how-to-buy", label: "How to Buy" },
  { href: "#meme-studio", label: "Meme Studio" },
  { href: "#faq", label: "FAQ" },
];

export function Footer() {
  const channels = communityChannels(site);
  const explorer = explorerLink(site);

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
          {channels.length > 0 ? (
            <ul className="footer-links">
              {channels.map((channel) => (
                <li key={channel.href}>
                  <ExternalLink href={channel.href}>{channel.label}</ExternalLink>
                </li>
              ))}
            </ul>
          ) : (
            <p className="footer-empty">Social links have not been announced.</p>
          )}
          {explorer ? (
            <p className="footer-explorer">
              <ExternalLink href={explorer.href}>Contract on {explorer.label}</ExternalLink>
            </p>
          ) : null}
        </div>
      </div>
      <div className="wrap footer-notes">
        <p className="risk">{statements.risk}</p>
        <p className="affiliation">{statements.affiliationLong}</p>
      </div>
    </footer>
  );
}
