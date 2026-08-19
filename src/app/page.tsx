import dynamic from "next/dynamic";
import { Navbar } from "@/components/pixquish/navbar";
import { Hero } from "@/components/pixquish/hero";
import { ToolSwitcher } from "@/components/pixquish/tool-switcher";
import { Footer } from "@/components/pixquish/footer";
import { LazySection } from "@/components/pixquish/lazy-section";

// Below-fold sections: code-split + SSR disabled + scroll-triggered.
// Hero + ToolSwitcher stay in the initial SSR payload (above the fold).
const HowItWorks = dynamic(
  () => import("@/components/pixquish/how-it-works").then((m) => m.HowItWorks),
  { ssr: false },
);

const Features = dynamic(
  () => import("@/components/pixquish/features").then((m) => m.Features),
  { ssr: false },
);

const Faq = dynamic(
  () => import("@/components/pixquish/faq").then((m) => m.Faq),
  { ssr: false },
);

const Guide = dynamic(
  () => import("@/components/pixquish/guide").then((m) => m.Guide),
  { ssr: false },
);

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Above the fold — included in SSR + initial JS */}
        <Hero />
        <ToolSwitcher />

        {/* Below the fold — lazy-loaded on scroll */}
        <LazySection skeletonHeight="500px">
          <HowItWorks />
        </LazySection>
        <LazySection skeletonHeight="600px">
          <Features />
        </LazySection>
        <LazySection skeletonHeight="2200px">
          <Guide />
        </LazySection>
        <LazySection skeletonHeight="800px">
          <Faq />
        </LazySection>
      </main>
      <Footer />
    </div>
  );
}
