const steps = [
  {
    num: "01",
    title: "Pick your screen",
    desc: "Select any window, app, or full display. Hit record.",
  },
  {
    num: "02",
    title: "Whisper transcribes",
    desc: "Audio transcribed live as you record. Every word, every speaker.",
  },
  {
    num: "03",
    title: "AI summarizes",
    desc: "Recording ends and AI generates a clean summary with action items.",
  },
  {
    num: "04",
    title: "Share and discuss",
    desc: "Send to a workspace. Team leaves comments. Everyone stays in sync.",
  },
];

const HowItWorks = () => {
  return (
    <section className="mt-24">
      <div className="text-xs font-mono uppercase tracking-widest text-white/30 mb-3">
        how it works
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-14">
        Record once. Know everything.
      </h2>

      <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="absolute top-5 left-[10%] right-[10%] h-px bg-white/10 hidden md:block" />
        {steps.map((step) => (
          <div key={step.num} className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full border border-white/15 bg-[#1a1a1a] flex items-center justify-center text-xs font-mono text-[#7320DD] font-semibold relative z-10 mb-5">
              {step.num}
            </div>
            <div className="text-white font-semibold text-sm mb-2">
              {step.title}
            </div>
            <div className="text-white/40 text-xs leading-relaxed">
              {step.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;