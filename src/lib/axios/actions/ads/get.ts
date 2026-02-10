"use server";
import axiosInstance from "../../instance";

export async function fetchAds() {
  const instance = await axiosInstance();
  try {
    const res = await instance.get(`/api/ads/`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message); // Memperbaiki akses pesan kesalahan
    } else {
      console.log("An unknown error occurred"); // Menangani kesalahan yang tidak terduga
    }
  }
}

// import api from "@/lib/axios/api";

// export async function fetchAds() {
//   try {
//     const res = await api.get("ads/");
//     return res.data;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }
