import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({ children }) {
  const { user, isInit } = useAuthStore();
    //const user = useAuthStore((state) => state.user);


  if (!isInit) return null; // wait for session restore

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
