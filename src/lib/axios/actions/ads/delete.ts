"use server"

import axiosInstance from "../../instance";

export const deleteAds = async (id: string) => {
    const instance = await axiosInstance();
    try {
      const res = await instance.delete(`ads/${id}/`);
      return res.data;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message); // Memperbaiki akses pesan kesalahan
      } else {
        console.log("An unknown error occurred"); // Menangani kesalahan yang tidak terduga
      }
    }
  }