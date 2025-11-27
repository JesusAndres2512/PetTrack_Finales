import AppRouter from "./router/AppRouter.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import DebugAuthPanel from "./components/DebugAuthPanel.jsx";


export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <DebugAuthPanel />  {/* 👈 Muestra estado auth en vivo */}
    </AuthProvider>
  );
}
