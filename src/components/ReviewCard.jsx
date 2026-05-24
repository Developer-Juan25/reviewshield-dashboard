import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const YelpIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="#FF1A1A">
    <path d="M20.16 12.73l-4.703 1.14c-.477.116-.835-.476-.518-.878l2.946-3.755a.734.734 0 0 0-.155-1.074 9.773 9.773 0 0 0-2.447-1.2.734.734 0 0 0-.908.437l-1.67 4.47c-.17.453-.823.453-.993 0L9.836 7.378a.734.734 0 0 0-.897-.44 9.834 9.834 0 0 0-2.47 1.19.734.734 0 0 0-.16 1.07l2.934 3.764c.316.406-.046.993-.52.878L3.84 12.73a.734.734 0 0 0-.838.931 10.13 10.13 0 0 0 1.374 2.97.734.734 0 0 0 1.036.157l3.92-2.88c.4-.294.905.105.78.578l-1.26 4.674a.734.734 0 0 0 .63.898 10.22 10.22 0 0 0 2.8.1.734.734 0 0 0 .638-.9l-1.237-4.68c-.124-.474.38-.87.78-.578l3.921 2.88a.734.734 0 0 0 1.036-.157 10.13 10.13 0 0 0 1.374-2.97.734.734 0 0 0-.838-.93z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TripAdvisorIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
    <circle cx="7.5" cy="12" r="4" fill="#34E0A1" fillOpacity="0.25" stroke="#34E0A1" strokeWidth="1.5"/>
    <circle cx="16.5" cy="12" r="4" fill="#FF0000" fillOpacity="0.25" stroke="#FF0000" strokeWidth="1.5"/>
    <circle cx="7.5" cy="12" r="1.5" fill="#34E0A1"/>
    <circle cx="16.5" cy="12" r="1.5" fill="#FF0000"/>
  </svg>
);

const PLATFORM_META = {
  google:      { label: "Google",      icon: <GoogleIcon />,      color: "", border: "border-white/[0.14]",    bg: "bg-white/[0.06]" },
  yelp:        { label: "Yelp",        icon: <YelpIcon />,        color: "", border: "border-red-500/20",      bg: "bg-red-500/10" },
  facebook:    { label: "Facebook",    icon: <FacebookIcon />,    color: "", border: "border-indigo-500/20",   bg: "bg-indigo-500/10" },
  tripadvisor: { label: "TripAdvisor", icon: <TripAdvisorIcon />, color: "", border: "border-green-500/20",   bg: "bg-green-500/10" },
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