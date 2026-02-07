"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "./get";

export function useUser() {
  const { data } = useQuery({
    queryKey: ["current-user"],
    queryFn: fetchMe,
    retry: false,
    // suspense: false,
    staleTime: Infinity,
  });

  return {
    user: data ?? null, // ← INI KUNCI
  };
}
