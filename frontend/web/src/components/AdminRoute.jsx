import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function AdminRoute({ children }) {
  const { user, isInit } = useAuthStore();

  if (!isInit) return null;

  if (!user || !user.roles?.includes("admin")) {
    return <Navigate to="/" replace />;
  }

  return children;
}
