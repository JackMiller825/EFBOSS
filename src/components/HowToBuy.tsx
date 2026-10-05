import { site } from "../config/site.ts";
import { canPurchase, isContractAddress, networkLabel, tradingMessage } from "../config/selectors.ts";
import { ExternalLink } from "./ExternalLink.tsx";

const WALLETS = [
  { label: "MetaMask", href: "https://metamask.io/download/" },
  { label: "Rainbow", href: "https://rainbow.me/" },
  { label: "Coinbase Wallet", href: "https://www.coinbase.com/wallet" },
];

export function HowToBuy() {
  const live = canPurchase(site);
  const buyHref = live ? site.purchaseUrl : null;
  const address = isContractAddress(site.contractAddress) ? site.contractAddress : null;
  const network = site.network.chainId === 1 ? "Ethereum mainnet" : networkLabel(site);

  const steps = [
    {
      title: "Prepare a wallet",
      body: "Install an Ethereum-compatible wallet from its official website. This site will never ask for a seed phrase or private key.",
      extra: (
        <ul className="wallet-links">
          {WALLETS.map((wallet) => (
            <li key={wallet.href}>
              <ExternalLink href={wallet.href}>{wallet.label}</ExternalLink>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Fund it with ETH",
      body: `Add ETH on ${network}. Keep enough ETH for the swap and for network fees.`,
      extra: null,
    },
    {
      title: "Open the verified trading link",
      body: live
        ? "Use the trading link published here. Check that the wallet network and the token contract match this website before you continue."
        : "Trading is not live yet. This step stays disabled until a verified purchase link and contract address are published.",
      extra: (
        <div className="step-action">
          {address ? <p className="address">{address}</p> : <p>Contract not announced.</p>}
          {buyHref ? (
            <a className="btn btn-primary" href={buyHref} target="_blank" rel="noopener noreferrer">
              Open trading link
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <button type="button" className="btn btn-disabled" disabled>
              Trading link not announced
            </button>
          )}
        </div>
      ),
    },
    {
      title: "Review the swap",
      body: "Before you confirm in your wallet, read the amount, price impact, minimum received, network fee, and any token taxes. If something looks wrong, reject the transaction.",
      extra: null,
    },
  ];

  return (
    <>
      <p className="callout" role="status">
        {tradingMessage(site)}
      </p>
      <ol className="steps">
        {steps.map((step, index) => (
          <li key={step.title} className="step">
            <div className="step-icon" aria-hidden="true">
              <StepIcon index={index} />
            </div>
            <p className="step-num">{String(index + 1).padStart(2, "0")}</p>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
            {step.extra}
          </li>
        ))}
      </ol>
      <p className="fact-note">
        Do not sign a message or transaction you do not understand. Never type a seed phrase into a website.
      </p>
    </>
  );
}

function StepIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 48 48">
        <rect x="8" y="14" width="32" height="22" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M16 14v-2a8 8 0 0 1 16 0v2" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M24 16v16M19 21l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg viewBox="0 0 48 48">
        <path d="M20 16H14v18h18v-6" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M24 28l12-12M28 16h8v8" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48">
      <rect x="12" y="10" width="24" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M18 22l4 4 8-8" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
