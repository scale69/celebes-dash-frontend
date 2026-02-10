import "server-only";

import axiosInstance from "@/lib/axios/instance";
import { cache } from "react";

export const AuthUser = cache(async () => {
  const instance = await axiosInstance();
  try {
    const user = await instance.get("/api/users/me/");
    if (!user.data) return null;

    return user.data;
  } catch (error) {
    return null;
  }
});
