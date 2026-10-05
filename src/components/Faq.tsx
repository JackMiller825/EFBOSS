import { useId, useState, type ReactNode } from "react";
import { site, statements } from "../config/site.ts";
import {
  explorerLink,
  isContractAddress,
  taxSummary,
  tradingFaqAnswer,
  validEvidence,
} from "../config/selectors.ts";
import { ExternalLink } from "./ExternalLink.tsx";

export function Faq() {
  const address = isContractAddress(site.contractAddress) ? site.contractAddress : null;
  const explorer = explorerLink(site);
  const evidence = [
    ...validEvidence(site.liquidityEvidence),
    ...validEvidence(site.adminEvidence),
  ];

  const items: Array<{ question: string; answer: ReactNode }> = [
    {
      question: `What is ${site.ticker}?`,
      answer: (
        <p>
          An independent Ethereum meme project built around a fictional grey-kitten character. The kitten
          wears a reflective vest and treats a scanner like a suggestion.
        </p>
      ),
    },
    {
      question: "Is Elon Musk involved?",
      answer: <p>No. {statements.affiliationLong}</p>,
    },
    {
      question: "Is the kitten Elon Musk’s pet?",
      answer: (
        <p>The mascot is a fictional character, not a claim about a real pet.</p>
      ),
    },
    {
      question: "Where can I find the contract?",
      answer: address ? (
        <p>
          The contract panel shows <span className="address">{address}</span>
          {explorer ? (
            <>
              {" "}
              and links to <ExternalLink href={explorer.href}>{explorer.label}</ExternalLink>.
            </>
          ) : (
            "."
          )}
        </p>
      ) : (
        <p>
          In the contract panel once announced, with a matching explorer link. It has not been announced yet.
        </p>
      ),
    },
    {
      question: "Is trading live?",
      answer: <p>{tradingFaqAnswer(site)}</p>,
    },
    {
      question: "What are the taxes and liquidity arrangements?",
      answer: (
        <>
          <p>{taxSummary(site)} Ownership and other admin controls: see Token Facts. If a detail is missing, it has not been provided.</p>
          {evidence.length > 0 ? (
            <ul className="evidence">
              {evidence.map((item) => (
                <li key={item.href}>
                  <ExternalLink href={item.href}>{item.label}</ExternalLink>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ),
    },
    {
      question: "Does the mini-game award tokens?",
      answer: (
        <p>No. It is a free entertainment feature. It does not send tokens, require a wallet, or rank anyone.</p>
      ),
    },
    {
      question: "Are returns guaranteed?",
      answer: (
        <p>
          No. Meme tokens are speculative and can lose all their value. Nothing on this page is a promise of
          profit or financial advice.
        </p>
      ),
    },
  ];

  return (
    <div className="faq-list">
      {items.map((item) => (
        <FaqItem key={item.question} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: ReactNode }) {
  const [open, setOpen] = useState(false);
  const reactId = useId();
  const buttonId = `${reactId}-button`;
  const panelId = `${reactId}-panel`;

  return (
    <div className="faq-item">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <span>{question}</span>
          <span className="faq-icon" aria-hidden="true">
            {open ? "–" : "+"}
          </span>
        </button>
      </h3>
      <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open} className="faq-panel">
        {answer}
      </div>
    </div>
  );
}
