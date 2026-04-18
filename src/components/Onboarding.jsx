import { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const PLATFORMS = [
  {
    key: "google",
    label: "Google Reviews",
    icon: "🔍",
    description: "La plataforma #1 mundial",
    available: true,
  },
  {
    key: "facebook",
    label: "Facebook Reviews",
    icon: "📘",
    description: "Ideal para negocios locales",
    available: false,
  },
  {
    key: "yelp",
    label: "Yelp",
    icon: "⭐",
    description: "Muy popular en USA & Canada",
    available: false,
  },
  {
    key: "tripadvisor",
    label: "TripAdvisor",
    icon: "✈️",
    description: "Esencial para restaurantes y spas",
    available: false,
  },
  {
    key: "trustpilot",
    label: "Trustpilot",
    icon: "🌟",
    description: "Líder en mercado europeo",
    available: false,
  },
];

const STEPS = ["welcome", "business", "platforms", "done"];

export default function Onboarding({ user, onComplete }) {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    alertEmail: user?.email || "",
    googleBusinessId: "",
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
  const canNextBusiness = form.businessName.trim().length > 0;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", user.uid), {
        ...form,
        plan: "free",
        ownerId: user.uid,
        ownerEmail: user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      onComplete();
    } catch (err) {
      console.error("Error saving onboarding:", err);
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="text-2xl">🛡️</span>
            <span className="text-white font-bold text-xl tracking-tight">ReviewShield</span>
          </div>
          {currentStep !== "welcome" && currentStep !== "done" && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Configuración</span>
                <span>Paso {step} de {STEPS.length - 2}</span>
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
                Bienvenido a ReviewShield
              </h1>
              <p className="text-gray-400 text-sm mb-2">
                Hola,{" "}
                <span className="text-white font-medium">{user?.email}</span>
              </p>
              <p className="text-gray-500 text-sm mb-8">
                Configura tu negocio en 2 minutos y empieza a monitorear tus reseñas automáticamente con IA.
              </p>
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { icon: "📊", label: "Monitoreo 24/7" },
                  { icon: "🤖", label: "Respuestas con IA" },
                  { icon: "🔔", label: "Alertas al instante" },
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
                Empezar configuración →
              </button>
            </div>
          )}

          {/* STEP 1 — Business Data */}
          {currentStep === "business" && (
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Tu negocio</h2>
              <p className="text-gray-500 text-sm mb-6">
                Cuéntanos sobre tu negocio para personalizar el monitoreo.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Nombre del negocio <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={form.businessName}
                    onChange={handleChange}
                    placeholder="Ej. The Golden Fork Restaurant"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Email para alertas
                  </label>
                  <input
                    type="email"
                    name="alertEmail"
                    value={form.alertEmail}
                    onChange={handleChange}
                    placeholder="owner@tunegocio.com"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Google Business ID
                    <span className="text-gray-600 ml-2 text-xs">
                      (opcional — puedes agregarlo después)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="googleBusinessId"
                    value={form.googleBusinessId}
                    onChange={handleChange}
                    placeholder="Ej. 15172862745724499656"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
                  />
                  <p className="text-gray-600 text-xs mt-1">
                    Encuéntralo en la URL de tu perfil de Google Business
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setStep(0)}
                  className="px-5 py-3 rounded-xl text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 text-sm transition"
                >
                  ← Atrás
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!canNextBusiness}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition text-sm"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Platforms */}
          {currentStep === "platforms" && (
            <div>
              <h2 className="text-xl font-bold text-white mb-1">
                Plataformas a monitorear
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Google Reviews ya está activo. Más plataformas llegando pronto.
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
                        <p className="text-white text-sm font-medium">{p.label}</p>
                        <p className="text-gray-500 text-xs">{p.description}</p>
                      </div>
                    </div>
                    {p.available ? (
                      <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium shrink-0">
                        ✓ Activo
                      </span>
                    ) : (
                      <span className="bg-gray-700 text-gray-400 text-xs px-3 py-1 rounded-full shrink-0">
                        Próximamente
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
                  ← Atrás
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition text-sm"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Done */}
          {currentStep === "done" && (
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                ¡Todo listo!
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                <span className="text-white font-medium">{form.businessName}</span> está configurado.
                El sistema comenzará a analizar tus reseñas automáticamente.
              </p>
              <div className="bg-gray-800 rounded-xl p-4 mb-8 text-left space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">
                    Negocio:{" "}
                    <strong className="text-white">{form.businessName}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">
                    Alertas a:{" "}
                    <strong className="text-white">{form.alertEmail}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">
                    Plataforma:{" "}
                    <strong className="text-white">Google Reviews</strong>
                  </span>
                </div>
              </div>
              <button
                onClick={handleFinish}
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition"
              >
                {saving ? "Guardando..." : "Ir al dashboard →"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
