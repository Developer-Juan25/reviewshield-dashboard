import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { auth, db } from "../firebase";
import { collection, onSnapshot, orderBy, query, where, doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import ReviewCard from "./ReviewCard";
import StatsBar from "./StatsBar";
import Settings from "./Settings";
import i18n from "../i18n";

const LANGUAGES = [
  { code: "en", label: "EN", flag: "🇺🇸" },
  { code: "es", label: "ES", flag: "🇪🇸" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
  { code: "de", label: "DE", flag: "🇩🇪" },
  { code: "pt", label: "PT", flag: "🇧🇷" },
];

export default function Dashboard({ user }) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("all");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [businessName, setBusinessName] = useState("");
  const [langOpen, setLangOpen] = useState(false);
  const currentLang = i18n.language?.slice(0, 2) || "en";

  // Load business name from settings
  useEffect(() => {
    const loadBusinessName = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", user.uid));
        if (snap.exists()) {
          setBusinessName(snap.data()?.businessName || "");
        }
      } catch (err) {
        console.error("Error loading business name:", err);
      }
    };
    if (user?.uid) loadBusinessName();
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
      ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  const reviewWord = filtered.length === 1 ? t("dashboard.review") : t("dashboard.reviews");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">🛡️</span>
          <span className="font-bold text-lg tracking-tight">ReviewShield</span>
          {businessName && (
            <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-full">
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
      <div className="border-b border-gray-800 bg-gray-900 px-6">
        <div className="flex gap-6 max-w-5xl mx-auto">
          {[
            { key: "dashboard", label: t("dashboard.tabs.reviews") },
            { key: "settings", label: t("dashboard.tabs.settings") },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setPage(tab.key)}
              className={`py-3 text-sm font-medium border-b-2 transition ${
                page === tab.key
                  ? "border-blue-500 text-white"
                  : "border-transparent text-gray-500 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {page === "settings" ? (
        <Settings user={user} />
      ) : (
        <main className="max-w-5xl mx-auto px-6 py-8">
          <StatsBar
            total={reviews.length}
            negative={negativeCount}
            avgRating={avgRating}
          />

          <div className="flex gap-2 mb-6">
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
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </main>
      )}
    </div>
  );
}
