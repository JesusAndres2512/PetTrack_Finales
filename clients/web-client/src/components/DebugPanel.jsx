import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function DebugPanel() {
  const { user, token } = useAuth();
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const interval = setInterval(() => setPath(window.location.pathname), 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white text-xs p-3 rounded-lg opacity-80 max-w-[260px]">
      <div><b>Ruta:</b> {path}</div>
      <div><b>Token:</b> {token ? "EXISTE ✅" : "NO EXISTE ❌"}</div>
      <div><b>User:</b> {user?.username || "null"}</div>
      <div><b>Rol:</b> {user?.role || "null"}</div>
    </div>
  );
}
