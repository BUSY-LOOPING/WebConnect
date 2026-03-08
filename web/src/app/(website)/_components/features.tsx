const features = [
  {
    icon: "M3 3h18v12H3V3zM8 19h8M12 15v4",
    title: "Record Any Screen",
    desc: "Capture your full display, a specific app window, or a browser tab. Works with anything — meetings, demos, lectures, walkthroughs.",
    accent: "#7320DD",
  },
  {
    icon: "M12 1v4M4.22 4.22l2.83 2.83M1 12h4M4.22 19.78l2.83-2.83M12 23v-4M19.78 19.78l-2.83-2.83M23 12h-4M19.78 4.22l-2.83 2.83",
    title: "Whisper Transcription",
    desc: "Every word transcribed automatically with speaker labels and 50+ language support, powered by OpenAI Whisper.",
    accent: "#34d39a",
  },
  {
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    title: "AI Summaries",
    desc: "When recording ends, AI generates a concise summary with key points and action items. No manual notes needed.",
    accent: "#7320DD",
  },
  {
    icon: "M3 7h18M3 12h18M3 17h10",
    title: "Multiple Workspaces",
    desc: "Organize recordings by project, client, or team. Each workspace has its own recordings, members, and activity feed.",
    accent: "#f7a24f",
  },
  {
    icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    title: "Invite Your Team",
    desc: "Paid users can invite collaborators to any workspace. Everyone sees the same recordings, transcripts, and comments.",
    accent: "#34d39a",
  },
  {
    icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
    title: "Activity & Comments",
    desc: "Leave timestamped comments on any recording. Discuss, annotate, and follow up — all without switching tools.",
    accent: "#7320DD",
  },
];

const Features = () => {
  return (
    <section className="mt-24">
      <div className="text-xs font-mono uppercase tracking-widest text-white/30 mb-3">
        features
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-12 max-w-lg">
        Built for people who cannot afford to miss anything.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-7 hover:border-white/20 transition-colors group"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
              style={{ background: `${f.accent}18` }}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke={f.accent}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={f.icon} />
              </svg>
            </div>
            <div className="text-white font-semibold text-base mb-2">
              {f.title}
            </div>
            <div className="text-white/40 text-sm leading-relaxed">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;