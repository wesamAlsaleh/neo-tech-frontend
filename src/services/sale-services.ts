"use server";

import axios from "axios";
import { cookies } from "next/headers";

/**
 * @function getFlashSales to fetch the flash sales from the server
 * @param currentPage the page number to fetch
 */
export const getFlashSales = async (currentPage: number) => {
  try {
  } catch (error) {
    console.error(error);
  }
};

/**
 * @function createFlashSale to create a new flash sale
 * @param formData the form data to create the flash sale
 */
export const createFlashSale = async (formData: FormData) => {
  try {
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    if (!userToken) {
      return {
        status: false,
        message: "Authentication token not found.",
      };
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/create-flash-sale`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return {
      status: true,
      message: response.data.message,
      duration: response.data.duration,
    };
  } catch (error: any) {
    // Debug the error
    console.error(error);

    // Development error
    console.log(error.response.data.developerMessage);

    return {
      status: false,
      message: error.response.data.message,
    };
  }
};
