"use server";

import axiosInstance from "../../instance";

export const deleteUser = async (id: string) => {
  const instance = await axiosInstance();
  try {
    const res = await instance.delete(`users/${id}/`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message); // Memperbaiki akses pesan kesalahan
    } else {
      console.log("An unknown error occurred"); // Menangani kesalahan yang tidak terduga
    }
  }
};
