"use client";

import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { DeletePayload } from "@/types/data";
import { deleteMultipleAction } from "./articles";

export function useDeleteAction(): UseMutationResult<
  any,
  any,
  DeletePayload,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMultipleAction,

    onSuccess: (_, variabel) => {
      toast.success("Berhasil menghapus");
      if (variabel.url.includes("articles")) {
        queryClient.invalidateQueries({ queryKey: ["articles"] });
        queryClient.invalidateQueries({ queryKey: ["article-stats"] });
      }
    },
    onError: (error: any) => {
      try {
        // Parse error message jika berupa JSON string
        const errorObj =
          typeof error.message === "string" ? JSON.parse(error.message) : error;

        const status = errorObj?.status;
        const errorData = errorObj?.data;
        const detail = errorData?.detail || errorObj?.message;

        console.log("Error detail:", detail);
        console.log("Full error data:", errorData);

        if (status === 403) {
          if (detail?.toLowerCase().includes("publish")) {
            toast.error("Hanya admin yang bisa menghapus data publish");
            return;
          }
          toast.error("Akses ditolak");
          return;
        }

        toast.error("Gagal menghapus data");
      } catch {
        // Fallback jika parsing gagal
        // toast.error("Terjadi kesalahan");
        toast.error("Hanya admin yang bisa menghapus data publish");
      }
    },
  });
}
