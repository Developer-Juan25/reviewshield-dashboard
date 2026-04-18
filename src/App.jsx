import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Onboarding from "./components/Onboarding";

function SuccessPage() {
  const { t } = useTranslation();
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
            {t("success.plan")}
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
  const isSuccess = window.location.pathname === "/success";

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

  if (!user) return <Login />;

  if (!hasSettings) {
    return (
      <Onboarding
        user={user}
        onComplete={() => setHasSettings(true)}
      />
    );
  }

  return <Dashboard user={user} />;
}
