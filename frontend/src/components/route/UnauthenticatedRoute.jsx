import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UnauthenticatedRoute = () => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default UnauthenticatedRoute;