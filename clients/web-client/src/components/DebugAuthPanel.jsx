// src/components/DebugAuthPanel.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLocation } from "react-router-dom";

export default function DebugAuthPanel() {
  const { user, token } = useAuth();
  const location = useLocation();
  const [log, setLog] = useState([]);

  useEffect(() => {
    setLog(prev => [
      ...prev.slice(-8),
      `📌 Path: ${location.pathname} | 👤 Role: ${user?.role} | 🔑 Token: ${token ? "OK" : "NO"}`
    ]);
  }, [location.pathname, user, token]);

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-3 rounded-2xl w-64 shadow-lg">
      <p className="font-bold mb-1">Auth Debug</p>
      {log.map((line, i) => <p key={i} className="truncate">{line}</p>)}
    </div>
  );
}
