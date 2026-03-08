const AppMockup = () => {
  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl overflow-hidden border border-white/10 bg-[#1a1a1a] shadow-2xl">
      <div className="flex items-center gap-x-2 px-4 py-3 border-b border-white/10 bg-[#111111]">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs text-white/30 font-mono">
          webconnect — recording
        </span>
        <div className="ml-auto flex items-center gap-x-2 text-xs text-red-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          REC 00:04:32
        </div>
      </div>

      <div className="flex h-[420px]">
        <div className="w-52 border-r border-white/10 bg-[#111111] flex flex-col">
          <div className="px-4 py-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/30 font-mono uppercase tracking-widest">
                Workspaces
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-y-1 p-2 mt-1">
            {[
              { label: "Personal", color: "#7320DD", active: true },
              { label: "College", color: "#34d39a" },
              { label: "Youtube", color: "#f7a24f" },
            ].map((ws) => (
              <div
                key={ws.label}
                className={`flex items-center gap-x-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer ${
                  ws.active
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:bg-white/5"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: ws.color }}
                />
                {ws.label}
              </div>
            ))}
            <div className="px-3 py-2 text-xs text-white/20 mt-2 border-t border-white/5 pt-3">
              + New workspace
            </div>
          </div>

          <div className="mt-auto p-3 border-t border-white/10">
            <div className="text-xs text-white/20 uppercase tracking-widest font-mono mb-2 px-1">
              Menu
            </div>
            {["My Library", "Notifications", "Billing", "Settings"].map(
              (item) => (
                <div
                  key={item}
                  className={`px-3 py-2 rounded-lg text-sm cursor-pointer ${
                    item === "My Library"
                      ? "bg-white/10 text-white"
                      : "text-white/30 hover:bg-white/5"
                  }`}
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div>
              <div className="text-xs text-white/30 uppercase tracking-widest font-mono mb-1">
                Personal
              </div>
              <div className="text-xl font-bold text-white">My Library</div>
            </div>
            <div className="flex gap-x-2">
              <div className="px-4 py-2 rounded-lg border border-white/10 text-sm text-white/50 cursor-pointer hover:bg-white/5">
                Upload
              </div>
              <div className="px-4 py-2 rounded-lg bg-[#7320DD] text-sm text-white font-semibold cursor-pointer flex items-center gap-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Record
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden px-6 py-4">
            <div className="flex items-center gap-x-4 mb-5">
              <div className="px-4 py-1.5 rounded-full bg-white text-black text-sm font-semibold cursor-pointer">
                Videos
              </div>
              <div className="px-4 py-1.5 rounded-full text-white/40 text-sm cursor-pointer hover:text-white/60">
                Archive
              </div>
            </div>

            <div className="text-xs text-white/30 uppercase tracking-widest font-mono mb-3">
              Recent recordings
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Q3 Roadmap Planning", duration: "47:22", status: "Summarized" },
                { name: "Design Review", duration: "28:05", status: "Summarized" },
                { name: "Onboarding walkthrough", duration: "12:40", status: "Processing" },
              ].map((rec) => (
                <div
                  key={rec.name}
                  className="rounded-xl overflow-hidden border border-white/10 bg-[#111111] cursor-pointer hover:border-white/20 transition-colors"
                >
                  <div className="h-24 bg-[#0d0d0d] flex items-center justify-center relative">
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                      <div className="w-0 h-0 border-y-4 border-y-transparent border-l-8 border-l-white/40 ml-0.5" />
                    </div>
                    <div
                      className={`absolute bottom-2 right-2 text-xs px-2 py-0.5 rounded-full font-mono ${
                        rec.status === "Summarized"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-[#7320DD]/10 text-[#7320DD]"
                      }`}
                    >
                      {rec.status}
                    </div>
                  </div>
                  <div className="px-3 py-2.5">
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