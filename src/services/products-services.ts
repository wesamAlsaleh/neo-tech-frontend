"use server";

// import axios to make http requests
import axios from "axios";

// import cookies from next/headers
import { cookies } from "next/headers";

/**
 * @function getProducts to get all products
 */
export const getProducts = async () => {
  try {
    // make a get request to the server
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/products`
    );

    // if Empty array is returned, return a user-friendly message
    if (response.data.products.length === 0) {
      return {
        status: false,
        message: "No products found.",
      };
    }

    // return the data from the response which is an array of products
    return {
      status: true,
      products: response.data.products,
    };
  } catch (error) {
    // if there is an error, log the error
    console.error(error);

    return {
      status: false,
      message: "An error occurred while fetching the products.",
    };
  }
};

/**
 * @function getProduct to get a single product
 */
export const getProduct = async (productId: string) => {
  try {
    // make a get request to the server
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/products/${productId}`
    );

    // return the response data
    return {
      status: "success",
      message: response.data.message,
      product: response.data.product,
    };
  } catch (error) {
    // if there is an error, log the error
    console.error(error);

    // return a user-friendly error message
    return {
      status: "failed",
      message: "An error occurred while fetching the product.",
    };
  }
};

/**
 * @function createProduct to create a new product
 * @param {FormData} productData
 */
export const createProduct = async (productData: FormData) => {
  try {
    // Get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    if (!userToken) {
      return {
        status: "failed",
        message: "Authentication token not found.",
      };
    }

    // Make a POST request to the server
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/create-product`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    // Return the response data
    return {
      status: "success",
      message: response.data.message,
      productData: response.data.product,
    };
  } catch (error) {
    // Log the error for debugging
    console.error("Error creating product:", error);
    console.error(
      "Server error response:",
      (error as any).response?.data?.errors
    );

    // Return a user-friendly error message
    return {
      status: "failed",
      message: "An error occurred while creating the product.",
    };
  }
};

/**
 * @function updateProduct to update a product
 * @param {FormData} productData
 */
export const updateProduct = async (
  productData: FormData,
  productId: number
) => {
  try {
    // Get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // make a post request to the server
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/update-product/${productId}`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return {
      status: "success",
      message: response.data.message,
      productData: response.data.productData,
    };
  } catch (error) {
    // if there is an error, log the error
    console.error(error);
    console.error(
      "Server error response:",
      (error as any).response?.data?.errors
    );

    return {
      status: "failed",
      message: "An error occurred while updating the product.",
    };
  }
};

/**
 * @function deleteProduct to delete a product
 */
export const deleteProduct = async (productId: number) => {
  try {
    // Get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // make a delete request to the server
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/delete-product/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    // return the response data
    return {
      status: "success",
      message: response.data.message,
    };
  } catch (error) {
    // if there is an error, log the error
    console.error(error);

    return {
      status: "failed",
      message: "An error occurred while deleting the product.",
    };
  }
};

/**
 * @function toggleProductStatus to toggle a product status between active and inactive
 */
export const toggleProductStatus = async (productId: number) => {
  try {
    // Get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // make a post request to the server
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/toggle-product-status/${productId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    // return the response data
    return {
      status: "success",
      message: response.data.message,
    };
  } catch (error) {
    // if there is an error, log the error
    console.error(error);

    return {
      status: "failed",
      message: "An error occurred while toggling the product status.",
    };
  }
};

/**
 * @function toggleProductAvailability to toggle a product stock between in stock and out of stock
 * @param {string} productId
 * @returns {Promise<any>}
 */
export const toggleProductAvailability = async (
  productId: number
): Promise<any> => {
  try {
    // Get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // make a post request to the server
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/toggle-product-availability/${productId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    // return the response data
    return {
      status: "success",
      message: response.data.message,
    };
  } catch (error) {
    // if there is an error, log the error
    console.error(error);

    return {
      status: "failed",
      message: "An error occurred while toggling the product availability.",
    };
  }
};

/**
 * @function searchProductByName to search for a product using product name as the search term
 */
export const searchProductByName = async (searchTerm: string) => {
  try {
    // make a get request to the server
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/products-by-name/${searchTerm}`
    );

    // return the response data
    return {
      status: "success",
      message: response.data.message,
      products: response.data.products,
    };
  } catch (error) {
    // if there is an error, log the error
    console.error(error);

    return {
      status: "failed",
      message: "An error occurred while searching for the product.",
    };
  }
};

/**
 * @function searchProductByCategory to search for a product using category name as the search term
 */
export const searchProductByCategory = async (searchTerm: string) => {
  try {
    // make a get request to the server
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/products-by-category/${searchTerm}`
    );

    // return the response data
    return {
      status: "success",
      products: response.data.products,
    };
  } catch (error) {
    // if there is an error, log the error
    console.error(error);

    return {
      status: "failed",
      message: "An error occurred while searching for the product.",
    };
  }
};

/**
 * @function searchProductByPrice to search for a product using price as the search term
 */
export const searchProductByPrice = async (min: string, max: string) => {
  try {
    // make a get request to the server
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/products-by-price/${min}/${max}`
    );

    // return the response data
    return {
      status: "success",
      products: response.data.products,
    };
  } catch (error) {
    // if there is an error, log the error
    console.error(error);

    return {
      status: "failed",
      message: "An error occurred while searching for the product.",
    };
  }
};

/**
 * @function searchProductByRating to search for a product using rating as the search term
 */
export const searchProductByRating = async (rating: string) => {
  try {
    // make a get request to the server
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/products-by-rating/${rating}`
    );

    // return the response data
    return {
      status: "success",
      products: response.data.products,
    };
  } catch (error) {
    // if there is an error, log the error
    console.error(error);

    return {
      status: "failed",
      message: "An error occurred while searching for the product.",
    };
  }
};

/**
 * @function searchProductBySlug to search for a product using slug as the search term
 */
export const searchProductBySlug = async (slug: string) => {
  try {
    // make a get request to the server
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/products-by-slug/${slug}`
    );

    // return the response data
    return {
      status: "success",
      products: response.data.products,
    };
  } catch (error) {
    // if there is an error, log the error
    console.error(error);

    return {
      status: "failed",
      message: "An error occurred while searching for the product.",
    };
  }
};

/**
 * @function searchProductByStock to search for a product using stock as the search term
 * @param {boolean} stock 0 or 1
 */
export const searchProductByStock = async (stock: string) => {
  try {
    // make a get request to the server
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/products-by-availability/${stock}`
    );

    // return the response data
    return {
      status: "success",
      products: response.data.products,
    };
  } catch (error) {
    // if there is an error, log the error
    console.error(error);

    return {
      status: "failed",
      message: "An error occurred while searching for the product.",
    };
  }
};

/**
 * @function searchProductByStatus to search for a product using status as the search term
 * @param {boolean} status 0 or 1
 */
export const searchProductByStatus = async (status: string) => {
  try {
    // make a get request to the server
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/products-by-status/${status}`
    );

    // return the response data
    return {
      status: "success",
      products: response.data.products,
    };
  } catch (error) {
    // if there is an error, log the error
    console.error(error);

    return {
      status: "failed",
      message: "An error occurred while searching for the product.",
    };
  }
};
