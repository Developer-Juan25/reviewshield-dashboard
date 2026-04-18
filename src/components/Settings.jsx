import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// URL del webhook N8N para crear sesión de Stripe
// Configura esta variable en Vercel: VITE_N8N_CHECKOUT_URL
const N8N_CHECKOUT_URL = import.meta.env.VITE_N8N_CHECKOUT_URL || "";

export default function Settings({ user }) {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [plan, setPlan] = useState("free");
  const [form, setForm] = useState({
    businessName: "",
    alertEmail: user?.email || "",
    googleBusinessId: "",
    platforms: {
      google: true,
      yelp: false,
      facebook: false,
    },
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const ref = doc(db, "settings", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setForm((prev) => ({
            ...prev,
            ...data,
            platforms: data.platforms ?? prev.platforms,
          }));
          setPlan(data.plan || "free");
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      }
      setLoading(false);
    };
    if (user?.uid) loadSettings();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlatform = (p) => {
    setForm({
      ...form,
      platforms: { ...form.platforms, [p]: !form.platforms[p] },
    });
  };

  const handleSave = async () => {
    try {
      const ref = doc(db, "settings", user.uid);
      await setDoc(ref, {
        ...form,
        updatedAt: new Date().toISOString(),
        ownerId: user.uid,
        ownerEmail: user.email,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
    }
  };

  const handleUpgrade = async () => {
    if (!N8N_CHECKOUT_URL) {
      alert("Checkout not configured. Add VITE_N8N_CHECKOUT_URL in Vercel.");
      return;
    }
    setUpgrading(true);
    try {
      const res = await fetch(N8N_CHECKOUT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, email: user.email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No URL returned from checkout");
      }
    } catch (err) {
      console.error("Error creating checkout session:", err);
      alert("Error starting payment. Please try again.");
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500 text-sm">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-white mb-2">{t("settings.title")}</h2>
      <p className="text-gray-400 text-sm mb-8">
        {t("settings.subtitle")}
      </p>

      <div className="space-y-6">
        {/* Business Information */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">
            {t("settings.businessName")}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                {t("settings.businessName")}
              </label>
              <input
                type="text"
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                placeholder="e.g. The Golden Fork Restaurant"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                {t("settings.alertEmail")}
              </label>
              <input
                type="email"
                name="alertEmail"
                value={form.alertEmail}
                onChange={handleChange}
                placeholder="owner@yourbusiness.com"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                {t("settings.googleId")}
                <span className="text-gray-600 ml-2 text-xs">
                  ({t("settings.googleIdHint")})
                </span>
              </label>
              <input
                type="text"
                name="googleBusinessId"
                value={form.googleBusinessId}
                onChange={handleChange}
                placeholder="e.g. 15172862745724499656"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Platforms to Monitor */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">
            {t("settings.platforms")}
          </h3>
          <div className="space-y-3">
            {[
              { key: "google", label: t("settings.google"), available: true },
              { key: "yelp", label: t("settings.yelp"), available: false },
              { key: "facebook", label: t("settings.facebook"), available: false },
            ].map((p) => (
              <div
                key={p.key}
                className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-white text-sm">{p.label}</span>
                  {!p.available && (
                    <span className="bg-gray-800 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                      {t("settings.comingSoon")}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => p.available && handlePlatform(p.key)}
                  className={`w-12 h-6 rounded-full transition relative ${
                    form.platforms[p.key] && p.available
                      ? "bg-blue-600"
                      : "bg-gray-700"
                  } ${!p.available ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      form.platforms[p.key] && p.available ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Current Plan */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">{t("settings.plan")}</h3>
              {plan === "starter" ? (
                <div className="mt-1">
                  <p className="text-green-400 text-sm">✅ {t("settings.starter")} — $49/month</p>
                  <p className="text-gray-500 text-xs mt-0.5">Active subscription</p>
                </div>
              ) : (
                <div className="mt-1">
                  <p className="text-gray-400 text-sm">{t("settings.free")} — No active subscription</p>
                  <p className="text-gray-600 text-xs mt-0.5">
                    {t("settings.upgrade")} for automatic monitoring
                  </p>
                </div>
              )}
            </div>
            {plan !== "starter" && (
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition"
              >
                {upgrading ? "⏳ Redirecting..." : "Upgrade $49/mo"}
              </button>
            )}
          </div>
        </div>

        <button
          onClick={handleSave}
          className={`w-full font-semibold py-4 rounded-xl transition text-sm ${
            saved
              ? "bg-green-600 text-white"
              : "bg-blue-600 hover:bg-blue-500 text-white"
          }`}
        >
          {saved ? t("settings.saved") : t("settings.save")}
        </button>
      </div>
    </div>
  );
}
