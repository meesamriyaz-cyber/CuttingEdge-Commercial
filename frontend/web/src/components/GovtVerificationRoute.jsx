import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function GovtVerificationRoute({ children }) {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to="/login" replace />;

  // If user is admin, allow access (admins don't need verification)
  if (user.roles?.includes("admin")) {
    return children;
  }

  // If user has no clientType (pure admin), allow access
  if (!user.clientType) {
    return children;
  }

  // Check if user is a government client and not verified
  if (
    user.clientType === "PUBLIC" &&
    user.govtValidationStatus !== "VERIFIED"
  ) {
    return <Navigate to="/verify" replace />;
  }

  return children;
}
