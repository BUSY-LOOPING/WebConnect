const stats = [
  { value: "50+", label: "Languages transcribed" },
  { value: "Any", label: "Screen, app, or window" },
  { value: "~30s", label: "Avg. summary time" },
  { value: "E2E", label: "Encrypted storage" },
];

const Stats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border border-white/10 rounded-2xl overflow-hidden mt-8">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`px-8 py-7 bg-[#1a1a1a] ${
            i < stats.length - 1 ? "border-r border-white/10" : ""
          }`}
        >
          <div className="text-3xl font-bold text-white tracking-tight">
            {stat.value}
          </div>
          <div className="text-sm text-white/40 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default Stats;