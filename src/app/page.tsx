import dynamic from "next/dynamic";
import { Navbar } from "@/components/pixquish/navbar";
import { Hero } from "@/components/pixquish/hero";
import { ToolSwitcher } from "@/components/pixquish/tool-switcher";
import { Footer } from "@/components/pixquish/footer";

const HowItWorks = dynamic(
  () => import("@/components/pixquish/how-it-works").then((m) => m.HowItWorks),
);

const Features = dynamic(
  () => import("@/components/pixquish/features").then((m) => m.Features),
);

const Faq = dynamic(
  () => import("@/components/pixquish/faq").then((m) => m.Faq),
);

const Guide = dynamic(
  () => import("@/components/pixquish/guide").then((m) => m.Guide),
);

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ToolSwitcher />
        <HowItWorks />
        <Features />
        <Guide />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
