import { useState } from "react";
import { site } from "../config/site.ts";
import { explorerLink, isContractAddress, networkLabel } from "../config/selectors.ts";
import { copyText } from "../lib/copyText.ts";
import { ExternalLink } from "./ExternalLink.tsx";

export function ContractPanel() {
  const address = isContractAddress(site.contractAddress) ? site.contractAddress : null;
  const explorer = explorerLink(site);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  async function onCopy() {
    if (!address) return;
    const ok = await copyText(address);
    setCopyState(ok ? "copied" : "error");
    window.setTimeout(() => setCopyState("idle"), 2400);
  }

  return (
    <div className="contract">
      <div>
        <p className="contract-label">Network</p>
        <p className="contract-value">
          {networkLabel(site)}
          <span className="contract-chain">Chain ID {site.network.chainId}</span>
        </p>
      </div>
      <div>
        <div className="contract-row">
          <p className="contract-label">Contract</p>
          <button type="button" className="btn btn-secondary btn-small" onClick={onCopy} disabled={!address}>
            Copy address
          </button>
        </div>
        {address ? (
          <p className="address">{address}</p>
        ) : (
          <p className="contract-missing">Contract not announced</p>
        )}
        <p className="copy-feedback" aria-hidden="true">
          {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed — select the address instead" : ""}
        </p>
        <p className="sr-only" role="status">
          {copyState === "copied" ? "Contract address copied." : ""}
          {copyState === "error"
            ? "Couldn't copy automatically. Select the address and copy it manually."
            : ""}
        </p>
        {explorer ? (
          <p className="contract-explorer">
            <ExternalLink href={explorer.href}>View on {explorer.label}</ExternalLink>
          </p>
        ) : null}
      </div>
    </div>
  );
}
