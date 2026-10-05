import type { AllocationSlice, EvidenceLink, SiteConfig } from "./site.ts";

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

export function isHttpsUrl(value: string | null | undefined): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isContractAddress(value: string | null | undefined): value is string {
  return typeof value === "string" && ADDRESS_RE.test(value);
}

export function canPurchase(config: SiteConfig): boolean {
  return (
    config.launchStatus === "live" &&
    isHttpsUrl(config.purchaseUrl) &&
    isContractAddress(config.contractAddress)
  );
}

export function primaryCommunityUrl(config: SiteConfig): string | null {
  if (isHttpsUrl(config.social.telegram)) return config.social.telegram;
  if (isHttpsUrl(config.social.x)) return config.social.x;
  return null;
}

export function networkLabel(config: SiteConfig): string {
  if (config.network.chainId === 1) return "Ethereum mainnet";
  return `${config.network.name} · Chain ID ${config.network.chainId}`;
}

export function explorerHref(config: SiteConfig): string | null {
  if (isHttpsUrl(config.explorerUrl)) return config.explorerUrl;
  if (config.network.chainId === 1 && isContractAddress(config.contractAddress)) {
    return `https://etherscan.io/address/${config.contractAddress}`;
  }
  return null;
}

export function explorerLink(config: SiteConfig): { label: string; href: string } | null {
  const href = explorerHref(config);
  if (!href) return null;
  let label = "Block explorer";
  try {
    const host = new URL(href).hostname;
    if (host === "etherscan.io" || host.endsWith(".etherscan.io")) label = "Etherscan";
  } catch {
    return { label, href };
  }
  return { label, href };
}

export interface ChannelLink {
  label: string;
  href: string;
}

export function communityChannels(config: SiteConfig): ChannelLink[] {
  const channels: ChannelLink[] = [];
  if (isHttpsUrl(config.social.telegram)) {
    channels.push({ label: "Telegram", href: config.social.telegram });
  }
  if (isHttpsUrl(config.social.x)) {
    channels.push({ label: "X", href: config.social.x });
  }
  if (isHttpsUrl(config.social.dextools)) {
    channels.push({ label: "DEXTools", href: config.social.dextools });
  }
  if (isHttpsUrl(config.social.dexscreener)) {
    channels.push({ label: "DexScreener", href: config.social.dexscreener });
  }
  const explorer = explorerLink(config);
  if (explorer) channels.push(explorer);
  return channels;
}

export function tradingMessage(config: SiteConfig): string {
  if (canPurchase(config)) {
    return "Trading is live. Use the published link, then match the token contract to the address on this page before you swap.";
  }
  if (config.launchStatus === "live") {
    return "Trading is marked live, but a verified purchase link and contract address are not both published yet. Buying stays disabled.";
  }
  return "Trading is not live. Purchase actions stay disabled until a contract and verified trading link are published.";
}

export function tradingFaqAnswer(config: SiteConfig): string {
  if (canPurchase(config)) {
    return "Yes. Trading is configured as live. Use the buy link on this page and check that the contract matches the published address.";
  }
  if (config.launchStatus === "live") {
    return "The launch status is set to live, but a verified purchase link and contract are not both published, so buying stays disabled.";
  }
  return "No. Trading has not been announced as live.";
}

export function taxSummary(config: SiteConfig): string {
  const buy = config.buyTax?.trim() || null;
  const sell = config.sellTax?.trim() || null;
  const liquidity = config.liquidityStatus?.trim() || null;
  if (!buy && !sell && !liquidity) {
    return "Buy tax, sell tax, and liquidity arrangements have not been provided.";
  }
  return [
    `Buy tax: ${buy ?? "Not provided"}.`,
    `Sell tax: ${sell ?? "Not provided"}.`,
    `Liquidity: ${liquidity ?? "Not announced"}.`,
  ].join(" ");
}

export type AllocationState =
  | { status: "missing" }
  | { status: "incomplete" }
  | { status: "complete"; slices: AllocationSlice[] };

export function allocationState(config: SiteConfig): AllocationState {
  const slices = config.allocation;
  if (!slices || slices.length === 0) return { status: "missing" };
  const valid = slices.every(
    (slice) =>
      typeof slice.percent === "number" &&
      Number.isFinite(slice.percent) &&
      slice.percent > 0 &&
      slice.label.trim().length > 0,
  );
  if (!valid) return { status: "incomplete" };
  const total = slices.reduce((sum, slice) => sum + slice.percent, 0);
  if (Math.abs(total - 100) > 0.05) return { status: "incomplete" };
  return { status: "complete", slices };
}

export function sourceLabel(config: SiteConfig): string {
  if (config.sourceVerified === true) return "Verified";
  if (config.sourceVerified === false) return "Not verified";
  return "Not announced";
}

export function adminSummary(config: SiteConfig): string {
  const parts = [config.ownershipStatus?.trim(), config.adminControls?.trim()].filter(
    (part): part is string => Boolean(part),
  );
  if (parts.length === 0) return "Not announced";
  return parts.join(" ");
}

export function validEvidence(links: EvidenceLink[] | null): EvidenceLink[] {
  if (!links) return [];
  return links.filter((link) => link.label.trim().length > 0 && isHttpsUrl(link.href));
}

export function formatPercent(value: number): string {
  return Number.isInteger(value) ? `${value}%` : `${value.toFixed(1)}%`;
}

export function pending(value: string | null | undefined, emptyLabel: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : emptyLabel;
}

/** Shown beside Copy address. Replace `contractAddress` and this string updates. */
export function contractAddressText(config: SiteConfig): string {
  const value = config.contractAddress?.trim();
  return value ? value : "Coming Soon..";
}
