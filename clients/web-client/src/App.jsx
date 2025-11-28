import AppRouter from "./router/AppRouter.jsx";
import DebugAuthPanel from "./components/DebugAuthPanel.jsx";


export default function App() {
  return (
    <>
      <AppRouter />
      <DebugAuthPanel />  {/* 👈 Muestra estado auth en vivo */}
    </>
  );
}
