import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";

const UpgradeBanner = () => {
  return (
    <div className="bg-[#1a1a1a] border border-[#7320DD]/30 rounded-2xl px-7 py-6 flex items-center justify-between gap-x-6 mb-8 overflow-hidden">
      <div className="absolute inset-0 bg-[#7320DD]/3 pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-x-2 mb-1.5">
          <Sparkles className="w-4 h-4 text-[#7320DD]" />
          <span className="text-sm font-semibold text-white">
            Unlock Pro features
          </span>
        </div>
        <p className="text-xs text-[#bdbdbd] max-w-sm leading-relaxed">
          Get unlimited recordings, multiple workspaces, AI summaries, team
          invites, and activity comments.
        </p>
      </div>
      <Link href="/dashboard/billing" className="relative flex-shrink-0">
        <Button className="bg-[#7320DD] hover:bg-[#7320DD]/80 text-white rounded-full px-6 font-semibold text-sm">
          Upgrade to Pro
        </Button>
      </Link>
    </div>
  );
};

export default UpgradeBanner;