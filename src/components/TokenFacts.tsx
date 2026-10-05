import { site } from "../config/site.ts";
import { contractAddressText } from "../config/selectors.ts";
import { CopyAddressButton } from "./CopyAddressButton.tsx";

export function TokenFacts() {
  const rows = [
    { label: "Total supply", value: site.totalSupply ?? "Coming Soon.." },
    { label: "Buy tax", value: site.buyTax ?? "Coming Soon.." },
    { label: "Sell tax", value: site.sellTax ?? "Coming Soon.." },
    { label: "Ownership", value: site.ownershipStatus ?? "Coming Soon.." },
  ];

  return (
    <table className="facts">
      <caption className="sr-only">Tokenomics for {site.name}</caption>
      <tbody>
        <tr>
          <th scope="row">Contract address</th>
          <td>
            <div className="contract-copy">
              <span className="contract-copy-value">{contractAddressText(site)}</span>
              <CopyAddressButton />
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
