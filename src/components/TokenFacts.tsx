import type { ReactNode } from "react";
import { site } from "../config/site.ts";
import {
  adminSummary,
  allocationState,
  explorerLink,
  formatPercent,
  isContractAddress,
  isHttpsUrl,
  networkLabel,
  pending,
  sourceLabel,
  validEvidence,
} from "../config/selectors.ts";
import { ExternalLink } from "./ExternalLink.tsx";

const SLICE_COLORS = ["#067E8C", "#122033", "#8EA000", "#4E6276", "#149AAB", "#24384C"];

export function TokenFacts() {
  const address = isContractAddress(site.contractAddress) ? site.contractAddress : null;
  const explorer = explorerLink(site);
  const allocation = allocationState(site);
  const liquidityEvidence = validEvidence(site.liquidityEvidence);
  const adminEvidence = validEvidence(site.adminEvidence);

  const rows: Array<{ label: string; value: ReactNode }> = [
    { label: "Token name", value: site.name },
    { label: "Ticker", value: site.ticker },
    { label: "Network", value: `${networkLabel(site)} · Chain ID ${site.network.chainId}` },
    {
      label: "Contract address",
      value: address ? (
        <>
          <span className="address">{address}</span>
          {explorer ? (
            <span className="fact-link">
              <ExternalLink href={explorer.href}>View on {explorer.label}</ExternalLink>
            </span>
          ) : null}
        </>
      ) : (
        "Not announced"
      ),
    },
    { label: "Total supply", value: pending(site.totalSupply, "Not provided") },
    { label: "Buy tax", value: pending(site.buyTax, "Not provided") },
    { label: "Sell tax", value: pending(site.sellTax, "Not provided") },
    {
      label: "Allocation",
      value:
        allocation.status === "complete" ? (
          <AllocationChart slices={allocation.slices} />
        ) : allocation.status === "incomplete" ? (
          "Allocation was supplied but does not total 100%, so it is not shown as a chart."
        ) : (
          "Not provided"
        ),
    },
    {
      label: "Liquidity status",
      value: (
        <>
          {pending(site.liquidityStatus, "Not announced")}
          <Evidence items={liquidityEvidence} />
        </>
      ),
    },
    {
      label: "Ownership and administrative controls",
      value: (
        <>
          {adminSummary(site)}
          <Evidence items={adminEvidence} />
        </>
      ),
    },
    {
      label: "Contract-source verification",
      value: (
        <>
          {sourceLabel(site)}
          {isHttpsUrl(site.sourceUrl) ? (
            <span className="fact-link">
              <ExternalLink href={site.sourceUrl}>Source link</ExternalLink>
            </span>
          ) : null}
        </>
      ),
    },
  ];

  if (site.audit) {
    rows.push({
      label: "Audit status",
      value: (
        <>
          {site.audit.status.trim() || "Not provided"}
          {isHttpsUrl(site.audit.reportUrl) ? (
            <span className="fact-link">
              <ExternalLink href={site.audit.reportUrl}>Audit report</ExternalLink>
            </span>
          ) : null}
        </>
      ),
    });
  }

  return (
    <>
      <table className="facts">
        <caption className="sr-only">Published token facts for {site.name}</caption>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="fact-note">
        Liquidity status and administrative control are separate facts. Neither one means the token is risk-free.
      </p>
    </>
  );
}

function Evidence({ items }: { items: Array<{ label: string; href: string }> }) {
  if (items.length === 0) return null;
  return (
    <ul className="evidence">
      {items.map((item) => (
        <li key={item.href}>
          <ExternalLink href={item.href}>{item.label}</ExternalLink>
        </li>
      ))}
    </ul>
  );
}

function AllocationChart({
  slices,
}: {
  slices: Array<{ label: string; percent: number }>;
}) {
  const stops = slices.reduce<string[]>((parts, slice, index) => {
    const start = slices.slice(0, index).reduce((sum, item) => sum + item.percent, 0);
    const color = SLICE_COLORS[index % SLICE_COLORS.length] ?? "#067E8C";
    return [...parts, `${color} ${start}% ${start + slice.percent}%`];
  }, []);

  return (
    <div className="allocation">
      <div
        className="allocation-chart"
        style={{ background: `conic-gradient(${stops.join(", ")})` }}
        aria-hidden="true"
      />
      <ul className="allocation-legend">
        {slices.map((slice, index) => (
          <li key={slice.label}>
            <span
              className="swatch"
              style={{ background: SLICE_COLORS[index % SLICE_COLORS.length] }}
              aria-hidden="true"
            />
            <span>
              {slice.label}: {formatPercent(slice.percent)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
