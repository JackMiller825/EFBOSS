import { site } from "../config/site.ts";
import { communityChannels } from "../config/selectors.ts";
import { BrandImage } from "./BrandImage.tsx";
import { ExternalLink } from "./ExternalLink.tsx";

const DOWNLOADS = [
  {
    title: "Named logo",
    meta: "Square emblem with the token name",
    file: "elons-final-boss-logo.png",
    image: site.assets.logoWordmark,
    alt: "Circular logo reading Elon’s Final Boss and $EFBOSS around the grey kitten mascot.",
  },
  {
    title: "Text-free emblem",
    meta: "Square emblem for icons and avatars",
    file: "elons-final-boss-emblem.png",
    image: site.assets.logoPlain,
    alt: "Circular emblem of the grey kitten mascot without wordmark text.",
  },
  {
    title: "Wide banner",
    meta: "3:1 night-road illustration",
    file: "elons-final-boss-banner.png",
    image: site.assets.bannerWide,
    alt: "Wide banner preview of the night-road illustration and kitten mascot.",
  },
  {
    title: "Telegram banner",
    meta: "1100 × 520 community image",
    file: "elons-final-boss-telegram.png",
    image: site.assets.bannerTelegram,
    alt: "1100 by 520 banner preview for a Telegram post, showing the kitten on a night road.",
  },
];

export function Community() {
  const channels = communityChannels(site);

  return (
    <>
      {channels.length > 0 ? (
        <ul className="channels">
          {channels.map((channel) => (
            <li key={channel.href}>
              <ExternalLink className="channel" href={channel.href}>
                <span>{channel.label}</span>
                <span aria-hidden="true">↗</span>
              </ExternalLink>
            </li>
          ))}
        </ul>
      ) : (
        <p className="callout">
          Official community channels have not been announced yet. Telegram, X, and explorer links will appear here when they are added to the site configuration.
        </p>
      )}
      <h3 className="subhead">Brand files</h3>
      <p className="section-intro">Download the approved artwork. The 1100 × 520 banner is sized for a Telegram preview.</p>
      <ul className="downloads">
        {DOWNLOADS.map((item) => (
          <li key={item.file} className="download-card">
            <BrandImage image={item.image} alt={item.alt} />
            <div>
              <h4>{item.title}</h4>
              <p>{item.meta}</p>
              <a className="btn btn-secondary btn-small" href={item.image.png} download={item.file}>
                Download
              </a>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
