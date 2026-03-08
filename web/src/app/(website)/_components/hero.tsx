import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="flex flex-col items-center text-center pt-24 pb-20 gap-y-8">
      <div className="inline-flex items-center gap-x-2 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white/50">
        <span className="w-2 h-2 rounded-full bg-[#7320DD] animate-pulse" />
        AI-Powered Screen Recorder
      </div>

      <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] max-w-4xl text-white/70">
        Record any screen.{" "}
        <span className="text-[#ffffff]">Understand everything.</span>
      </h1>

      <p className="text-white/50 text-lg md:text-xl max-w-2xl leading-relaxed">
        WebConnect captures anything on your screen — meetings, tutorials, calls,
        workflows — then automatically transcribes and summarizes it with AI.
        No manual notes, ever.
      </p>

      <div className="flex items-center gap-x-4 pt-2">
        <Link href="/auth/sign-in">
          <Button className="bg-[#7320DD] hover:bg-[#7320DD]/80 text-white text-base px-7 py-6 rounded-full font-semibold flex items-center gap-x-2">
            Get started free
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <Link href="?tab=pricing">
          <Button
            variant="ghost"
            className="text-white/60 hover:text-white text-base px-7 py-6 rounded-full border border-white/10 hover:bg-white/5"
          >
            See pricing
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-x-8 pt-4 text-sm text-white/30">
        <span>Free to start</span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span>No card required</span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span>Open source</span>
      </div>
    </section>
  );
};

export default Hero;