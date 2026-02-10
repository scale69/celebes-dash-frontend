"use server";

import axiosInstance from "../../instance";
export async function fetchMe() {
  const instance = await axiosInstance();
  try {
    const res = await instance.get(`/api/users/me/`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message); // Memperbaiki akses pesan kesalahan
    } else {
      console.log("An unknown error occurred"); // Menangani kesalahan yang tidak terduga
    }
  }
}

export async function fetchUser() {
  const instance = await axiosInstance();
  try {
    const res = await instance.get(`/api/users/`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message); // Memperbaiki akses pesan kesalahan
    } else {
      console.log("An unknown error occurred"); // Menangani kesalahan yang tidak terduga
    }
  }
}
