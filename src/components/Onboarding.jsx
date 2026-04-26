import { useState } from "react";
import { useTranslation } from "react-i18next";
import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const PLATFORMS = [
  {
    key: "google",
    labelKey: "settings.google",
    icon: "🔍",
    descriptionKey: "onboarding.platforms.googleDesc",
    available: true,
  },
  {
    key: "yelp",
    labelKey: "settings.yelp",
    icon: "⭐",
    descriptionKey: "onboarding.platforms.yelpDesc",
    available: false,
  },
  {
    key: "tripadvisor",
    labelKey: "settings.tripadvisor",
    icon: "✈️",
    descriptionKey: "onboarding.platforms.tripadvisorDesc",
    available: false,
  },
  {
    key: "facebook",
    labelKey: "settings.facebook",
    icon: "📘",
    descriptionKey: "onboarding.platforms.facebookDesc",
    available: false,
  },
  {
    key: "trustpilot",
    labelKey: "settings.trustpilot",
    icon: "🌟",
    descriptionKey: "onboarding.platforms.trustpilotDesc",
    available: false,
  },
];

const STEPS = ["welcome", "business", "platforms", "done"];

export default function Onboarding({ user, onComplete }) {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    alertEmail: user?.email || "",
    businessCity: "",
    businessAddress: "",
    platforms: {
      google: true,
      facebook: false,
      yelp: false,
      tripadvisor: false,
      trustpilot: false,
    },
  });

  const currentStep = STEPS[step];
  const progress = (step / (STEPS.length - 2)) * 100;
  const canNextBusiness = form.businessName.trim().length > 0 && form.businessCity.trim().length > 0;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      const now = new Date();
      const trialEndsAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();
      await setDoc(doc(db, "settings", user.uid), {
        ...form,
        plan: "trial",
        trialStartedAt: now.toISOString(),
        trialEndsAt,
        ownerId: user.uid,
        ownerEmail: user.email,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });

      // Fire welcome email — non-blocking, failure doesn't affect onboarding flow
      const onboardingUrl = import.meta.env.VITE_N8N_ONBOARDING_URL;
      if (onboardingUrl) {
        fetch(onboardingUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessName: form.businessName,
            alertEmail: form.alertEmail,
            userId: user.uid,
            language: i18n.language?.slice(0, 2) || "en",
          }),
        }).catch(() => {});
      }

      onComplete();
    } catch (err) {
      console.error("Error saving onboarding:", err);
      setSaving(false);
    }
  };

  // Platform descriptions (not in i18n to keep them simple)
  const platformDescriptions = {
    google: "Google Reviews",
    facebook: "Facebook Reviews",
    yelp: "Yelp",
    tripadvisor: "TripAdvisor",
    trustpilot: "Trustpilot",
  };

  const handleExit = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-1">
            <button
              onClick={handleExit}
              className="text-gray-600 hover:text-gray-400 text-sm transition"
            >
              ← {t("onboarding.exit")}
            </button>
            <div className="inline-flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              <span className="text-white font-bold text-xl tracking-tight">ReviewShield</span>
            </div>
            <div className="w-16" /> {/* spacer for centering */}
          </div>
          {currentStep !== "welcome" && currentStep !== "done" && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{t("onboarding.setup")}</span>
                <span>{t("onboarding.step")} {step} {t("onboarding.of")} {STEPS.length - 2}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">

          {/* STEP 0 — Welcome */}
          {currentStep === "welcome" && (
            <div className="text-center">
              <div className="text-6xl mb-4">👋</div>
              <h1 className="text-2xl font-bold text-white mb-3">
                {t("onboarding.welcome.title")}
              </h1>
              <p className="text-gray-400 text-sm mb-2">
                {t("login.title")},{" "}
                <span className="text-white font-medium">{user?.email}</span>
              </p>
              <p className="text-gray-500 text-sm mb-8">
                {t("onboarding.welcome.subtitle")}
              </p>
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { icon: "📊", label: t("onboarding.welcome.feature1") },
                  { icon: "🤖", label: t("onboarding.welcome.feature2") },
                  { icon: "🔔", label: t("onboarding.welcome.feature3") },
                ].map((f) => (
                  <div key={f.label} className="bg-gray-800 rounded-xl p-3 text-center">
                    <div className="text-2xl mb-1">{f.icon}</div>
                    <p className="text-gray-400 text-xs">{f.label}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep(1)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition"
              >
                {t("onboarding.welcome.btn")}
              </button>
            </div>
          )}

          {/* STEP 1 — Business Data */}
          {currentStep === "business" && (
            <div>
              <h2 className="text-xl font-bold text-white mb-1">{t("onboarding.business.title")}</h2>
              <p className="text-gray-500 text-sm mb-6">
                {t("onboarding.business.subtitle")}
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    {t("onboarding.business.nameLabel")} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={form.businessName}
                    onChange={handleChange}
                    placeholder={t("onboarding.business.namePlaceholder")}
                    maxLength={100}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    {t("onboarding.business.emailLabel")}
                  </label>
                  <input
                    type="email"
                    name="alertEmail"
                    value={form.alertEmail}
                    onChange={handleChange}
                    placeholder={t("onboarding.business.emailPlaceholder")}
                    maxLength={254}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    {t("onboarding.business.cityLabel")} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessCity"
                    value={form.businessCity}
                    onChange={handleChange}
                    placeholder={t("onboarding.business.cityPlaceholder")}
                    maxLength={100}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    {t("onboarding.business.addressLabel")}
                    <span className="text-gray-600 ml-2 text-xs">
                      {t("onboarding.business.addressOptional")}
                    </span>
                  </label>
                  <input
                    type="text"
                    name="businessAddress"
                    value={form.businessAddress}
                    onChange={handleChange}
                    placeholder={t("onboarding.business.addressPlaceholder")}
                    maxLength={200}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
                  />
                  <p className="text-gray-600 text-xs mt-1.5">
                    💡 {t("onboarding.business.addressHint")}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setStep(0)}
                  className="px-5 py-3 rounded-xl text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 text-sm transition"
                >
                  {t("onboarding.business.back")}
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!canNextBusiness}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition text-sm"
                >
                  {t("onboarding.business.next")}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Platforms */}
          {currentStep === "platforms" && (
            <div>
              <h2 className="text-xl font-bold text-white mb-1">
                {t("onboarding.platforms.title")}
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                {t("onboarding.platforms.subtitle")}
              </p>
              <div className="space-y-3">
                {PLATFORMS.map((p) => (
                  <div
                    key={p.key}
                    className={`flex items-center justify-between p-4 rounded-xl border transition ${
                      p.available
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-800 bg-gray-800/50 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{p.icon}</span>
                      <div>
                        <p className="text-white text-sm font-medium">{platformDescriptions[p.key]}</p>
                      </div>
                    </div>
                    {p.available ? (
                      <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium shrink-0">
                        {t("onboarding.platforms.active")}
                      </span>
                    ) : (
                      <span className="bg-gray-700 text-gray-400 text-xs px-3 py-1 rounded-full shrink-0">
                        {t("onboarding.platforms.comingSoon")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 text-sm transition"
                >
                  {t("onboarding.platforms.back")}
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition text-sm"
                >
                  {t("onboarding.platforms.next")}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Done */}
          {currentStep === "done" && (
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                {t("onboarding.done.title")}
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                <span className="text-white font-medium">{form.businessName}</span>{" "}
                {t("onboarding.done.subtitle")}
              </p>
              <div className="bg-gray-800 rounded-xl p-4 mb-8 text-left space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">
                    {t("onboarding.done.business")}:{" "}
                    <strong className="text-white">{form.businessName}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">
                    {t("onboarding.done.alerts")}:{" "}
                    <strong className="text-white">{form.alertEmail}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">
                    {t("onboarding.done.city")}:{" "}
                    <strong className="text-white">{form.businessCity}</strong>
                  </span>
                </div>
              </div>
              <button
                onClick={handleFinish}
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition"
              >
                {saving ? t("onboarding.done.saving") : t("onboarding.done.btn")}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
