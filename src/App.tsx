import { lazy, Suspense } from "react";
import { Community } from "./components/Community.tsx";
import { Faq } from "./components/Faq.tsx";
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
const MemeStudio = lazy(() => import("./components/MemeStudio.tsx").then((mod) => ({ default: mod.MemeStudio })));

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
          intro="What has been published is listed here. Empty fields stay empty until the details are real."
        >
          <TokenFacts />
        </Section>
        <Section
          id="how-to-buy"
          tone="charcoal"
          eyebrow="Buying"
          title="Four steps to meet the boss."
          intro="Use your own wallet and a verified trading link. This website does not connect to a wallet or build a swap."
        >
          <HowToBuy />
        </Section>
        <Section
          id="meme-studio"
          tone="navy"
          eyebrow="Community tool"
          title="Give the boss something to say."
          intro="Pick a brand image, write a short caption, and download a PNG. Captions are not sent to a server."
        >
          <ToolBoundary label="The meme studio didn't load. Refresh the page to try again.">
            <Suspense fallback={<p className="tool-fallback" role="status">Loading the meme studio…</p>}>
              <MemeStudio />
            </Suspense>
          </ToolBoundary>
        </Section>
        <Section
          id="community"
          tone="charcoal"
          eyebrow="Community"
          title="Join the boss room."
          intro="Bring your best memes. The kitten will judge them."
        >
          <Community />
        </Section>
        <Section id="faq" tone="navy" eyebrow="Questions" title="Straight answers.">
          <Faq />
        </Section>
      </main>
      <Footer />
    </>
  );
}
