import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Lemon Squeezy checkout URLs — direct links, no backend needed
const LS_CHECKOUT_URLS = {
  starter: "https://reviewshield-app.lemonsqueezy.com/checkout/buy/b3f90e82-e24e-4666-90bb-ad7e32eea4df",
  pro:     "https://reviewshield-app.lemonsqueezy.com/checkout/buy/7d70b9cd-0f71-4a06-aed8-93b2d74fb07b",
  agency:  "https://reviewshield-app.lemonsqueezy.com/checkout/buy/db08341f-bf8b-40f0-aa43-e6514444023f",
};

export default function Settings({ user }) {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [upgradingPlan, setUpgradingPlan] = useState(null);
  const [plan, setPlan] = useState("free");
  const [checkoutError, setCheckoutError] = useState(null);
  const [form, setForm] = useState({
    businessName: "",
    alertEmail: user?.email || "",
    googleBusinessId: "",
    platforms: {
      google: true,
      yelp: false,
      tripadvisor: false,
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

  const handleUpgrade = (targetPlan) => {
    const baseUrl = LS_CHECKOUT_URLS[targetPlan];
    if (!baseUrl) return;
    setUpgradingPlan(targetPlan);
    setCheckoutError(null);
    // Pre-fill email and pass userId + plan as custom metadata for the webhook
    const email = encodeURIComponent(user.email || "");
    const userId = encodeURIComponent(user.uid || "");
    const redirectUrl = encodeURIComponent("https://app.vykmorix.com");
    const url = `${baseUrl}?checkout[email]=${email}&checkout[custom][user_id]=${userId}&checkout[custom][plan]=${targetPlan}&redirect_url=${redirectUrl}`;
    localStorage.setItem("pendingPlan", targetPlan);
    window.location.href = url;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500 text-sm">{t("settings.loading")}</p>
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
            {t("settings.businessInfo")}
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
              { key: "google",      label: t("settings.google"),      available: true  },
              { key: "yelp",        label: t("settings.yelp"),        available: false },
              { key: "tripadvisor", label: t("settings.tripadvisor"), available: false },
              { key: "facebook",    label: t("settings.facebook"),    available: false },
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

        {/* Plans */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">{t("settings.plan")}</h3>
          <div className="space-y-3">
            {/* Starter */}
            <div className={`rounded-xl border p-4 transition ${plan === "starter" ? "border-green-500 bg-green-500/10" : "border-gray-700 bg-gray-800/50"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">{t("settings.starter")}</span>
                    <span className="text-gray-400 text-sm font-normal">— $49/mo</span>
                    {plan === "starter" && (
                      <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">{t("settings.currentPlan")}</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mt-1">{t("settings.starterDesc")}</p>
                </div>
                {plan !== "starter" && plan !== "pro" && plan !== "agency" && (
                  <button
                    onClick={() => handleUpgrade("starter")}
                    disabled={upgradingPlan !== null}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-medium px-3 py-1.5 rounded-lg transition shrink-0"
                  >
                    {upgradingPlan === "starter" ? t("settings.redirecting") : t("settings.upgradeBtn")}
                  </button>
                )}
              </div>
            </div>

            {/* Pro */}
            <div className={`rounded-xl border p-4 transition relative ${plan === "pro" ? "border-blue-500 bg-blue-500/10" : "border-gray-700 bg-gray-800/50"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">{t("settings.pro")}</span>
                    <span className="text-gray-400 text-sm font-normal">— $99/mo</span>
                    {plan === "pro" && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{t("settings.currentPlan")}</span>
                    )}
                    {plan !== "pro" && plan !== "agency" && (
                      <span className="bg-blue-900/60 text-blue-300 text-xs px-2 py-0.5 rounded-full">{t("settings.popularBadge")}</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mt-1">{t("settings.proDesc")}</p>
                </div>
                {plan !== "pro" && plan !== "agency" && (
                  <button
                    onClick={() => handleUpgrade("pro")}
                    disabled={upgradingPlan !== null}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-medium px-3 py-1.5 rounded-lg transition shrink-0"
                  >
                    {upgradingPlan === "pro" ? t("settings.redirecting") : t("settings.upgradePro")}
                  </button>
                )}
              </div>
            </div>

            {/* Agency */}
            <div className={`rounded-xl border p-4 transition ${plan === "agency" ? "border-purple-500 bg-purple-500/10" : "border-gray-700 bg-gray-800/50"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">{t("settings.agency")}</span>
                    <span className="text-gray-400 text-sm font-normal">— $199/mo</span>
                    {plan === "agency" && (
                      <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">{t("settings.currentPlan")}</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mt-1">{t("settings.agencyDesc")}</p>
                </div>
                {plan !== "agency" && (
                  <button
                    onClick={() => handleUpgrade("agency")}
                    disabled={upgradingPlan !== null}
                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-medium px-3 py-1.5 rounded-lg transition shrink-0"
                  >
                    {upgradingPlan === "agency" ? t("settings.redirecting") : t("settings.upgradeAgency")}
                  </button>
                )}
              </div>
            </div>
          </div>

          {checkoutError && (
            <p className="text-red-400 text-xs mt-3 text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3">
              ⚠️ {checkoutError}
            </p>
          )}
          {plan === "free" && !checkoutError && (
            <p className="text-gray-600 text-xs mt-3 text-center">{t("settings.upgradeHint")}</p>
          )}
          <p className="text-gray-700 text-xs mt-2 text-center">
            {t("settings.usdNote")}
          </p>
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
