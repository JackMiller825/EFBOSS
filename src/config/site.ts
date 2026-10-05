/**
 * Project facts for Elon's Final Boss.
 *
 * Edit this file when a real detail is published. Leave unknown fields null.
 * Do not guess taxes, supply, liquidity, ownership, audits, or social links.
 *
 * Buying stays disabled unless all of the following are true:
 * - launchStatus is "live"
 * - contractAddress is a 40-character 0x hex address
 * - purchaseUrl is an https link to the verified trading page
 */

export type LaunchStatus = "prelaunch" | "live";

export interface EvidenceLink {
  label: string;
  href: string;
}

export interface AllocationSlice {
  label: string;
  percent: number;
}

export interface AuditInfo {
  status: string;
  reportUrl: string | null;
}

export interface NewsSource {
  /** https URL of a real, verified article. */
  url: string;
  /** Publication date as you want it shown, for example "March 4, 2026". */
  date: string;
}

export interface ImageAsset {
  png: string;
  webp: string;
  width: number;
  height: number;
}

export interface SiteConfig {
  name: string;
  ticker: string;
  tagline: string;
  network: {
    name: string;
    chainId: number;
  };
  launchStatus: LaunchStatus;
  contractAddress: string | null;
  purchaseUrl: string | null;
  /** Optional explorer override. Ethereum mainnet uses Etherscan when this is null. */
  explorerUrl: string | null;
  social: {
    telegram: string | null;
    x: string | null;
    dextools: string | null;
    dexscreener: string | null;
  };
  totalSupply: string | null;
  buyTax: string | null;
  sellTax: string | null;
  /** Only charted when every slice is present and the percentages total 100. */
  allocation: AllocationSlice[] | null;
  liquidityStatus: string | null;
  liquidityEvidence: EvidenceLink[] | null;
  ownershipStatus: string | null;
  adminControls: string | null;
  adminEvidence: EvidenceLink[] | null;
  /** null = not announced, true = verified, false = explicitly not verified. */
  sourceVerified: boolean | null;
  sourceUrl: string | null;
  /** Leave null unless an audit report actually exists. The row is omitted when null. */
  audit: AuditInfo | null;
  /** Leave null unless a real news URL has been checked. */
  news: NewsSource | null;
  /** Full origin, such as "https://example.com". Omit the canonical tag while this is null. */
  canonicalUrl: string | null;
  assets: {
    logoPlain: ImageAsset;
    logoWordmark: ImageAsset;
    bannerWide: ImageAsset;
    bannerWideSmall: ImageAsset;
    bannerTelegram: ImageAsset;
    socialPreview: string;
    favicon: string;
  };
}

export const statements = {
  affiliationShort:
    "Independent parody. Not affiliated with or endorsed by Elon Musk, Tesla, or SpaceX.",
  affiliationLong:
    "Elon’s Final Boss is an independent parody project. It is not affiliated with or endorsed by Elon Musk, Tesla, or SpaceX.",
  risk: "$EFBOSS is a speculative meme token. Its price can be highly volatile, and you may lose your entire purchase amount.",
} as const;

function asset(file: string): string {
  return `${import.meta.env.BASE_URL}${file}`;
}

export const site: SiteConfig = {
  name: "Elon's Final Boss",
  ticker: "$EFBOSS",
  tagline: "Small cat. Final boss.",
  network: {
    name: "Ethereum",
    chainId: 1,
  },
  launchStatus: "prelaunch",
  contractAddress: null,
  purchaseUrl: null,
  explorerUrl: null,
  social: {
    telegram: null,
    x: null,
    dextools: null,
    dexscreener: null,
  },
  totalSupply: null,
  buyTax: null,
  sellTax: null,
  allocation: null,
  liquidityStatus: null,
  liquidityEvidence: null,
  ownershipStatus: null,
  adminControls: null,
  adminEvidence: null,
  sourceVerified: null,
  sourceUrl: null,
  audit: null,
  news: null,
  /** Public GitHub Pages origin for this repository. */
  canonicalUrl: "https://jackmiller825.github.io/EFBOSS",
  assets: {
    logoPlain: {
      png: asset("brand/logo-plain.png"),
      webp: asset("brand/logo-plain.webp"),
      width: 960,
      height: 960,
    },
    logoWordmark: {
      png: asset("brand/logo-wordmark.png"),
      webp: asset("brand/logo-wordmark.webp"),
      width: 960,
      height: 960,
    },
    bannerWide: {
      png: asset("brand/banner-wide.png"),
      webp: asset("brand/banner-wide.webp"),
      width: 1800,
      height: 600,
    },
    bannerWideSmall: {
      png: asset("brand/banner-wide-sm.png"),
      webp: asset("brand/banner-wide-sm.webp"),
      width: 800,
      height: 267,
    },
    bannerTelegram: {
      png: asset("brand/banner-telegram.png"),
      webp: asset("brand/banner-telegram.webp"),
      width: 1100,
      height: 520,
    },
    socialPreview: asset("brand/og.png"),
    favicon: asset("brand/favicon-32.png"),
  },
};
