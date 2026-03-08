import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const freePlan = [
  "Record any screen or window",
  "AI transcription (Whisper)",
  "AI summary after each recording",
  "1 personal workspace",
  "5GB cloud storage",
  "10 recordings per month",
];

const freeDisabled = [
  "Multiple workspaces",
  "Invite team members",
  "Activity and comments",
  "Export transcripts",
];

const proPlan = [
  "Everything in Free",
  "Unlimited recordings",
  "100GB cloud storage",
  "Multiple workspaces",
  "Invite team members to any workspace",
  "Activity feed and comments",
  "Export transcripts (TXT, SRT, PDF)",
  "Priority support",
];

const Pricing = () => {
  return (
    <section id="pricing" className="mt-24">
      <div className="text-xs font-mono uppercase tracking-widest text-white/30 mb-3">
        pricing
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
        Two plans. No surprises.
      </h2>
      <p className="text-white/40 text-base mb-12">
        Start free. Upgrade when your team grows.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8">
          <div className="text-xs font-mono uppercase tracking-widest text-white/30 mb-5">
            Free
          </div>
          <div className="text-5xl font-bold text-white tracking-tight mb-1">
            $0
          </div>
          <div className="text-white/30 text-sm mb-7">
            forever, no card required
          </div>
          <div className="h-px bg-white/10 mb-6" />
          <ul className="flex flex-col gap-y-3 mb-8">
            {freePlan.map((item) => (
              <li key={item} className="flex items-start gap-x-3 text-sm text-white/60">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
            {freeDisabled.map((item) => (
              <li key={item} className="flex items-start gap-x-3 text-sm text-white/20">
                <Check className="w-4 h-4 text-white/15 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <Link href="/auth/sign-in">
            <Button
              variant="outline"
              className="w-full rounded-xl py-6 border-white/15 text-white/70 hover:bg-white/5 hover:text-white bg-transparent text-sm font-semibold"
            >
              Download free
            </Button>
          </Link>
        </div>

        <div className="bg-[#1a1a1a] border border-[#7320DD]/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-[#7320DD]/40" />
          <div className="text-xs font-mono uppercase tracking-widest text-[#7320DD] mb-5">
            Pro
          </div>
          <div className="text-5xl font-bold text-white tracking-tight mb-1">
            $12
            <span className="text-xl font-normal text-white/40 tracking-normal">
              /mo
            </span>
          </div>
          <div className="text-white/30 text-sm mb-7">
            per user, billed monthly
          </div>
          <div className="h-px bg-white/10 mb-6" />
          <ul className="flex flex-col gap-y-3 mb-8">
            {proPlan.map((item) => (
              <li key={item} className="flex items-start gap-x-3 text-sm text-white/70">
                <Check className="w-4 h-4 text-[#7320DD] flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <Link href="/auth/sign-in">
            <Button className="w-full bg-[#7320DD] hover:bg-[#7320DD]/80 rounded-xl py-6 text-white text-sm font-semibold">
              Start 14-day free trial
            </Button>
          </Link>
          <div className="text-center text-xs text-white/25 mt-3">
            No card required during trial
          </div>
        </div>
      </div>

      <div className="mt-6 bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden max-w-3xl">
        <div className="px-6 py-4 border-b border-white/10 text-sm font-semibold text-white">
          Full comparison
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-3 text-left text-white/30 font-normal">Feature</th>
              <th className="px-6 py-3 text-center text-white/30 font-normal">Free</th>
              <th className="px-6 py-3 text-center text-[#7320DD] font-semibold">Pro</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Screen recording", true, true],
              ["AI transcription", true, true],
              ["AI summaries", true, true],
              ["Recordings / month", "10", "Unlimited"],
              ["Cloud storage", "5 GB", "100 GB"],
              ["Workspaces", "1", "Unlimited"],
              ["Invite team members", false, true],
              ["Activity and comments", false, true],
              ["Export transcripts", false, true],
            ].map(([label, free, pro]) => (
              <tr key={String(label)} className="border-t border-white/5">
                <td className="px-6 py-3 text-white/40">{label}</td>
                <td className="px-6 py-3 text-center text-white/40">
                  {free === true ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : free === false ? (
                    <span className="text-white/15">—</span>
                  ) : (
                    free
                  )}
                </td>
                <td className="px-6 py-3 text-center text-white/70">
                  {pro === true ? (
                    <Check className="w-4 h-4 text-[#7320DD] mx-auto" />
                  ) : pro === false ? (
                    <span className="text-white/15">—</span>
                  ) : (
                    <span className="font-semibold text-white">{pro}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Pricing;