"use server";

import axios from "axios";
import { cookies } from "next/headers";

/**
 * @function getProducts to get all products 'admin'
 */
export const getProducts = async (currentPage: number, perPage: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/products?page=${currentPage}&perPage=${perPage}`
    );

    return {
      status: true,
      products: response.data.products.data,
      totalProducts: response.data.products.total,
      currentPage: response.data.products.current_page,
      totalPages: response.data.products.last_page,
      perPage: response.data.products.per_page,
    };
  } catch (error: any) {
    // Debugging error
    console.error(error);

    // Log the Developer message
    console.log(error.response.data.developerMessage);

    return {
      status: false,
      message: error.response.data.message,
    };
  }
};

/**
 * @function getProductsClient to get all products 'client'
 * @param {number} currentPage - The current page number (required)
 * @param {number} perPage - The number of products per page (required)
 * @param {string[]} categorySlugs - An array of category slugs to filter products by category, eg. ['electronics', 'clothing'] (optional)
 * @param {number} priceMin - The minimum price to filter products by price (optional)
 * @param {number} priceMax - The maximum price to filter products by price (optional)
 * @param {boolean} onSale - A boolean to filter products that are on sale (optional)
 * @param {string} sortBy - The sorting criteria for the products, only for: priceAsc, priceDesc ,newest, popular, bestSelling (optional)
 *
 * @returns {Promise<{status: boolean, products?: Product[], currentPage?: number, perPage?: number, totalPages?: number, totalProducts?: number, message?: string}>}
 */
export const getProductsClient = async (
  currentPage: number,
  perPage: number,
  categorySlugs?: string[], // array of category slugs
  priceMin?: number,
  priceMax?: number,
  onSale?: boolean,
  sortBy?: string
) => {
  try {
    // Base URL for the API endpoint
    let url = `products-client?page=${currentPage}&perPage=${perPage}`;

    // If categorySlug is provided, append it to the URL
    if (categorySlugs && categorySlugs.length > 0) {
      url += `&categories=${categorySlugs.join(",")}`; // Converts array to comma-separated string e.g. 'electronics,clothing'
    }

    // If priceMin and priceMax are provided, append them to the URL
    if (priceMin != undefined && priceMax != undefined) {
      url += `&priceMin=${priceMin}&priceMax=${priceMax}`;
    }

    // If onSale is provided, append it to the URL
    if (onSale) {
      url += `&onSale=${onSale}`;
    }

    // If sortBy is provided, append it to the URL
    if (sortBy) {
      url += `&sortBy=${sortBy}`;
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/${url}`
    );

    return {
      status: true,
      products: response.data.products.data,
      currentPage: response.data.products.current_page,
      perPage: response.data.products.per_page,
      totalPages: response.data.products.last_page,
      totalProducts: response.data.products.total,
    };
  } catch (error: any) {
    // Debugging error
    console.error(error);

    // Log the Developer message
    console.log(error.response.data.developerMessage);

    return {
      status: false,
      message: error.response.data.message,
    };
  }
};

/**
 * @function getSaleProducts to get all products on sale
 */
export const getSaleProducts = async (currentPage: number) => {
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
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/sale-products?page=${currentPage}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return {
      status: true,
      message: response.data.message,
      products: response.data.products,
      currentPage: response.data.pagination.current_page,
      totalPages: response.data.pagination.total_pages,
      totalProducts: response.data.pagination.total_products_onSale,
    };
  } catch (error: any) {
    // Debugging error
    console.error(error);

    // Log the Developer message
    console.log(error);

    return {
      status: false,
      message: error.response.data.message,
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
 * @function getTrashedProducts to get all trashed products
 */
export const getTrashedProducts = async () => {
  try {
    // Get the user token from the cookie
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/products/trashed`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return {
      status: true,
      trashedProducts: response.data.products,
    };
  } catch (error: any) {
    console.error(error);

    return {
      status: false,
      message: error.response.data.message,
    };
  }
};

/**
 * @function restoreProduct to restore a trashed product
 */
export const restoreProduct = async (productId: string) => {
  try {
    // Get the user token from the cookie
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/products/restore/${productId}`,
      {}, // Empty data
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
    console.error(error);

    return {
      status: false,
      message: error.response.data.message,
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
 * @function searchProduct - to search for a product using the search term for its name or barcode (for admins only)
 */
export const searchProduct = async (searchTerm: string) => {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // If the user token is not found
    if (!userToken) {
      return {
        status: false,
        message: "Please login to continue.",
      };
    }

    // Make a GET request to the API endpoint with the search term
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/products/search/?query=${searchTerm}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`, // this method requires the user to be authenticated and the token is to pass the sanctum middleware in the backend
        },
      }
    );

    return {
      status: true,
      searchResults: response.data.results,
      totalItems: response.data.items_count,
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
      message: response.data.message,
      product: response.data.product,
    };
  } catch (error: any) {
    console.error(error);
    console.log(error.response.data.developerMessage);

    return {
      status: false,
      message: error.response.data.message,
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

/**
 * @function getBestSellingProducts to get best selling products, with pagination
 */
export const getBestSellingProducts = async (currentPage: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/best-selling-products?page=${currentPage}`
    );

    return {
      status: true,
      message: response.data.message,
      products: response.data.products,
      paginationInfo: {
        currentPage: response.data.pagination.current_page,
        totalPages: response.data.pagination.total_pages,
        totalItems: response.data.pagination.total_items,
      },
    };
  } catch (error: any) {
    console.error("Error fetching best-selling products:", error);
    console.log(error.response.data.developerMessage || "d@q");

    return {
      status: false,
      message:
        error.response.data.message ||
        "An error occurred while fetching the best selling products.",
    };
  }
};

/**
 * @function getExploreProducts to get explore products
 */
export const getExploreProducts = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/explore-products`
    );

    return {
      status: true,
      message: response.data.message,
      products: response.data.products,
    };
  } catch (error: any) {
    console.error("Error fetching explore products:", error);
    console.log(error.response.data.developerMessage || "d@q");

    return {
      status: false,
      message:
        error.response.data.message ||
        "An error occurred while fetching the explore products.",
    };
  }
};

/**
 * @function putProductOnSale to put a product on sale
 */
export const putProductOnSale = async (
  productId: string,
  formData: FormData
) => {
  try {
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/toggle-product-sale/${productId}`,
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
    };
  } catch (error: any) {
    // Debugging error
    console.error(error);

    console.log(" ");

    // Log the Developer message
    console.log(error.response.data.developerMessage);

    return {
      status: false,
      message:
        error.response.data.message ||
        "An error occurred while putting the product on sale.",
    };
  }
};

/**
 * @function removeProductFromSale to remove a product from sale
 */
export const removeProductFromSale = async (productId: string) => {
  try {
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/toggle-product-sale-off/${productId}`,
      {}, // Empty data
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
    // Debugging error
    console.error(error);

    console.log(" ");

    // Log the Developer message
    console.log(error.response.data.developerMessage);

    return {
      status: false,
      message:
        error.response.data.message ||
        "An error occurred while removing the product from sale.",
    };
  }
};

/**
 * @function removeAllProductsFromSale to remove all products from sale
 */
export const removeAllProductsFromSale = async () => {
  try {
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/remove-all-products-from-sale`,
      {}, // Empty data
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
    // Debugging error
    console.error(error);

    console.log(" ");

    // Log the Developer message
    console.log(error.response.data.developerMessage);

    return {
      status: false,
      message:
        error.response.data.message ||
        "An error occurred while removing all products from sale.",
    };
  }
};

/**
 * @function putRating to rate a product
 * @param {string} productId
 */
export const putRating = async (productId: string, rating: number) => {
  try {
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/put-rating/${productId}`,
      { rating },
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
    // Debugging error
    console.error(error);

    console.log(" ");

    // Log the Developer message
    console.log(error.response.data.developerMessage);

    return {
      status: false,
      message:
        error.response.data.message ||
        "An error occurred while rating the product.",
    };
  }
};

/**
 * @function searchProducts - to search for products using a search term
 * @param {string} searchTerm - The search term to filter products by name or barcode
 */
export const searchProducts = async (searchTerm: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/search-products?query=${searchTerm}`
    );

    return {
      status: true,
      message: response.data.message,
      productsCount: response.data.products_count,
      products: response.data.products,
    };
  } catch (error) {
    console.error(error);

    return {
      status: false,
      message: "An error occurred while searching for the products.",
    };
  }
};

/**
 * @function getProductStatistics - to get product statistics
 */
export const getProductStatistics = async (
  currentPage: number,
  perPage: number
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

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/products-statistics?per_page=${perPage}&page=${currentPage}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return {
      status: true,
      message: response.data.message,
      products: response.data.products.data,
      currentPage: response.data.products.current_page,
      totalPages: response.data.products.last_page,
      totalProducts: response.data.products.total,
      perPage: response.data.products.per_page,
    };
  } catch (error: any) {
    // Debugging error
    console.error(error);

    // Log the Developer message
    console.log(error);

    return {
      status: false,
      message: error.response.data.message,
    };
  }
};
