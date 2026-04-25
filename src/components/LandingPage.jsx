import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language?.slice(0, 2) || "en");

  const toggleLang = () => {
    const next = lang === "en" ? "es" : "en";
    i18n.changeLanguage(next);
    setLang(next);
  };

  const features = [
    {
      icon: "🔔",
      title: t("landing.features.alerts.title"),
      desc: t("landing.features.alerts.desc"),
    },
    {
      icon: "🤖",
      title: t("landing.features.ai.title"),
      desc: t("landing.features.ai.desc"),
    },
    {
      icon: "📊",
      title: t("landing.features.trends.title"),
      desc: t("landing.features.trends.desc"),
    },
  ];

  const plans = [
    {
      name: "Starter",
      price: "$49",
      desc: t("landing.pricing.starter.desc"),
      features: t("landing.pricing.starter.features", { returnObjects: true }),
      cta: t("landing.pricing.starter.cta"),
      color: "border-green-500",
      badge: null,
    },
    {
      name: "Pro",
      price: "$99",
      desc: t("landing.pricing.pro.desc"),
      features: t("landing.pricing.pro.features", { returnObjects: true }),
      cta: t("landing.pricing.pro.cta"),
      color: "border-blue-500",
      badge: t("landing.pricing.popular"),
    },
    {
      name: "Agency",
      price: "$199",
      desc: t("landing.pricing.agency.desc"),
      features: t("landing.pricing.agency.features", { returnObjects: true }),
      cta: t("landing.pricing.agency.cta"),
      color: "border-purple-500",
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* HEADER */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="ReviewShield" className="w-7 h-7" />
          <span className="text-lg font-bold text-white">ReviewShield</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="text-gray-400 hover:text-white text-sm transition px-2 py-1 rounded"
          >
            {lang === "en" ? "🇪🇸 ES" : "🇺🇸 EN"}
          </button>
          <a
            href="/login"
            className="text-gray-400 hover:text-white text-sm transition"
          >
            {t("landing.nav.signIn")}
          </a>
          <a
            href="/login"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            {t("landing.nav.getStarted")}
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-700/40 text-blue-400 text-sm px-4 py-1.5 rounded-full mb-8">
          <span>✨</span>
          <span>{t("landing.hero.badge")}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
          {t("landing.hero.h1")}
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          {t("landing.hero.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/login"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl transition text-base w-full sm:w-auto"
          >
            {t("landing.hero.cta")}
          </a>
          <a
            href="#pricing"
            className="text-gray-400 hover:text-white text-sm transition"
          >
            {t("landing.hero.seePricing")} →
          </a>
        </div>
        <p className="text-gray-600 text-xs mt-4">{t("landing.hero.noCc")}</p>
      </section>

      {/* SOCIAL PROOF BAR */}
      <section className="border-y border-gray-800 bg-gray-900/40 py-5 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-gray-500 text-sm">
          <span>🍔 {t("landing.proof.restaurants")}</span>
          <span>💇 {t("landing.proof.salons")}</span>
          <span>🏨 {t("landing.proof.hotels")}</span>
          <span>🏥 {t("landing.proof.clinics")}</span>
          <span>🛍️ {t("landing.proof.retail")}</span>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">
          {t("landing.features.title")}
        </h2>
        <p className="text-gray-400 text-center mb-12">
          {t("landing.features.subtitle")}
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gray-900/40 border-y border-gray-800 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("landing.how.title")}
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[1, 2, 3].map((n) => (
              <div key={n}>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
                  {n}
                </div>
                <h3 className="text-white font-semibold mb-2">
                  {t(`landing.how.step${n}.title`)}
                </h3>
                <p className="text-gray-400 text-sm">
                  {t(`landing.how.step${n}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">
          {t("landing.pricing.title")}
        </h2>
        <p className="text-gray-400 text-center mb-12">
          {t("landing.pricing.subtitle")}
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-gray-900 border-2 ${plan.color} rounded-2xl p-6 flex flex-col relative`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-white font-bold text-xl">{plan.name}</h3>
                <div className="flex items-end gap-1 mt-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 text-sm mb-1">/mo USD</span>
                </div>
                <p className="text-gray-400 text-sm mt-1">{plan.desc}</p>
              </div>
              <ul className="space-y-2 flex-1 mb-6">
                {Array.isArray(plan.features) &&
                  plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-green-400 mt-0.5">✓</span>
                      {feat}
                    </li>
                  ))}
              </ul>
              <a
                href="/login"
                className={`text-center font-semibold py-2.5 rounded-xl transition text-sm ${
                  plan.badge
                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-white"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
        <p className="text-gray-600 text-xs text-center mt-6">
          {t("landing.pricing.note")}
        </p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="ReviewShield" className="w-5 h-5" />
            <span className="text-gray-400 text-sm">
              ReviewShield © {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-6 text-gray-500 text-sm">
            <a href="/login" className="hover:text-white transition">
              {t("landing.footer.login")}
            </a>
            <span>{t("landing.footer.powered")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
