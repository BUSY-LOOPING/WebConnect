import Hero from "./_components/hero";
import AppMockup from "./_components/app-mockup";
import Stats from "./_components/stats";
import Features from "./_components/features";
import HowItWorks from "./_components/how-it-works";
import Pricing from "./_components/pricing";
import Download from "./_components/download";

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const tab = (await searchParams)?.tab ?? "home";

  return (
    <main className="w-full">
      {tab === "home" && (
        <>
          <Hero />
          <AppMockup />
          <Stats />
          <Features />
          <HowItWorks />
          <Download />
        </>
      )}

      {tab === "pricing" && <Pricing />}
    </main>
  );
}