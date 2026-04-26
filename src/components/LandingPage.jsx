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
    { icon: "🔔", title: t("landing.features.alerts.title"), desc: t("landing.features.alerts.desc") },
    { icon: "🤖", title: t("landing.features.ai.title"), desc: t("landing.features.ai.desc") },
    { icon: "📊", title: t("landing.features.trends.title"), desc: t("landing.features.trends.desc") },
  ];

  const plans = [
    {
      name: "Starter",
      price: "$49",
      desc: t("landing.pricing.starter.desc"),
      features: t("landing.pricing.starter.features", { returnObjects: true }),
      cta: t("landing.pricing.starter.cta"),
      highlight: false,
      border: "border-gray-700/60 hover:border-gray-500/60",
    },
    {
      name: "Pro",
      price: "$99",
      desc: t("landing.pricing.pro.desc"),
      features: t("landing.pricing.pro.features", { returnObjects: true }),
      cta: t("landing.pricing.pro.cta"),
      highlight: true,
      badge: t("landing.pricing.popular"),
      border: "border-blue-500/70",
    },
    {
      name: "Agency",
      price: "$199",
      desc: t("landing.pricing.agency.desc"),
      features: t("landing.pricing.agency.features", { returnObjects: true }),
      cta: t("landing.pricing.agency.cta"),
      highlight: false,
      border: "border-gray-700/60 hover:border-purple-500/40",
    },
  ];

  return (
    <div className="min-h-screen bg-[#080a0f] text-white overflow-x-hidden">

      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#080a0f]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="ReviewShield" className="w-7 h-7" />
            <span className="text-lg font-bold tracking-tight">ReviewShield</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="text-gray-500 hover:text-white text-sm transition px-2 py-1 rounded"
            >
              {lang === "en" ? "🇪🇸 ES" : "🇺🇸 EN"}
            </button>
            <a href="/login" className="text-gray-400 hover:text-white text-sm transition px-3 py-1.5">
              {t("landing.nav.signIn")}
            </a>
            <a
              href="/login"
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition shadow-[0_0_18px_rgba(59,130,246,0.4)] hover:shadow-[0_0_26px_rgba(59,130,246,0.55)]"
            >
              {t("landing.nav.getStarted")}
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-28 px-6 overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-blue-600/[0.08] blur-[120px]" />
          <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full bg-purple-700/[0.07] blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[300px] rounded-full bg-blue-800/[0.06] blur-[90px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/[0.08] border border-blue-500/20 text-blue-400 text-xs font-medium px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shrink-0" />
            {t("landing.hero.badge")}
          </div>

          {/* H1 */}
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
            <span className="bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent">
              {t("landing.hero.h1")}
            </span>
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("landing.hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <a
              href="/login"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 rounded-xl transition text-base shadow-[0_0_32px_rgba(59,130,246,0.45)] hover:shadow-[0_0_44px_rgba(59,130,246,0.65)]"
            >
              {t("landing.hero.cta")}
            </a>
            <a href="#pricing" className="text-gray-500 hover:text-gray-300 text-sm transition">
              {t("landing.hero.seePricing")} →
            </a>
          </div>
          <p className="text-gray-600 text-xs">{t("landing.hero.noCc")}</p>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="border-y border-white/[0.05] bg-white/[0.015] py-5 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-gray-600 text-sm">
          <span>🍔 {t("landing.proof.restaurants")}</span>
          <span>💇 {t("landing.proof.salons")}</span>
          <span>🏨 {t("landing.proof.hotels")}</span>
          <span>🏥 {t("landing.proof.clinics")}</span>
          <span>🛍️ {t("landing.proof.retail")}</span>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("landing.features.title")}</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">{t("landing.features.subtitle")}</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 hover:border-blue-500/25 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/[0.04] group-hover:to-purple-600/[0.04] transition-all duration-500 rounded-2xl" />
              <div className="relative">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-white/[0.018] border-y border-white/[0.05] py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">{t("landing.how.title")}</h2>
          <div className="grid sm:grid-cols-3 gap-10 text-center">
            {[1, 2, 3].map((n) => (
              <div key={n}>
                <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_22px_rgba(59,130,246,0.45)]">
                  {n}
                </div>
                <h3 className="text-white font-semibold mb-2">{t(`landing.how.step${n}.title`)}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{t(`landing.how.step${n}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("landing.pricing.title")}</h2>
          <p className="text-gray-500 text-sm">{t("landing.pricing.subtitle")}</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border-2 ${plan.border} p-6 bg-white/[0.025] transition-all duration-300 ${
                plan.highlight ? "shadow-[0_0_50px_rgba(59,130,246,0.12)]" : ""
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold px-4 py-1 rounded-full shadow-[0_0_14px_rgba(59,130,246,0.5)] whitespace-nowrap">
                  {plan.badge}
                </div>
              )}
              <div className="mb-5">
                <p className="text-gray-400 text-sm font-medium mb-1">{plan.name}</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-gray-600 text-sm mb-1.5">/mo USD</span>
                </div>
                <p className="text-gray-500 text-xs">{plan.desc}</p>
              </div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {Array.isArray(plan.features) && plan.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-blue-400 mt-0.5 shrink-0">✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
              <a
                href="/login"
                className={`block text-center font-semibold py-2.5 rounded-xl transition text-sm ${
                  plan.highlight
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_18px_rgba(59,130,246,0.35)]"
                    : "bg-white/[0.06] hover:bg-white/10 border border-white/[0.08] text-white"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
        <p className="text-gray-700 text-xs text-center mt-6">{t("landing.pricing.note")}</p>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.05] py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="ReviewShield" className="w-5 h-5 opacity-70" />
            <span className="text-gray-600 text-sm">ReviewShield © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6 text-gray-600 text-sm">
            <a href="/login" className="hover:text-white transition">{t("landing.footer.login")}</a>
            <span>{t("landing.footer.powered")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
