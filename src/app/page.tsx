import dynamic from "next/dynamic";
import { Navbar } from "@/components/compressx/navbar";
import { Hero } from "@/components/compressx/hero";
import { ToolSwitcher } from "@/components/compressx/tool-switcher";
import { Footer } from "@/components/compressx/footer";

const HowItWorks = dynamic(
  () => import("@/components/compressx/how-it-works").then((m) => m.HowItWorks),
);

const Features = dynamic(
  () => import("@/components/compressx/features").then((m) => m.Features),
);

const Faq = dynamic(
  () => import("@/components/compressx/faq").then((m) => m.Faq),
);

const Guide = dynamic(
  () => import("@/components/compressx/guide").then((m) => m.Guide),
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
