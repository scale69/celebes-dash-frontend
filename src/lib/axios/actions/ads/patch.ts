"use server"
import { CategoryFormData } from "@/types/form-types";
import axiosInstance from "../../instance";


export const updateStatusAds = async (status: boolean, id: string) => {
    const instance = await axiosInstance();
    try {
      const res = await instance.patch(`ads/${id}/`, {
        data : {
            status
        }
      }, {
        headers: {
          "Content-Type": "application/json",
        }
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


  export const updateAds = async (formData: FormData, id : string) => {
    const instance = await axiosInstance();
    try {
  
      const res = await instance.patch(`ads/${id}/`,formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
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