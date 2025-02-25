"use server";

import axios from "axios";
import { cookies } from "next/headers";

/**
 * @function getProducts to get all products
 */
export const getProducts = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/products`
    );

    if (response.data.products.length === 0) {
      return {
        status: false,
        message: "No products found.",
      };
    }

    return {
      status: true,
      products: response.data.products,
    };
  } catch (error) {
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
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/products/${productId}`
    );

    return {
      status: true,
      message: response.data.message,
      product: response.data.product,
    };
  } catch (error) {
    console.error(error);

    return {
      status: false,
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
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    if (!userToken) {
      return {
        status: false,
        message: "Authentication token not found.",
      };
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/create-product`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return {
      status: true,
      message: response.data.message,
      productData: response.data.productData,
    };
  } catch (error: any) {
    console.error("Error creating product:", error);

    return {
      status: false,
      message: error.response.data.message,
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
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/update-product/${productId}`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return {
      status: true,
      message: response.data.message,
      productData: response.data.productData,
    };
  } catch (error: any) {
    console.error(error);
    console.error(error.response);

    return {
      status: false,
      message: error.response.data.message,
      error: error.response.data.error,
    };
  }
};

/**
 * @function deleteProduct to delete a product
 */
export const deleteProduct = async (productId: string) => {
  try {
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/delete-product/${productId}`,
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
  } catch (error) {
    console.error(error);

    return {
      status: false,
      message: "An error occurred while deleting the product.",
    };
  }
};

/**
 * @function toggleProductStatus to toggle a product status between active and inactive
 */
export const toggleProductStatus = async (productId: string) => {
  try {
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/toggle-product-status/${productId}`,
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
  } catch (error) {
    console.error(error);

    return {
      status: false,
      message: "An error occurred while toggling the product status.",
    };
  }
};

/**
 * @function searchProductByName to search for a product using product name as the search term
 */
export const searchProductByName = async (searchTerm: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/products-by-name/${searchTerm}`
    );

    return {
      status: true,
      message: response.data.message,
      products: response.data.products,
    };
  } catch (error) {
    console.error(error);

    return {
      status: false,
      message: "An error occurred while searching for the product.",
    };
  }
};

/**
 * @function searchProductByCategory to search for a product using category name as the search term
 */
export const searchProductByCategory = async (searchTerm: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/products-by-category/${searchTerm}`
    );

    return {
      status: true,
      products: response.data.products,
    };
  } catch (error) {
    console.error(error);

    return {
      status: false,
      message: "An error occurred while searching for the product.",
    };
  }
};

/**
 * @function searchProductByPrice to search for a product using price as the search term
 */
export const searchProductByPrice = async (min: string, max: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/products-by-price/${min}/${max}`
    );

    return {
      status: true,
      products: response.data.products,
    };
  } catch (error) {
    console.error(error);

    return {
      status: false,
      message: "An error occurred while searching for the product.",
    };
  }
};

/**
 * @function searchProductByRating to search for a product using rating as the search term
 */
export const searchProductByRating = async (rating: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/products-by-rating/${rating}`
    );

    return {
      status: true,
      products: response.data.products,
    };
  } catch (error) {
    console.error(error);

    return {
      status: false,
      message: "An error occurred while searching for the product.",
    };
  }
};

/**
 * @function searchProductBySlug to search for a product using slug as the search term
 */
export const searchProductBySlug = async (slug: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/products-by-slug/${slug}`
    );

    return {
      status: true,
      products: response.data.products,
    };
  } catch (error) {
    console.error(error);

    return {
      status: false,
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
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/products-by-availability/${stock}`
    );

    return {
      status: true,
      products: response.data.products,
    };
  } catch (error) {
    console.error(error);

    return {
      status: false,
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
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/products-by-status/${status}`
    );

    return {
      status: true,
      products: response.data.products,
    };
  } catch (error) {
    console.error(error);

    return {
      status: false,
      message: "An error occurred while searching for the product.",
    };
  }
};
