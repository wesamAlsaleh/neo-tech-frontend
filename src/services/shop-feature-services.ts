"use server";

import axios from "axios";
import { cookies } from "next/headers";

/**
 * @function getShopFeatures to get shop features from the server
 */
export const getShopFeatures = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/active-features`
    );

    return {
      status: true,
      message: response.data.message,
      features: response.data.features,
    };
  } catch (error: any) {
    console.error(error.response.data.message);
    console.log("d@q" + error.response.data.devMessage);

    return {
      status: false,
      message: error.response.data.message || "An error occurred",
    };
  }
};

/**
 * @function getShopFeaturesAdmin to get all shop features from the server for admin (active and inactive)
 */
export const getShopFeaturesAdmin = async () => {
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
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/features`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return {
      status: true,
      message: response.data.message,
      features: response.data.features,
    };
  } catch (error: any) {
    console.error(error.response.data.message);
    console.log("d@q" + error.response.data.devMessage);

    return {
      status: false,
      message: error.response.data.message || "An error occurred",
    };
  }
};

/**
 * @function createShopFeature to create shop feature
 * @param {string} featureData - feature data to be created on the server (name, description, color, icon)
 */
export const createShopFeature = async (formData: FormData) => {
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
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/create-feature`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return {
      status: true,
      message: response.data.message,
      feature: response.data.feature,
    };
  } catch (error: any) {
    // debug message
    console.error(error.response.data.message);

    // log dev message
    console.log("d@q" + error.response.data.devMessage);

    return {
      status: false,
      message: error.response.data.message || "An error occurred",
    };
  }
};

/**
 * @function updateShopFeature to update shop feature
 * @param {string} featureData - feature data to be updated on the server (name, description, color, icon)
 */
export const updateShopFeature = async (
  featureData: any,
  featureId: string
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

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/update-feature/${featureId}`,
      featureData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return {
      status: true,
      message: response.data.message,
      feature: response.data.feature,
    };
  } catch (error: any) {
    // debug message
    console.error(error.response.data.message);

    // log dev message
    console.log("d@q" + error.response.data.devMessage);

    return {
      status: false,
      message: error.response.data.message || "An error occurred",
    };
  }
};

/**
 * @function deleteShopFeature to delete shop feature
 * @param {string} featureId - feature id to be deleted on the server
 */
export const deleteShopFeature = async (featureId: string) => {
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
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/delete-feature/${featureId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return {
      status: true,
      message: response.data.message,
    };
  } catch (error: any) {
    // debug message
    console.error(error.response.data.message);

    // log dev message
    console.log("d@q" + error.response.data.devMessage);

    return {
      status: false,
      message: error.response.data.message || "An error occurred",
    };
  }
};

/**
 * @function toggleShopFeatureStatus to toggle shop feature status
 * @param {string} featureId - feature id to toggle status on the server
 */
export const toggleShopFeatureStatus = async (featureId: string) => {
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

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/toggle-feature-status/${featureId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return {
      status: true,
      message: response.data.message,
    };
  } catch (error: any) {
    // debug message
    console.error(error.response.data.message);

    // log dev message
    console.log("d@q" + error.response.data.devMessage);

    return {
      status: false,
      message: error.response.data.message || "An error occurred",
    };
  }
};
