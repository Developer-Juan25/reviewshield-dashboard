import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const PLATFORM_META = {
  google:      { label: "Google",      icon: "G", color: "text-blue-400",   border: "border-blue-500/20",   bg: "bg-blue-500/10" },
  yelp:        { label: "Yelp",        icon: "Y", color: "text-red-400",    border: "border-red-500/20",    bg: "bg-red-500/10" },
  facebook:    { label: "Facebook",    icon: "f", color: "text-indigo-400", border: "border-indigo-500/20", bg: "bg-indigo-500/10" },
  tripadvisor: { label: "TripAdvisor", icon: "T", color: "text-green-400",  border: "border-green-500/20",  bg: "bg-green-500/10" },
};

const PAID_PLANS = ["trial", "starter", "pro", "agency"];

export default function ReviewCard({ review, plan = "free", userId, regenerateCount = 0, onRegenerate }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editedResponse, setEditedResponse] = useState(review.aiResponse || "");
  const [isRegenerating, setIsRegenerating] = useState(false);

  const platform = PLATFORM_META[review.platform] ?? PLATFORM_META.google;
  const isPaid = PAID_PLANS.includes(plan);
  const canRegenerate = isPaid && regenerateCount < 3;
  const MAX_REGEN = 3;

  // Sync editedResponse when Firestore updates aiResponse (after regeneration)
  useEffect(() => {
    setEditedResponse(review.aiResponse || "");
  }, [review.aiResponse]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    if (!canRegenerate || isRegenerating) return;
    setIsRegenerating(true);
    await onRegenerate?.(review.id, review.reviewText);
    // isRegenerating will reset when aiResponse updates via Firestore onSnapshot
    // Add a safety timeout in case the webhook is slow
    setTimeout(() => setIsRegenerating(false), 15000);
  };

  // Reset regenerating state when aiResponse updates
  useEffect(() => {
    setIsRegenerating(false);
  }, [review.aiResponse]);

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
            {/* Header row */}
            <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
              <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider">
                🤖 {t("review.aiResponse")}
              </span>
              <div className="flex items-center gap-2">
                {/* Regenerate button */}
                {isPaid ? (
                  <button
                    onClick={handleRegenerate}
                    disabled={!canRegenerate || isRegenerating}
                    title={
                      !canRegenerate
                        ? t("review.regenerateLimit")
                        : `${MAX_REGEN - regenerateCount} uses left`
                    }
                    className={`text-xs px-2.5 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 ${
                      !canRegenerate
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : isRegenerating
                        ? "bg-gray-700 text-gray-400 cursor-wait"
                        : "bg-white/[0.05] border border-white/[0.1] text-gray-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {isRegenerating ? (
                      <>
                        <span className="animate-spin text-[10px]">⟳</span>
                        {t("review.regenerating")}
                      </>
                    ) : !canRegenerate ? (
                      t("review.regenerateLimit")
                    ) : (
                      <>
                        ⟳ {t("review.regenerate")}
                        <span className="text-[10px] text-gray-600">
                          {regenerateCount}/{MAX_REGEN}
                        </span>
                      </>
                    )}
                  </button>
                ) : null}

                {/* Copy button */}
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
            </div>

            {/* Editable textarea */}
            <textarea
              value={editedResponse}
              onChange={(e) => setEditedResponse(e.target.value)}
              placeholder={t("review.editHint")}
              rows={Math.max(3, editedResponse.split("\n").length + 1)}
              className="w-full bg-transparent text-gray-300 text-sm leading-relaxed resize-none outline-none border border-transparent focus:border-blue-500/30 rounded-lg px-1 py-1 transition placeholder-gray-700"
            />
          </div>
        )}
      </div>
    </div>
  );
}