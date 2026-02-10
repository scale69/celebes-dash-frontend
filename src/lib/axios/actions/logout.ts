import { useAuthStore } from "@/lib/authStore";

export const handleLogout = async () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  window.location.href = `${backendUrl}/api/auth/logout/`;
  useAuthStore.getState().clearAuth();
};
