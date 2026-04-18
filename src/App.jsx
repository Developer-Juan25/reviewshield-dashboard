import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";

function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center px-6">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-white mb-3">
          ¡Suscripción activada!
        </h1>
        <p className="text-gray-400 mb-2">
          Tu plan{" "}
          <span className="text-blue-400 font-semibold">
            ReviewShield Starter
          </span>{" "}
          ya está activo.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          El monitoreo de reseñas comenzará automáticamente.
        </p>
        <a
          href="/"
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition inline-block"
        >
          Ir al Dashboard
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isSuccess = window.location.pathname === "/success";

  useEffect(() => {
    if (isSuccess) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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

  return user ? <Dashboard user={user} onLogout={() => {}} /> : <Login />;
}
