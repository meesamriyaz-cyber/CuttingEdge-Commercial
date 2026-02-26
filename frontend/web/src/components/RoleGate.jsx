import { useAuthStore } from "../store/authStore";

export default function RoleGate({ allow = [], children }) {
  const { user } = useAuthStore();

  if (!user) return null;

  if (!allow.includes(user.clientType)) return null;

  return children;
}
