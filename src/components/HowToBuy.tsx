import type { ReactNode } from "react";
import { ExternalLink } from "./ExternalLink.tsx";

const STEPS: Array<{ title: string; body: ReactNode }> = [
  {
    title: "Create a Wallet",
    body: (
      <p>
        Download MetaMask or your wallet of choice from the App Store or Google Play Store for free.
        Desktop users, download the Google Chrome extension by going to{" "}
        <ExternalLink href="https://metamask.io">metamask.io</ExternalLink>.
      </p>
    ),
  },
  {
    title: "Get Some ETH",
    body: (
      <p>
        Have ETH in your wallet to switch to $EFBOSS. If you don’t have any ETH, you can buy directly
        on MetaMask, transfer from another wallet, or buy on another exchange and send it to your
        wallet.
      </p>
    ),
  },
  {
    title: "Go to Uniswap",
    body: (
      <p>
        Connect to Uniswap. Go to <ExternalLink href="https://app.uniswap.org">app.uniswap.org</ExternalLink>{" "}
        in Google Chrome or on the browser inside your MetaMask app. Connect your wallet. Paste the
        $EFBOSS token address into Uniswap, select $EFBOSS, and confirm. When MetaMask prompts you for
        a wallet signature, review the swap and sign only if it matches.
      </p>
    ),
  },
  {
    title: "Switch ETH for $EFBOSS",
    body: (
      <p>
        Switch ETH for $EFBOSS. We have zero taxes, so you don’t need to worry about buying with a
        specific slippage, although you may need to use slippage during times of market volatility.
      </p>
    ),
  },
];

export function HowToBuy() {
  return (
    <ol className="steps">
      {STEPS.map((step, index) => (
        <li key={step.title} className="step">
          <div className="step-icon" aria-hidden="true">
            <StepIcon index={index} />
          </div>
          <p className="step-num">{String(index + 1).padStart(2, "0")}</p>
          <h3>{step.title}</h3>
          {step.body}
        </li>
      ))}
    </ol>
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
