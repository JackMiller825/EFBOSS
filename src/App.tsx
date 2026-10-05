import { lazy, Suspense } from "react";
import { Footer } from "./components/Footer.tsx";
import { Header } from "./components/Header.tsx";
import { Hero } from "./components/Hero.tsx";
import { HowToBuy } from "./components/HowToBuy.tsx";
import { Metadata } from "./components/Metadata.tsx";
import { Section } from "./components/Section.tsx";
import { Story } from "./components/Story.tsx";
import { TokenFacts } from "./components/TokenFacts.tsx";
import { ToolBoundary } from "./components/ToolBoundary.tsx";

const BossGame = lazy(() => import("./components/BossGame.tsx").then((mod) => ({ default: mod.BossGame })));

export default function App() {
  return (
    <>
      <Metadata />
      <Header />
      <main id="content">
        <div id="top">
          <Hero />
        </div>
        <Story />
        <Section
          id="boss-test"
          tone="navy"
          eyebrow="A playful mini-game"
          title="Can your scanner find the boss?"
          intro="Move the scanner onto the kitten, or press the button. A round takes a few seconds. It stays in your browser, connects no wallet, and pays nothing."
        >
          <ToolBoundary label="The scanner didn't load. Refresh the page to try the mini-game again.">
            <Suspense fallback={<p className="tool-fallback" role="status">Loading the scanner…</p>}>
              <BossGame />
            </Suspense>
          </ToolBoundary>
        </Section>
        <Section
          id="token-facts"
          tone="light"
          eyebrow="Token"
          title="Funny cat. Clear facts."
          titleClass="single-line"
        >
          <TokenFacts />
        </Section>
        <Section id="how-to-buy" tone="charcoal" eyebrow="Buying" title="Four steps to meet the boss.">
          <HowToBuy />
        </Section>
      </main>
      <Footer />
    </>
  );
}
