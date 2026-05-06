import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import PreviewPage from "./pages/PreviewPage.jsx";
import PublicPortfolioPage from "./pages/PublicPortfolioPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/login" element={<AuthPage initialMode="login" />} />
      <Route path="/signup" element={<AuthPage initialMode="signup" />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/preview"
        element={
          <ProtectedRoute>
            <PreviewPage />
          </ProtectedRoute>
        }
      />
      <Route path="/auth" element={<Navigate to="/" replace />} />
      <Route path="/:username" element={<PublicPortfolioPage />} />
    </Routes>
  );
}
