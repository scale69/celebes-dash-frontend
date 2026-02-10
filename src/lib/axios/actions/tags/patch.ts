"use server";
import { TagFormData } from "@/types/form-types";
import axiosInstance from "../../instance";

export const updateTag = async (data: TagFormData, id: string) => {
  const instance = await axiosInstance();
  try {
    const res = await instance.patch(`/api/tags/${id}/`, data, {
      headers: {
        "Content-Type": "application/json",
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
