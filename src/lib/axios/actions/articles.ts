"use server";

import { DeletePayload } from "@/types/data";
import axiosInstance from "../instance";

export async function fetchArticles(page: number) {
  const instance = await axiosInstance();
  try {
    const res = await instance.get(`/api/articles/?page=${page}`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message); // Memperbaiki akses pesan kesalahan
    } else {
      console.log("An unknown error occurred"); // Menangani kesalahan yang tidak terduga
    }
  }
}
export async function getArticleBySlug(slug?: string) {
  const instance = await axiosInstance();
  try {
    const res = await instance.get(`/api/articles/${slug}`);
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("NOT_FOUND");
    }
    throw error;
  }
}

export async function bulkDeleteArticle(ids: String[]) {
  const instance = await axiosInstance();

  try {
    const res = await instance.delete(`/api/articles/bulk-delete/`, {
      data: {
        ids: ids,
      },
    });

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message); // Memperbaiki akses pesan kesalahan
    } else {
      console.log("An unknown error occurred"); // Menangani kesalahan yang tidak terduga
    }
  }
}

export async function deleteMultipleAction({ url, data }: DeletePayload) {
  const instance = await axiosInstance();

  try {
    const res = await instance.delete(url, { data });
    console.log(res.data);

    return res.data;
  } catch (error: any) {
    throw {
      status: error.response?.status,
      data: error.response?.data,
      message: error.response?.data?.detail || "Gagal menghapus data",
    };
  }
}

export async function deleteBySlugAction(slug: String) {
  const instance = await axiosInstance();

  try {
    const res = await instance.delete(`/api/articles/${slug}/`);
    return res.data;
  } catch (error: any) {
    throw {
      message: error.message || "Gagal menghapus data",
    };
  }
}

export const postArticle = async (formData: FormData) => {
  const instance = await axiosInstance();
  try {
    const res = await instance.post(`/api/articles/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message); // Memperbaiki akses pesan kesalahan
    } else {
      console.log("An unknown error occurred"); // Menangani kesalahan yang tidak terduga
    }
  }
};

export const editArticle = async (formData: FormData, slug: string) => {
  const instance = await axiosInstance();
  try {
    const res = await instance.patch(`/api/articles/${slug}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message); // Memperbaiki akses pesan kesalahan
    } else {
      console.log("An unknown error occurred"); // Menangani kesalahan yang tidak terduga
    }
  }
};
