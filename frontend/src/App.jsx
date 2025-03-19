import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/route/ProtectedRoute";
import UnauthenticatedRoute from "./components/route/UnauthenticatedRoute";

const App = () => {
  return (
    <AuthProvider>
        <Routes>

          <Route element={<UnauthenticatedRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </AuthProvider>
  );
};

export default App;