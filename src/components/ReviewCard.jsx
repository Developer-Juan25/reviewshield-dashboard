import { useState } from "react";
import { useTranslation } from "react-i18next";

const PLATFORM_META = {
  google:      { label: "Google",      icon: "G", color: "text-blue-400",   border: "border-blue-500/20",   bg: "bg-blue-500/10" },
  yelp:        { label: "Yelp",        icon: "Y", color: "text-red-400",    border: "border-red-500/20",    bg: "bg-red-500/10" },
  facebook:    { label: "Facebook",    icon: "f", color: "text-indigo-400", border: "border-indigo-500/20", bg: "bg-indigo-500/10" },
  tripadvisor: { label: "TripAdvisor", icon: "T", color: "text-green-400",  border: "border-green-500/20",  bg: "bg-green-500/10" },
};

export default function ReviewCard({ review }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const platform = PLATFORM_META[review.platform] ?? PLATFORM_META.google;

  const handleCopy = () => {
    navigator.clipboard.writeText(review.aiResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-200 overflow-hidden ${
        review.isNegative
          ? "border-red-500/20 bg-red-500/[0.03] shadow-[0_0_20px_rgba(239,68,68,0.05)]"
          : "border-white/[0.07] bg-white/[0.025] hover:border-white/[0.12]"
      }`}
    >
      {/* Negative left accent bar */}
      {review.isNegative && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-red-500 to-red-700" />
      )}

      <div className="p-5 pl-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            {/* Platform badge */}
            <span
              className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border text-xs font-bold shrink-0 ${platform.bg} ${platform.border} ${platform.color}`}
            >
              {platform.icon}
            </span>

            <div className="flex-1 min-w-0">
              {/* Author + date + badge */}
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-white font-semibold text-sm">
                  {review.authorName || review.reviewerName || "Anonymous"}
                </span>
                <span className="text-gray-600 text-xs">{review.timestamp}</span>
                {review.isNegative && (
                  <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[11px] px-2 py-0.5 rounded-full font-medium">
                    ⚠️ {t("review.negative")}
                  </span>
                )}
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-2.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={`text-base leading-none ${s <= Number(review.rating) ? "text-yellow-400" : "text-gray-700"}`}
                  >
                    ★
                  </span>
                ))}
                <span className="text-gray-600 text-xs ml-1.5 self-center">
                  {review.rating}/5
                </span>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                {review.reviewText}
              </p>
            </div>
          </div>

          {/* Expand AI reply */}
          {review.aiResponse && (
            <button
              onClick={() => setExpanded(!expanded)}
              className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg border transition whitespace-nowrap ${
                expanded
                  ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                  : "bg-white/[0.04] border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20"
              }`}
            >
              {expanded ? t("review.hide") : t("review.replyWithAi")}
            </button>
          )}
        </div>

        {/* AI Response panel */}
        {expanded && review.aiResponse && (
          <div className="mt-4 bg-blue-950/25 border border-blue-500/15 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider">
                🤖 {t("review.aiResponse")}
              </span>
              <button
                onClick={handleCopy}
                className={`text-xs px-3 py-1.5 rounded-lg transition font-semibold ${
                  copied
                    ? "bg-green-600/80 text-white"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
              >
                {copied ? t("review.copied") : t("review.copy")}
              </button>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{review.aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
}
