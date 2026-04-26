import { useTranslation } from "react-i18next";

export default function StatsBar({ total, negative, avgRating }) {
  const { t } = useTranslation();

  const stats = [
    {
      label: t("stats.total"),
      value: total,
      sub: t("stats.last30days"),
      valueClass: "text-white",
      bg: "bg-white/[0.03]",
      border: "border-white/[0.07]",
      icon: "📋",
      glow: "",
    },
    {
      label: t("stats.negative"),
      value: negative,
      sub: t("stats.requiresAttention"),
      valueClass: negative > 0 ? "text-red-400" : "text-gray-400",
      bg: negative > 0 ? "bg-red-500/[0.05]" : "bg-white/[0.03]",
      border: negative > 0 ? "border-red-500/25" : "border-white/[0.07]",
      icon: "⚠️",
      glow: negative > 0 ? "shadow-[0_0_24px_rgba(239,68,68,0.07)]" : "",
    },
    {
      label: t("stats.avgRating"),
      value: avgRating,
      sub: t("stats.allPlatforms"),
      valueClass: "text-yellow-400",
      bg: "bg-yellow-500/[0.04]",
      border: "border-yellow-500/20",
      icon: "⭐",
      glow: "",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`${s.bg} border ${s.border} rounded-2xl p-5 transition-all duration-300 ${s.glow}`}
        >
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-3 font-medium">
            {s.label}
          </p>
          <p className={`text-3xl font-bold mb-1 ${s.valueClass}`}>
            {s.icon} {s.value}
          </p>
          <p className="text-gray-600 text-xs">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}
