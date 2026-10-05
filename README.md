# Elon’s Final Boss ($EFBOSS)

A single-page site for an Ethereum meme token. The mascot is a fictional grey kitten in a neon yellow safety vest. The page tells that story, lists the token details, and explains how to buy on Uniswap.

## Preview on GitHub Pages

The public site is [https://efboss.space/](https://efboss.space/).

Pushing `main` to [JackMiller825/EFBOSS](https://github.com/JackMiller825/EFBOSS) runs `.github/workflows/pages.yml`. The custom domain is served from the site root, so the build uses base path `/`. `CNAME` is copied into the published folder so the domain stays attached. In the repository settings, **Pages → Build and deployment → Source** should be **GitHub Actions**.

## Run it

```bash
npm install
npm run dev
```

The dev server listens on port **4721**.

```bash
npm run build
npm run preview
```

`npm run lint` checks the project with oxlint.

## Replace artwork

Approved source files live in `assets/brand/`:

| File | Use |
| --- | --- |
| `logo-plain.png` | Navigation, favicon, hero, mini-game |
| `logo-wordmark.png` | Named emblem |
| `banner-wide.png` | 3:1 supporting illustration under the story |
| `banner-telegram.png` | 1100×520 social image |

After replacing a source file, regenerate the web images:

```bash
npm run images
```

That writes optimized PNG and WebP files, favicons, and `public/brand/og.png`. The site reads paths from `src/config/site.ts`.

## Configure facts and links

Edit `src/config/site.ts`. Leave unknown values as `null`. The tokenomics table shows supply, taxes, and ownership from this file. A missing contract address is shown as “Coming Soon..”. **Copy address**, in the hero and in that table, copies the text on screen. Replace `contractAddress` with the real address and both places copy that value.

| Field | What to enter |
| --- | --- |
| `launchStatus` | `"prelaunch"` or `"live"` |
| `contractAddress` | `0x` plus 40 hex characters, or `null` |
| `purchaseUrl` | `https` link to the verified trading page, or `null` |
| `explorerUrl` | Optional. On Ethereum mainnet, a valid contract uses Etherscan automatically |
| `social` | `https` links for Telegram, X, DEXTools, and DexScreener |
| `totalSupply`, `buyTax`, `sellTax` | Exact published figures, or `null` |
| `allocation` | Slices that total 100, or `null`. Incomplete totals are not charted |
| `liquidityStatus` and `liquidityEvidence` | What is known, plus `https` evidence links |
| `ownershipStatus`, `adminControls`, `adminEvidence` | Separate from liquidity |
| `sourceVerified` and `sourceUrl` | `null` until verification is actually known |
| `audit` | Only when a report exists. Otherwise the row is omitted |
| `news` | A verified article URL and its date, or `null` |
| `canonicalUrl` | The real origin, such as `https://example.com`, or `null` |

No analytics are installed. Add them only when you have a real configuration.

## Prelaunch and live

Buying is enabled only when **all** of these are true:

1. `launchStatus` is `"live"`.
2. `contractAddress` matches `0x` and 40 hex characters.
3. `purchaseUrl` is an `https` URL.

**Join the Community** appears in the navigation when a Telegram or X URL is set. Those same URLs turn the footer X and Telegram icons into links. Unconfigured links are omitted. `#` is never used as a stand-in destination.

The kitten detection test works without a wallet. It does not pay tokens. Sharing, when the browser offers it, opens the device share sheet so the visitor chooses where to post.

## Still missing

These fields are intentionally empty:

- Contract address and explorer override
- Purchase URL and live launch status
- Allocation, liquidity, audit, and news source
