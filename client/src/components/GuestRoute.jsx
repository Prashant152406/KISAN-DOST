import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";

/**
 * Inverse of ProtectedRoute: for pages that only make sense when logged OUT
 * (login, register, verify-otp, forgot/reset password). If a session is
 * already active, these routes just bounce the user back in instead of
 * showing a form that would only error out anyway.
 */
export default function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  // Don't redirect on the very first render while /auth/me is still in
  // flight — that would flash the page content before bouncing away.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="h-8 w-8 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    // If they were redirected here mid-flow from somewhere specific, send
    // them back there; otherwise just go home.
    const redirectTo = location.state?.from?.pathname || "/";
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
