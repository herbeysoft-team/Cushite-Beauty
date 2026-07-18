import { Navigate, Outlet } from "react-router-dom";

function RequireAuth() {
  // Temporary
  const isAuthenticated = true;

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}

export default RequireAuth;