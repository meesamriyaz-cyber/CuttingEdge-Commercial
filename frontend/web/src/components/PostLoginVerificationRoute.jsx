// PostLoginVerificationRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function PostLoginVerificationRoute({ children }) {
  const user = useAuthStore((state) => state.user);

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If user is admin, allow access (admins don't need verification)
  if (user.roles?.includes("admin")) {
    return children;
  }

  // If user has no clientType (pure admin), allow access
  if (!user.clientType) {
    return children;
  }

  // If user is not a government client, allow normal access
  if (user.clientType !== "PUBLIC" || !user.clientType) {
    return children;
  }

  // If government client is already verified, allow access
  if (user.govtValidationStatus === "VERIFIED") {
    return children;
  }

  // If government client is not verified, redirect to verification page
  return <Navigate to="/verify-account" replace />;
}
