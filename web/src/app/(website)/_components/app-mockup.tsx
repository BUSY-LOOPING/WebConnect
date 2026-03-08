const AppMockup = () => {
  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl overflow-hidden border border-white/10 bg-[#1a1a1a] shadow-2xl">
      <div className="flex items-center gap-x-2 px-4 py-3 border-b border-white/10 bg-[#111111]">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57] shrink-0" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e] shrink-0" />
        <div className="w-3 h-3 rounded-full bg-[#28c840] shrink-0" />
        <span className="ml-3 text-xs text-white/30 font-mono truncate">
          webconnect — recording
        </span>
        <div className="ml-auto flex items-center gap-x-2 text-xs text-red-400 font-mono shrink-0">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse shrink-0" />
          <span className="hidden sm:inline">REC 00:04:32</span>
        </div>
      </div>

      <div className="flex h-auto min-h-[320px] md:h-[420px]">
        <div className="w-32 sm:w-44 md:w-52 border-r border-white/10 bg-[#111111] flex flex-col shrink-0">
          <div className="px-3 py-3 border-b border-white/10">
            <span className="text-xs text-white/30 font-mono uppercase tracking-widest hidden sm:block">
              Workspaces
            </span>
            <span className="text-xs text-white/30 font-mono sm:hidden">WS</span>
          </div>
          <div className="flex flex-col gap-y-1 p-2 mt-1">
            {[
              { label: "Personal", color: "#7320DD", active: true },
              { label: "College", color: "#34d39a" },
              { label: "Youtube", color: "#f7a24f" },
            ].map((ws) => (
              <div
                key={ws.label}
                className={`flex items-center gap-x-2 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm cursor-pointer ${
                  ws.active
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:bg-white/5"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: ws.color }}
                />
                <span className="truncate">{ws.label}</span>
              </div>
            ))}
            <div className="px-2 sm:px-3 py-2 text-xs text-white/20 mt-2 border-t border-white/5 pt-3 truncate">
              + New
            </div>
          </div>

          <div className="mt-auto p-2 sm:p-3 border-t border-white/10">
            <div className="text-xs text-white/20 uppercase tracking-widest font-mono mb-2 px-1 hidden sm:block">
              Menu
            </div>
            {["My Library", "Notifications", "Billing", "Settings"].map(
              (item) => (
                <div
                  key={item}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs cursor-pointer truncate ${
                    item === "My Library"
                      ? "bg-white/10 text-white"
                      : "text-white/30 hover:bg-white/5"
                  }`}
                >
                  <span className="hidden sm:inline">{item}</span>
                  <span className="sm:hidden">{item.split(" ")[0]}</span>
                </div>
              )
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-white/10">
            <div className="min-w-0">
              <div className="text-xs text-white/30 uppercase tracking-widest font-mono mb-1 hidden sm:block">
                Personal
              </div>
              <div className="text-base sm:text-xl font-bold text-white truncate">My Library</div>
            </div>
            <div className="flex gap-x-2 shrink-0 ml-2">
              <div className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-white/10 text-xs sm:text-sm text-white/50 cursor-pointer hover:bg-white/5">
                Upload
              </div>
              <div className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#7320DD] text-xs sm:text-sm text-white font-semibold cursor-pointer flex items-center gap-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />
                Record
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden px-3 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-x-3 mb-4">
              <div className="px-3 sm:px-4 py-1.5 rounded-full bg-white text-black text-xs sm:text-sm font-semibold cursor-pointer shrink-0">
                Videos
              </div>
              <div className="px-3 sm:px-4 py-1.5 rounded-full text-white/40 text-xs sm:text-sm cursor-pointer hover:text-white/60 shrink-0">
                Archive
              </div>
            </div>

            <div className="text-xs text-white/30 uppercase tracking-widest font-mono mb-3 hidden sm:block">
              Recent recordings
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {[
                { name: "Q3 Roadmap Planning", duration: "47:22", status: "Summarized" },
                { name: "Design Review", duration: "28:05", status: "Summarized" },
                { name: "Onboarding walkthrough", duration: "12:40", status: "Processing" },
              ].map((rec) => (
                <div
                  key={rec.name}
                  className="rounded-xl overflow-hidden border border-white/10 bg-[#111111] cursor-pointer hover:border-white/20 transition-colors"
                >
                  <div className="h-16 sm:h-24 bg-[#0d0d0d] flex items-center justify-center relative">
                    <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full border border-white/20 flex items-center justify-center">
                      <div className="w-0 h-0 border-y-[3px] sm:border-y-4 border-y-transparent border-l-[6px] sm:border-l-8 border-l-white/40 ml-0.5" />
                    </div>
                    <div
                      className={`absolute bottom-1.5 right-1.5 text-xs px-1.5 py-0.5 rounded-full font-mono hidden sm:block ${
                        rec.status === "Summarized"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-[#7320DD]/10 text-[#7320DD]"
                      }`}
                    >
                      {rec.status}
                    </div>
                  </div>
                  <div className="px-2 sm:px-3 py-2">
                    <div className="text-xs text-white font-medium truncate">
                      {rec.name}
                    </div>
                    <div className="text-xs text-white/30 font-mono mt-0.5">
                      {rec.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppMockup;