import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";

/**
 * Requires BOTH an active session AND role === "admin". A logged-in
 * non-admin user is bounced to home rather than to /login (they don't need
 * to log in again — they simply aren't allowed here).
 */
export default function AdminRoute() {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="h-8 w-8 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}
