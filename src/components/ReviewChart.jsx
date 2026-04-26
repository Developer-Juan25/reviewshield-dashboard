import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DonutChart } from "./DonutChart";

export default function ReviewChart({ reviews }) {
  const { t } = useTranslation();
  const [hoveredSegment, setHoveredSegment] = useState(null);

  if (!reviews || reviews.length === 0) return null;

  const positive = reviews.filter((r) => !r.isNegative).length;
  const negative = reviews.filter((r) => r.isNegative).length;
  const total = reviews.length;

  const positivePercent = Math.round((positive / total) * 100);
  const negativePercent = Math.round((negative / total) * 100);

  const data = [
    { label: t("chart.positive"), value: positive, color: "#3b82f6" },
    { label: t("chart.negative"), value: negative, color: "#ef4444" },
  ];

  const activeData = hoveredSegment
    ? data.find((d) => d.label === hoveredSegment.label)
    : null;

  const centerValue = activeData ? activeData.value : total;
  const centerLabel = activeData ? activeData.label : t("chart.total");
  const centerPercent = activeData
    ? activeData.label === t("chart.positive")
      ? positivePercent
      : negativePercent
    : null;

  const avg = (
    reviews.reduce((a, b) => a + Number(b.rating), 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="bg-white/[0.025] border border-white/[0.07] rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-semibold text-sm">{t("chart.title")}</h3>
        <span className="text-gray-500 text-xs">{t("chart.period")}</span>
      </div>

      <div className="flex items-center justify-center gap-12">
        {/* Donut */}
        <DonutChart
          data={data}
          size={180}
          strokeWidth={22}
          onSegmentHover={setHoveredSegment}
          centerContent={
            <div className="flex flex-col items-center justify-center text-center select-none">
              <span
                className="text-3xl font-bold leading-none transition-all duration-200"
                style={{ color: activeData ? activeData.color : "#ffffff" }}
              >
                {centerValue}
              </span>
              {centerPercent !== null && (
                <span
                  className="text-xs font-medium mt-0.5 transition-all duration-200"
                  style={{ color: activeData ? activeData.color : "#9ca3af" }}
                >
                  {centerPercent}%
                </span>
              )}
              <span className="text-gray-500 text-[11px] mt-1 leading-tight max-w-[80px] text-center">
                {centerLabel}
              </span>
            </div>
          }
        />

        {/* Legend + stats */}
        <div className="flex flex-col gap-4">
          {data.map((seg) => {
            const pct = Math.round((seg.value / total) * 100);
            const isHovered = hoveredSegment?.label === seg.label;
            return (
              <div
                key={seg.label}
                className={`flex items-center gap-3 transition-opacity duration-200 ${
                  hoveredSegment && !isHovered ? "opacity-40" : "opacity-100"
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0 transition-all duration-200"
                  style={{
                    backgroundColor: seg.color,
                    boxShadow: isHovered ? `0 0 8px ${seg.color}` : "none",
                  }}
                />
                <div>
                  <p className="text-white text-sm font-semibold leading-none">
                    {seg.value}
                    <span className="text-gray-500 text-xs font-normal ml-1.5">
                      {pct}%
                    </span>
                  </p>
                  <p
                    className="text-xs mt-0.5 transition-colors duration-200"
                    style={{ color: isHovered ? seg.color : "#6b7280" }}
                  >
                    {seg.label}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Avg rating */}
          <div className="mt-1 flex items-center gap-2 bg-yellow-500/[0.08] border border-yellow-500/20 rounded-xl px-3 py-2">
            <span className="text-yellow-400 text-sm">⭐</span>
            <div>
              <p className="text-yellow-400 text-sm font-bold leading-none">{avg}</p>
              <p className="text-gray-500 text-[11px] mt-0.5">{t("chart.avgRating")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
