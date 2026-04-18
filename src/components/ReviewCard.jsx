import { useState } from "react";

const PLATFORM_COLORS = {
  google: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  yelp: "bg-red-500/10 text-red-400 border-red-500/20",
  facebook: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
};

const PLATFORM_ICONS = {
  google: "G",
  yelp: "Y",
  facebook: "f",
};

export default function ReviewCard({ review }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(review.isNegative);

  const handleCopy = () => {
    navigator.clipboard.writeText(review.aiResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`bg-gray-900 border rounded-xl p-5 transition ${
        review.isNegative ? "border-red-900/50" : "border-gray-800"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          {/* Platform badge */}
          <span
            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-xs font-bold flex-shrink-0 ${PLATFORM_COLORS[review.platform]}`}
          >
            {PLATFORM_ICONS[review.platform]}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-white font-medium text-sm">
                {review.reviewerName}
              </span>
              <span className="text-gray-500 text-xs">{review.timestamp}</span>
              {review.isNegative && (
                <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-2 py-0.5 rounded-full">
                  ⚠️ Negative
                </span>
              )}
            </div>

            {/* Stars */}
            <div className="flex gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className={`text-sm ${s <= review.rating ? "text-yellow-400" : "text-gray-700"}`}
                >
                  ★
                </span>
              ))}
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              {review.reviewText}
            </p>
          </div>
        </div>

        {/* Expand toggle for negative */}
        {review.isNegative && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-500 hover:text-white text-xs transition flex-shrink-0"
          >
            {expanded ? "Hide ▲" : "AI Response ▼"}
          </button>
        )}
      </div>

      {/* AI Response */}
      {review.isNegative && expanded && review.aiResponse && (
        <div className="mt-4 bg-blue-950/30 border border-blue-900/40 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-400 text-xs font-medium uppercase tracking-wider">
              🤖 AI Suggested Response
            </span>
            <button
              onClick={handleCopy}
              className={`text-xs px-3 py-1 rounded-lg transition font-medium ${
                copied
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            {review.aiResponse}
          </p>
        </div>
      )}
    </div>
  );
}
