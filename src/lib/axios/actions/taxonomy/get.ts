"use server";
import axiosInstance from "../../instance";

export async function fetchArticleStats() {
  const instance = await axiosInstance();
  try {
    const res = await instance.get(`/api/articles/stats/`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message); // Memperbaiki akses pesan kesalahan
    } else {
      console.log("An unknown error occurred"); // Menangani kesalahan yang tidak terduga
    }
  }
}
