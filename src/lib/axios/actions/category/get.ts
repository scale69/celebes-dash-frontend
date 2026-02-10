"use server";
import axiosInstance from "../../instance";

export async function fetchCategory() {
  const instance = await axiosInstance();
  try {
    const res = await instance.get(`/api/categories/`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message); // Memperbaiki akses pesan kesalahan
    } else {
      console.log("An unknown error occurred"); // Menangani kesalahan yang tidak terduga
    }
  }
}
