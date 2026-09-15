import { BentoGrid } from "@/components/BentoGrid/BentoGrid";
import { HeroLabelProvider } from "@/components/HeroLabel/HeroLabel";
import { HeroWord } from "@/components/HeroWord/HeroWord";
import { IntroSequence } from "@/components/IntroSequence/IntroSequence";
import { PageTransition } from "@/components/PageTransition/PageTransition";
import { TopBar } from "@/components/TopBar/TopBar";
import { INTRO_WORDS } from "@/lib/intro";
import styles from "./page.module.css";

export default function Home() {
  // The same string the intro ends on. The flying word lands on this element,
  // so if the two ever diverge the handoff geometry stops matching.
  const heroWord = INTRO_WORDS[INTRO_WORDS.length - 1];

  return (
    <>
      <IntroSequence />

      {/* The overlay above stays outside the transition — it is a first-load
          effect, and wrapping it would animate it on every return here. */}
      <PageTransition>
        <div className={styles.page}>
          <TopBar />

          <main className={styles.main}>
            {/* Wraps both: the cards write the headline, the headline reads it. */}
            <HeroLabelProvider>
              <HeroWord fallback={heroWord} className={styles.hero} />

              <div className={styles.gridWrap}>
                <BentoGrid />
              </div>
            </HeroLabelProvider>
          </main>
        </div>
      </PageTransition>
    </>
  );
}
