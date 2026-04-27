import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Onboarding from "./components/Onboarding";
import LandingPage from "./components/LandingPage";

function SuccessPage() {
  const { t } = useTranslation();
  const raw = localStorage.getItem("pendingPlan") || "starter";

  // Prevent indexing of the post-payment success page
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);
  localStorage.removeItem("pendingPlan");
  const planName = raw.charAt(0).toUpperCase() + raw.slice(1);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center px-6">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-white mb-3">
          {t("success.title")}
        </h1>
        <p className="text-gray-400 mb-2">
          {t("success.subtitle")}{" "}
          <span className="text-blue-400 font-semibold">
            ReviewShield {planName}
          </span>{" "}
          {t("success.detail")}
        </p>
        <p className="text-gray-500 text-sm mb-8">
          {t("success.monitoring")}
        </p>
        <a
          href="/"
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition inline-block"
        >
          {t("success.btn")}
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasSettings, setHasSettings] = useState(null);

  const path = window.location.pathname;
  const isSuccess = path === "/success";
  const isLogin = path === "/login";

  useEffect(() => {
    if (isSuccess) return;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const snap = await getDoc(doc(db, "settings", currentUser.uid));
        setHasSettings(snap.exists() && !!snap.data()?.businessName);
      } else {
        setHasSettings(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isSuccess]);

  if (isSuccess) return <SuccessPage />;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  // Authenticated users go straight to app regardless of path
  if (user) {
    if (!hasSettings) {
      return <Onboarding user={user} onComplete={() => setHasSettings(true)} />;
    }
    return <Dashboard user={user} />;
  }

  // Unauthenticated routing
  if (isLogin) return <Login />;
  return <LandingPage />;
}
