import { useState } from "react";
import { site } from "../config/site.ts";
import { isContractAddress } from "../config/selectors.ts";
import { copyText } from "../lib/copyText.ts";

export function TokenFacts() {
  const address = isContractAddress(site.contractAddress) ? site.contractAddress : null;
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  async function onCopy() {
    if (!address) return;
    const ok = await copyText(address);
    setCopyState(ok ? "copied" : "error");
    window.setTimeout(() => setCopyState("idle"), 2400);
  }

  const rows: Array<{ label: string; value: string }> = [
    { label: "Total supply", value: site.totalSupply ?? "Coming Soon.." },
    { label: "Buy tax", value: site.buyTax ?? "Coming Soon.." },
    { label: "Sell tax", value: site.sellTax ?? "Coming Soon.." },
    { label: "Ownership", value: site.ownershipStatus ?? "Coming Soon.." },
  ];

  return (
    <table className="facts">
      <caption className="sr-only">Token details for {site.name}</caption>
      <tbody>
        <tr>
          <th scope="row">Contract address</th>
          <td>
            <div className="address-line">
              <span className={address ? "address" : undefined}>{address ?? "Coming Soon.."}</span>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCopy}
                disabled={!address}
              >
                Copy address
              </button>
              <p className="copy-feedback" aria-hidden="true">
                {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : ""}
              </p>
              <p className="sr-only" role="status">
                {copyState === "copied" ? "Contract address copied." : ""}
                {copyState === "error"
                  ? "Couldn't copy automatically. Select the address and copy it manually."
                  : ""}
              </p>
            </div>
          </td>
        </tr>
        {rows.map((row) => (
          <tr key={row.label}>
            <th scope="row">{row.label}</th>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
