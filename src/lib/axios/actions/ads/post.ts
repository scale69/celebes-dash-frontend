"use server";

import axiosInstance from "../../instance";

export const postAds = async (formData: FormData) => {
  const instance = await axiosInstance();
  try {
    const res = await instance.post(`/api/ads/`, formData, {
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
