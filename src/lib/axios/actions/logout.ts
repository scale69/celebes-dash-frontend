"use server";

import { useAuthStore } from "@/lib/authStore";
import axiosInstance from "../instance";
import { headers } from "next/headers";

export const handleLogout = async () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  window.location.href = `${backendUrl}auth/logout/`;
  // await api.post("/api/logout/")
  const instance = await axiosInstance();
  // await instance.get(`${backendUrl}auth/logout/`, { withCredentials: true });
  useAuthStore.getState().clearAuth();
  // window.location.href = "/login";
};
