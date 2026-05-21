import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { auth, db } from "../firebase";
import { collection, onSnapshot, orderBy, query, where, doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import jsPDF from "jspdf";
import ReviewCard from "./ReviewCard";
import StatsBar from "./StatsBar";
import ReviewChart from "./ReviewChart";
import Settings from "./Settings";
import i18n from "../i18n";

const LANGUAGES = [
  { code: "en", label: "EN", flag: "🇺🇸" },
  { code: "es", label: "ES", flag: "🇪🇸" },
];

const PAID_PLANS = ["trial", "starter", "pro", "agency"];

export default function Dashboard({ user }) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("all");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [businessName, setBusinessName] = useState("");
  const [langOpen, setLangOpen] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(null);
  const [plan, setPlan] = useState("free");
  const [regenerateCounts, setRegenerateCounts] = useState({});
  const [exportingPdf, setExportingPdf] = useState(false);
  const currentLang = i18n.language?.slice(0, 2) || "en";
  const isPaid = PAID_PLANS.includes(plan);

  // Load settings (businessName + trial info)
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setBusinessName(data?.businessName || "");
          setPlan(data?.plan || "free");
          if (data?.plan === "trial" && data?.trialEndsAt) {
            const msLeft = new Date(data.trialEndsAt) - new Date();
            const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
            setTrialDaysLeft(daysLeft);
          }
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    };
    if (user?.uid) loadSettings();
  }, [user]);

  // Load reviews
  useEffect(() => {
    const q = query(
      collection(db, "reviews"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          ...d,
          timestamp: d.timestamp?.toDate
            ? d.timestamp.toDate().toISOString().split("T")[0]
            : (d.timestamp ?? ""),
        };
      });
      setReviews(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filtered =
    filter === "negative"
      ? reviews.filter((r) => r.isNegative)
      : filter === "positive"
        ? reviews.filter((r) => !r.isNegative)
        : reviews;

  const negativeCount = reviews.filter((r) => r.isNegative).length;
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((a, b) => a + Number(b.rating), 0) / reviews.length).toFixed(1)
      : "0.0";

  const reviewWord = filtered.length === 1 ? t("dashboard.review") : t("dashboard.reviews");

  const handleRegenerate = async (reviewId, reviewText) => {
    const url = import.meta.env.VITE_N8N_REGENERATE_URL;
    if (!url) return;
    setRegenerateCounts((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, reviewText, userId: user.uid, businessName }),
      });
      // onSnapshot in reviews useEffect will pick up the new aiResponse automatically
    } catch (err) {
      console.error("Regenerate error:", err);
      // Rollback count on failure
      setRegenerateCounts((prev) => ({
        ...prev,
        [reviewId]: Math.max(0, (prev[reviewId] || 1) - 1),
      }));
    }
  };

  const exportPDF = async () => {
    if (!isPaid) return;
    setExportingPdf(true);
    try {
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const margin = 40;
      let y = 60;

      // Title
      pdf.setFontSize(22);
      pdf.setTextColor(30, 30, 30);
      pdf.text("ReviewShield — Review Report", margin, y);
      y += 10;

      // Business name + date
      pdf.setFontSize(11);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`${businessName} · ${new Date().toLocaleDateString()}`, margin, y + 14);
      y += 36;

      // Divider
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, y, pageW - margin, y);
      y += 20;

      // Summary stats
      pdf.setFontSize(11);
      pdf.setTextColor(30, 30, 30);
      pdf.text(`Total reviews: ${reviews.length}   Negative: ${negativeCount}   Avg rating: ${avgRating}`, margin, y);
      y += 30;

      // Reviews
      filtered.forEach((review, idx) => {
        const blockH = review.aiResponse ? 130 : 80;
        if (y + blockH > pdf.internal.pageSize.getHeight() - 50) {
          pdf.addPage();
          y = 50;
        }

        // Card header
        pdf.setFontSize(10);
        pdf.setTextColor(80, 80, 80);
        pdf.text(
          `#${idx + 1}  ${review.platform?.toUpperCase() ?? ""}  ★ ${review.rating}/5  ${review.isNegative ? "⚠ Negative" : "✓ Positive"}  ${review.timestamp}`,
          margin,
          y
        );
        y += 14;

        pdf.setFontSize(11);
        pdf.setTextColor(20, 20, 20);
        pdf.text(review.authorName || "Anonymous", margin, y);
        y += 14;

        // Review text (wrapped)
        pdf.setFontSize(10);
        pdf.setTextColor(60, 60, 60);
        const reviewLines = pdf.splitTextToSize(review.reviewText || "", pageW - margin * 2);
        pdf.text(reviewLines, margin, y);
        y += reviewLines.length * 13 + 6;

        // AI response
        if (review.aiResponse) {
          pdf.setFontSize(9);
          pdf.setTextColor(40, 80, 140);
          pdf.text("AI Response:", margin, y);
          y += 12;
          pdf.setTextColor(50, 50, 80);
          const aiLines = pdf.splitTextToSize(review.aiResponse, pageW - margin * 2);
          pdf.text(aiLines, margin, y);
          y += aiLines.length * 12 + 6;
        }

        // Separator
        pdf.setDrawColor(220, 220, 220);
        pdf.line(margin, y, pageW - margin, y);
        y += 16;
      });

      pdf.save(`reviewshield-${businessName.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#080a0f]/85 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">🛡️</span>
          <span className="font-bold text-lg tracking-tight">ReviewShield</span>
          {businessName && (
            <span className="bg-white/[0.06] text-gray-400 text-xs px-2.5 py-1 rounded-full border border-white/[0.08]">
              {businessName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-gray-400 hover:text-white text-xs px-2 py-1 rounded-lg border border-gray-700 hover:border-gray-500 transition"
            >
              <span>{LANGUAGES.find(l => l.code === currentLang)?.flag || "🌐"}</span>
              <span className="uppercase">{currentLang}</span>
              <span className="text-gray-600">▾</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-8 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden min-w-[120px]">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                      setLangOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-xs hover:bg-gray-700 transition text-left ${
                      currentLang === lang.code ? "text-blue-400" : "text-gray-300"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-gray-400 text-sm hidden md:block">
            {user?.email}
          </span>
          <button
            onClick={() => signOut(auth)}
            className="text-gray-500 hover:text-white text-sm transition"
          >
            {t("dashboard.logout")}
          </button>
        </div>
      </header>

      {/* Nav tabs */}
      <div className="border-b border-white/[0.05] bg-[#080a0f]/60 px-6">
        <div className="flex gap-6 max-w-5xl mx-auto">
          {[
            {
              key: "dashboard",
              label: (
                <span className="flex items-center gap-1.5">
                  {t("dashboard.tabs.reviews")}
                  {negativeCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                      {negativeCount}
                    </span>
                  )}
                </span>
              ),
            },
            { key: "settings", label: t("dashboard.tabs.settings") },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setPage(tab.key)}
              className={`py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                page === tab.key
                  ? "border-blue-500 text-white"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trial Banner */}
      {plan === "trial" && trialDaysLeft !== null && (
        <div className={`px-6 py-3 flex items-center justify-between text-sm ${
          trialDaysLeft <= 3
            ? "bg-red-950/60 border-b border-red-800/50"
            : "bg-blue-950/60 border-b border-blue-800/40"
        }`}>
          <div className="flex items-center gap-3 max-w-5xl mx-auto w-full">
            <span>{trialDaysLeft <= 3 ? "⚠️" : "🎉"}</span>
            <span className={trialDaysLeft <= 3 ? "text-red-300" : "text-blue-300"}>
              {t("trial.banner", { days: trialDaysLeft })}
            </span>
            <button
              onClick={() => setPage("settings")}
              className={`ml-auto text-xs font-semibold px-3 py-1.5 rounded-lg transition shrink-0 ${
                trialDaysLeft <= 3
                  ? "bg-red-600 hover:bg-red-500 text-white"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              {t("trial.upgrade")}
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {page === "settings" ? (
        <Settings user={user} onSaved={() => setPage("dashboard")} />
      ) : (
        <main className="max-w-5xl mx-auto px-6 py-8">
          <StatsBar
            total={reviews.length}
            negative={negativeCount}
            avgRating={avgRating}
          />

          <ReviewChart reviews={reviews} />

          <div className="flex gap-2 mb-6 flex-wrap">
            {[
              { key: "all", label: t("dashboard.filters.all") },
              { key: "negative", label: t("dashboard.filters.negative") },
              { key: "positive", label: t("dashboard.filters.positive") },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
                  filter === f.key
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
            <span className="ml-auto text-gray-500 text-sm self-center">
              {filtered.length} {reviewWord}
            </span>
            {/* Export PDF button */}
            <button
              onClick={isPaid ? exportPDF : undefined}
              disabled={exportingPdf}
              title={!isPaid ? t("dashboard.pdfPlanRequired") : undefined}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
                isPaid
                  ? exportingPdf
                    ? "bg-gray-700 text-gray-400 cursor-wait"
                    : "bg-white/[0.06] border border-white/[0.1] text-gray-300 hover:bg-white/[0.1] hover:text-white"
                  : "bg-gray-800/50 text-gray-600 cursor-not-allowed border border-gray-700/50"
              }`}
            >
              <span>📄</span>
              {exportingPdf ? t("dashboard.exportingPdf") : t("dashboard.exportPdf")}
              {!isPaid && (
                <span className="text-[10px] bg-gray-700 px-1.5 py-0.5 rounded text-gray-500 ml-0.5">
                  Starter+
                </span>
              )}
            </button>
          </div>

          {loading && (
            <div className="text-center py-20 text-gray-500">
              <p className="text-4xl mb-4">⏳</p>
              <p>{t("dashboard.loading")}</p>
            </div>
          )}

          {!loading && reviews.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <p className="text-4xl mb-4">📭</p>
              <p>{t("dashboard.empty")}</p>
            </div>
          )}

          {!loading && (
            <div className="space-y-4">
              {filtered.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  plan={plan}
                  userId={user.uid}
                  regenerateCount={regenerateCounts[review.id] || 0}
                  onRegenerate={handleRegenerate}
                />
              ))}
            </div>
          )}
        </main>
      )}
    </div>
  );
}
