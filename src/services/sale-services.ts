"use server";

import axios from "axios";
import { cookies } from "next/headers";

/**
 * @function getFlashSales to fetch the flash sales from the server
 */
export const getFlashSales = async () => {
  try {
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    if (!userToken) {
      return {
        status: false,
        message: "Authentication token not found.",
      };
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/flash-sales`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return {
      status: true,
      message: response.data.message,
      flashSales: response.data.flashSales,
    };
  } catch (error: any) {
    // Debug the error
    console.error(error);

    console.log(" ");

    // Development error
    console.log(error.response.data);

    return {
      status: false,
      message: error.response.data.message,
    };
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

/**
 * @function updateFlashSale to update a flash sale
 * @param formData the form data to update the flash sale
 */
export const updateFlashSale = async (
  formData: FormData,
  flashSaleId: string
) => {
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
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/update-flash-sale/${flashSaleId}`,
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

/**
 * @function deleteFlashSale to delete a flash sale
 * @param flashSaleId the id of the flash sale to delete
 */
export const deleteFlashSale = async (flashSaleId: string) => {
  try {
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    if (!userToken) {
      return {
        status: false,
        message: "Authentication token not found.",
      };
    }

    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/delete-flash-sale/${flashSaleId}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return {
      status: true,
      message: response.data.message,
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

/**
 * @function getFlashSale to fetch a single flash sale
 * @param flashSaleId the id of the flash sale to fetch
 */
export const getFlashSale = async (flashSaleId: string) => {
  try {
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    if (!userToken) {
      return {
        status: false,
        message: "Authentication token not found.",
      };
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/flash-sale/${flashSaleId}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return {
      status: true,
      message: response.data.message,
      flashSale: response.data.flashSale,
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
