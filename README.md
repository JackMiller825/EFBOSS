# Elon’s Final Boss ($EFBOSS)

A single-page site for an independent Ethereum meme token. The mascot is a fictional grey kitten in a neon yellow safety vest. The page tells that story, shows only the token facts you enter, and keeps buying disabled until a real contract and trading link are published.

## Preview on GitHub Pages

The public preview is [https://jackmiller825.github.io/EFBOSS/](https://jackmiller825.github.io/EFBOSS/).

Pushing `main` to [JackMiller825/EFBOSS](https://github.com/JackMiller825/EFBOSS) runs `.github/workflows/pages.yml`. That build uses `BASE_PATH=/EFBOSS/` so images and scripts load from the project site. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions** if the first run asks for it.

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
| `logo-wordmark.png` | Community download and meme studio |
| `banner-wide.png` | 3:1 supporting illustration under the story |
| `banner-telegram.png` | 1100×520 community preview and social image |

After replacing a source file, regenerate the web images:

```bash
npm run images
```

That writes optimized PNG and WebP files, favicons, and `public/brand/og.png`. The site reads paths from `src/config/site.ts`.

## Configure facts and links

Edit `src/config/site.ts`. Leave unknown values as `null`. Do not guess supply, taxes, allocation, liquidity, ownership, or an audit.

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

Until then, copy and buy controls stay disabled and the page says trading is not live. The navigation shows **Buy $EFBOSS** only in that live state. **Join the Community** appears in the navigation only when a Telegram or X URL is set. Unconfigured links are omitted. `#` is never used as a stand-in destination.

The kitten detection test and meme studio work without a wallet. They do not pay tokens or send captions anywhere. Sharing, when the browser offers it, opens the device share sheet so the visitor chooses where to post.

## Still missing before publication

These fields are intentionally empty:

- Contract address and explorer override
- Purchase URL and live launch status
- Telegram, X, DEXTools, and DexScreener
- Total supply, buy tax, and sell tax
- Allocation
- Liquidity status and evidence
- Ownership, administrative controls, and evidence
- Contract-source verification
- Audit
- News source
- Canonical domain

Do not publish claims for any of those until the values are real.
