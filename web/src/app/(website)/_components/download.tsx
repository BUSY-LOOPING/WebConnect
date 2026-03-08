const platforms = [
  { os: "Windows", sub: "Download for", icon: "windows" },
  { os: "macOS", sub: "Download for", icon: "apple" },
  { os: "Linux", sub: "Download for", icon: "linux" },
];

const WindowsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white/60">
    <path d="M3 5.557L10.5 4.5v7.5H3V5.557zM11.5 4.357L21 3v9h-9.5V4.357zM3 13h7.5v7.443L3 19.443V13zM11.5 13H21v9l-9.5-1.357V13z" />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white/60">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const LinuxIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white/60">
    <path d="M12.504 0c-.155 0-.315.008-.48.021C7.576.336 3.03 2.523 1.212 6.312c-.978 2.078-.989 4.382-.194 6.526.24.665.533 1.315.842 1.966.204.432.415.861.587 1.302.218.562.32 1.148.32 1.745v.001c0 .756-.128 1.498-.384 2.204a9.22 9.22 0 01-1.39 2.666A9.22 9.22 0 002.5 24h19c0-1.248-.437-2.393-1.188-3.308-.566-.691-1.31-1.268-2.188-1.592-.547-.203-1.143-.304-1.752-.304h-.001c-.698 0-1.383.138-2.003.398-.648.271-1.2.693-1.596 1.24A3.45 3.45 0 0012 21.5a3.45 3.45 0 00-.773-2.166 3.74 3.74 0 00-1.596-1.24 4.866 4.866 0 00-2.003-.398h-.001c-.61 0-1.205.1-1.752.304-.878.324-1.622.9-2.188 1.592A4.85 4.85 0 002.5 24" />
  </svg>
);

const icons: Record<string, React.ReactNode> = {
  windows: <WindowsIcon />,
  apple: <AppleIcon />,
  linux: <LinuxIcon />,
};

const Download = () => {
  return (
    <section className="mt-24 mb-12">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        <div className="flex-1">
          <div className="inline-flex items-center gap-x-2 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1 font-mono mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Latest v1.0.0
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3 leading-tight">
            Start recording
            <br />
            in 60 seconds.
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-sm">
            Download the desktop app. Free to start — no account required to
            record locally.
          </p>
        </div>

        <div className="flex flex-col gap-y-3 min-w-[200px]">
          {platforms.map((p) => (
            <button
              key={p.os}
              className="flex items-center gap-x-3 px-5 py-3.5 rounded-xl border border-white/10 bg-[#111111] hover:border-white/25 transition-colors text-left group"
            >
              {icons[p.icon]}
              <span>
                <span className="text-xs text-white/30 block">{p.sub}</span>
                <span className="text-sm font-semibold text-white group-hover:text-white/90">
                  {p.os}
                </span>
              </span>
            </button>
          ))}

          <div className="mt-2 border border-white/10 rounded-xl px-5 py-3.5 bg-[#111111]">
            <div className="text-xs text-white/20 mb-1">Coming soon</div>
            <div className="flex items-center gap-x-3">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white/20">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <span className="text-sm font-semibold text-white/30">
                iOS
              </span>
              <span className="text-xs text-white/20 ml-auto">Soon</span>
            </div>
            <div className="flex items-center gap-x-3 mt-2.5">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white/20">
                <path d="M17.523 15.341a6.47 6.47 0 01-2.31.44c-3.584 0-6.49-2.908-6.49-6.491 0-3.584 2.906-6.491 6.49-6.491.814 0 1.59.155 2.31.44l2.15-2.15A9.836 9.836 0 0012 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12a11.94 11.94 0 00-.437-3.174l-6.04 6.515z" />
              </svg>
              <span className="text-sm font-semibold text-white/30">
                Android
              </span>
              <span className="text-xs text-white/20 ml-auto">Soon</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Download;