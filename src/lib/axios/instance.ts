import "server-only";

import axios from "axios";
import { cookies } from "next/headers";
import { useAuthStore } from "../authStore";

const axiosInstance = async () => {
  // Ambil token dari cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  // Buat instance axios
  const instance = axios.create({
    baseURL: process.env.BACKEND_API_URL,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }), // kalau token ada
    },
  });

  return instance;
};

export default axiosInstance;
