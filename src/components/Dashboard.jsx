import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { signOut } from "firebase/auth";
import ReviewCard from "./ReviewCard";
import StatsBar from "./StatsBar";
import Settings from "./Settings";

export default function Dashboard({ user }) {
  const [filter, setFilter] = useState("all");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("dashboard");

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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">🛡️</span>
          <span className="font-bold text-lg tracking-tight">ReviewShield</span>
          <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-full">
            The Golden Fork · Chicago
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm hidden md:block">
            {user?.email}
          </span>
          <button
            onClick={() => signOut(auth)}
            className="text-gray-500 hover:text-white text-sm transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Nav tabs */}
      <div className="border-b border-gray-800 bg-gray-900 px-6">
        <div className="flex gap-6 max-w-5xl mx-auto">
          {[
            { key: "dashboard", label: "📊 Reviews" },
            { key: "settings", label: "⚙️ Settings" },
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
            {["all", "negative", "positive"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {f === "all"
                  ? "All Reviews"
                  : f === "negative"
                    ? "⚠️ Negative"
                    : "✅ Positive"}
              </button>
            ))}
            <span className="ml-auto text-gray-500 text-sm self-center">
              {filtered.length} review{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading && (
            <div className="text-center py-20 text-gray-500">
              <p className="text-4xl mb-4">⏳</p>
              <p>Loading reviews from Firebase...</p>
            </div>
          )}

          {!loading && reviews.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <p className="text-4xl mb-4">📭</p>
              <p>No reviews yet. N8N will populate this automatically.</p>
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
