import { useEffect, useRef, useState } from "react";
import { site } from "../config/site.ts";
import { canPurchase, primaryCommunityUrl } from "../config/selectors.ts";
import { BrandImage } from "./BrandImage.tsx";

const LINKS = [
  { href: "#story", label: "Story" },
  { href: "#boss-test", label: "Boss Test" },
  { href: "#token-facts", label: "Tokenomics" },
  { href: "#how-to-buy", label: "How to Buy" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const buyHref = canPurchase(site) ? site.purchaseUrl : null;
  const communityHref = primaryCommunityUrl(site);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 960px)");
    const onChange = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    if (!open) return;

    const nav = navRef.current;
    const focusable = [
      buttonRef.current,
      ...(nav ? Array.from(nav.querySelectorAll<HTMLElement>("a, button")) : []),
    ].filter((element): element is HTMLElement => element !== null);
    (focusable[1] ?? focusable[0])?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("nav-open");
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  return (
    <header className="site-header">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <div className="wrap header-bar">
        <a className="brand" href="#top" onClick={close}>
          <BrandImage
            image={site.assets.logoPlain}
            alt=""
            priority
            className="brand-mark"
          />
          <span className="brand-text">
            <span className="brand-name">{site.name}</span>
            <span className="brand-ticker">{site.ticker}</span>
          </span>
        </a>
        <button
          ref={buttonRef}
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <nav
          ref={navRef}
          id="site-menu"
          className={open ? "site-nav is-open" : "site-nav"}
          aria-label="Primary"
        >
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={close}>
              {link.label}
            </a>
          ))}
          {buyHref ? (
            <a className="btn btn-primary nav-cta" href={buyHref} target="_blank" rel="noopener noreferrer">
              Buy {site.ticker}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
          {!buyHref && communityHref ? (
            <a className="btn btn-primary nav-cta" href={communityHref} target="_blank" rel="noopener noreferrer">
              Join the Community
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
