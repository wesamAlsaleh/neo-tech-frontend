"use server";

// Import axios for the API requests
import axios from "axios";

// Import the cookies from the next/headers module
import { cookies } from "next/headers";

/**
 * @function getSliderImagesAdmin - Function to get slider images for the admin dashboard
 */
export const getSliderImagesAdmin = async (
  currentPage: number,
  perPage: number
) => {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // Check if user token is not found
    if (!userToken) {
      return {
        status: false,
        message: "Authentication token not found.",
      };
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/images?page=${currentPage}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return {
      status: true,
      message: response.data.message,
      sliderImages: response.data.images.data,
      pagination: {
        currentPage: response.data.images.current_page,
        totalPages: response.data.images.total,
        firstPageUrl: response.data.images.first_page_url,
        lastPageUrl: response.data.images.last_page_url,
        nextPageUrl: response.data.images.next_page_url,
        prevPageUrl: response.data.images.prev_page_url,
        from: response.data.images.from, // Index of the first item in the current page
        to: response.data.images.to, // Index of the last item in the current page
        perPage: response.data.images.per_page,
      },
    };
  } catch (error: any) {
    // Log the error to the console
    console.error(error.response.data);

    // Return the details of the error
    console.error(error.response.data.devMessage);

    return {
      status: false,
      message: error.response.data.message || "An error occurred",
    };
  }
};

/**
 * @function deleteSliderImage - Function to delete a slider image
 * @param {string} imageId - The ID of the image to delete
 */
export const deleteSliderImage = async (imageId: string) => {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // Check if user token is not found
    if (!userToken) {
      return {
        status: false,
        message: "Authentication token not found.",
      };
    }

    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/delete-image/${imageId}`,
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
    // Log the error to the console
    console.error(error.response.data);

    // Return the details of the error
    console.error(error.response.data.devMessage);

    return {
      status: false,
      message: error.response.data.message || "An error occurred",
    };
  }
};

/**
 * @function addSliderImage - Function to add a slider image
 * @param {FormData} formData - The form data containing the image to add
 */
export const addSliderImage = async (formData: FormData) => {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // Check if user token is not found
    if (!userToken) {
      return {
        status: false,
        message: "Authentication token not found.",
      };
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/upload-image`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return {
      status: true,
      message: response.data.message,
    };
  } catch (error: any) {
    // Log the error to the console
    console.error(error.response.data);

    // Return the details of the error
    console.error(error.response.data.devMessage);

    return {
      status: false,
      message: error.response.data.message || "An error occurred",
    };
  }
};

/**
 * @function updateSliderImage - Function to update a slider image
 * @param {string} imageId - The ID of the image to update
 * @param {FormData} formData - The form data containing the image to update (name only)
 */
export const updateSliderImage = async (
  imageId: string,
  formData: FormData
) => {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // Check if user token is not found
    if (!userToken) {
      return {
        status: false,
        message: "Authentication token not found.",
      };
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/update-image/${imageId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return {
      status: true,
      message: response.data.message,
    };
  } catch (error: any) {
    // Log the error to the console
    console.error(error.response.data);

    // Return the details of the error
    console.error(error.response.data.devMessage);

    return {
      status: false,
      message: error.response.data.message || "An error occurred",
    };
  }
};

/**
 * @function toggleVisibility - Function to toggle the visibility of the slider images (public/member only)
 * @param {string} imageId - The ID of the image to toggle visibility
 */
export const toggleVisibility = async (imageId: string) => {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // Check if user token is not found
    if (!userToken) {
      return {
        status: false,
        message: "Authentication token not found.",
      };
    }

    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/toggle-image-visibility/${imageId}`,
      {},
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
    // Log the error to the console
    console.error(error.response.data);

    // Return the details of the error
    console.error(error.response.data.devMessage);

    return {
      status: false,
      message: error.response.data.message || "An error occurred",
    };
  }
};

/**
 * @function toggleActivity - Function to toggle the activity of the slider images (enable/disable)
 * @param {string} imageId - The ID of the image to toggle activity
 */
export const toggleActivity = async (imageId: string) => {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // Check if user token is not found
    if (!userToken) {
      return {
        status: false,
        message: "Authentication token not found.",
      };
    }

    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/toggle-image-status/${imageId}`,
      {},
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
    // Log the error to the console
    console.error(error.response.data);

    // Return the details of the error
    console.error(error.response.data.devMessage);

    return {
      status: false,
      message: error.response.data.message || "An error occurred",
    };
  }
};

/**
 * @function getSliderImages - Function to get slider images for the homepage
 */
export const getSliderImages = async () => {
  try {
    // get user token from cookies if available
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // Define request headers (conditionally include Authorization)
    const headers = userToken
      ? { Authorization: `Bearer ${userToken}` }
      : undefined;

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/display-slider-images`,
      { headers }
    );

    return {
      status: true,
      message: response.data.message,
      visibility: response.data.visibility,
      sliderImages: response.data.images,
    };
  } catch (error: any) {
    // Log the error to the console
    console.error(error.response.data);

    // Return the details of the error
    console.error(error.response.data.devMessage);

    return {
      status: false,
      message: error.response.data.message || "An error occurred",
    };
  }
};
