import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("billstack_token");
  const isLoggedIn = localStorage.getItem("billstack_auth") === "true";

  return token && isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;