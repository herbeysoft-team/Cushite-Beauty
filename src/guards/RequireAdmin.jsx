import { Navigate, Outlet } from "react-router-dom";

function RequireAdmin() {
  // Temporary
  const isAdmin = true;

  return isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
}

export default RequireAdmin;