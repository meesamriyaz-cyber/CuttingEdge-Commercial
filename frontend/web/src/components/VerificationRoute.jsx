import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function VerificationRoute({ children }) {
  const user = useAuthStore((state) => state.user);

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is not a government client, redirect to home
  if (user.clientType !== "PUBLIC") {
    return <Navigate to="/" replace />;
  }

  // If government client is already verified, redirect to enquiries
  if (user.govtValidationStatus === "VERIFIED") {
    return <Navigate to="/enquiries" replace />;
  }

  // If government client is not verified, show the verification page
  return children;
}
