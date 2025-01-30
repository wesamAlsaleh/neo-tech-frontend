"use server";

// import axios to make http requests
import axios from "axios";
import { stat } from "fs";

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

    // return the data from the response which is an array of products
    return response.data;
  } catch (error) {
    // if there is an error, log the error
    console.error(error);
  }
};
// Sample response from the server
// [
//   {
//     id: 4,
//     product_name: "Product 1",
//     product_description: "s",
//     product_price: "1.20",
//     product_rating: 1,
//     slug: "product-1",
//     images: [
//       "http://127.0.0.1:8000/storage/images/products_images/6797c836f1600.jpg",
//     ],
//     is_active: false,
//     in_stock: false,
//     category_id: 1,
//     created_at: "2025-01-27T17:53:59.000000Z",
//     updated_at: "2025-01-27T17:53:59.000000Z",
//   },
//   {
//     id: 5,
//     product_name: "Product 2",
//     product_description: "s",
//     product_price: "1.20",
//     product_rating: 1,
//     slug: "product-2",
//     images: [
//       "http://127.0.0.1:8000/storage/images/products_images/6797c850efa7c.jpg",
//       "http://127.0.0.1:8000/storage/images/products_images/6797c850f2492.jpg",
//     ],
//     is_active: true,
//     in_stock: false,
//     category_id: 1,
//     created_at: "2025-01-27T17:54:24.000000Z",
//     updated_at: "2025-01-27T18:34:44.000000Z",
//   },
// ];

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
    return response.data;
  } catch (error) {
    // if there is an error, log the error
    console.error(error);
  }
};
// Sample response from the server
// {
//     "message": "Product found",
//     "product": {
//         "id": 4,
//         "product_name": "Product 1",
//         "product_description": "s",
//         "product_price": "1.20",
//         "product_rating": 1,
//         "slug": "product-1",
//         "images": [
//             "http://127.0.0.1:8000/storage/images/products_images/6797c836f1600.jpg"
//         ],
//         "is_active": false,
//         "in_stock": false,
//         "category_id": 1,
//         "created_at": "2025-01-27T17:53:59.000000Z",
//         "updated_at": "2025-01-27T17:53:59.000000Z"
//     }
// }
// Sample response from the server if there is an error
// {
//     "message": "Product not found"
// }

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
    console.error("Error response:", (error as any).response?.data?.errors);

    // Return a user-friendly error message
    return {
      status: "failed",
      message: "An error occurred while creating the product.",
    };
  }
};

// Sample response from the server is created successfully
// {
//     "message": "Samsung S25 created successfully",
//     "productData": {
//         "product_name": "Samsung S25",
//         "product_description": "Operating System: Android",
//         "product_price": "540.40",
//         "product_rating": 4,
//         "slug": "samsung-s25",
//         "images": [
//             "http://127.0.0.1:8000/storage/images/products_images/6798e0d3dd344.jpg"
//         ],
//         "category_id": "2",
//         "updated_at": "2025-01-28T13:51:16.000000Z",
//         "created_at": "2025-01-28T13:51:16.000000Z",
//         "id": 9,
//         "category": {
//             "id": 2,
//             "category_name": "Mobile",
//             "category_slug": "mobile",
//             "category_description": "Mobile Section",
//             "category_image": "67978641aa051.png",
//             "is_active": 1,
//             "created_at": "2025-01-27T13:12:33.000000Z",
//             "updated_at": "2025-01-27T13:13:06.000000Z"
//         }
//     }
// }
// Sample response from the server if there is an error
// {
//     "errorMessage": "SQLSTATE[23000]: Integrity constraint violation: 1062 Duplicate entry 'samsung-s25' for key 'products_slug_unique' (Connection: mysql, SQL: insert into `products` (`product_name`, `product_description`, `product_price`, `product_rating`, `slug`, `images`, `category_id`, `updated_at`, `created_at`) values (Samsung S25, Operating System: Android, 540.4, 4, samsung-s25, [\"http:\\/\\/127.0.0.1:8000\\/storage\\/images\\/products_images\\/6798e0ebef8bc.jpg\"], 2, 2025-01-28 13:51:39, 2025-01-28 13:51:39))"
// }

/**
 * @function updateProduct to update a product
 * @param {FormData} productData
 */
export const updateProduct = async (
  productData: FormData,
  productId: string
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

    // return the response data
    return response.data;
  } catch (error) {
    // if there is an error, log the error
    console.error(error);
  }
};

// Sample response from the server is updated successfully
// {
//     "message": "Product 2 updated successfully",
//     "productData": {
//         "id": 5,
//         "product_name": "Product 2",
//         "product_description": "This is the description field from the update functionality",
//         "product_price": "110.20",
//         "product_rating": 2,
//         "slug": "product-2",
//         "images": [
//             "http://127.0.0.1:8000/storage/images/products_images/6797c850efa7c.jpg",
//             "http://127.0.0.1:8000/storage/images/products_images/6797c850f2492.jpg"
//         ],
//         "is_active": true,
//         "in_stock": false,
//         "category_id": "1",
//         "created_at": "2025-01-27T17:54:24.000000Z",
//         "updated_at": "2025-01-28T14:06:49.000000Z",
//         "category": {
//             "id": 1,
//             "category_name": "Gaming",
//             "category_slug": "gaming",
//             "category_description": "Gaming Section",
//             "category_image": "67978626199b2.png",
//             "is_active": 0,
//             "created_at": "2025-01-27T13:12:06.000000Z",
//             "updated_at": "2025-01-27T13:12:17.000000Z"
//         }
//     }
// }
// Sample response from the server if there is an error
// {
//     "errorMessage": "SQLSTATE[23000]: Integrity constraint violation: 1048 Column 'product_name' cannot be null (Connection: mysql, SQL: update `products` set `product_name` = ?, `product_description` = This is the description field from the update functionality, `product_price` = 110.2, `product_rating` = 2, `slug` = , `products`.`updated_at` = 2025-01-28 14:05:30 where `id` = 5)"
// }

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

// Sample response from the server is deleted successfully
// {
//     "message": "Product 2 deleted successfully"
// }

// Sample response from the server if there is an error
// {
//     "errorMessage": "No query results for model [App\\Models\\Product] 5"
// }

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
// Sample response from the server is updated successfully
// {
//     "message": "Iphone 10 is now active"
// }
// Sample response from the server if there is an error
// {
//     "errorMessage": "No query results for model [App\\Models\\Product] 5"
// }

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
// Sample response from the server is updated successfully
// {
//     "message": "Iphone 10 is now available"
// }
// Sample response from the server if there is an error
// {
//     "errorMessage": "No query results for model [App\\Models\\Product] 5"
// }

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
    return response.data;
  } catch (error) {
    // if there is an error, log the error
    console.error(error);
  }
};
// Sample response from the server
// [
//     {
//         "id": 4,
//         "product_name": "Product 1",
//         "product_description": "s",
//         "product_price": "1.20",
//         "product_rating": 1,
//         "slug": "product-1",
//         "images": [
//             "http://127.0.0.1:8000/storage/images/products_images/6797c836f1600.jpg"
//         ],
//         "is_active": false,
//         "in_stock": false,
//         "category_id": 1,
//         "created_at": "2025-01-27T17:53:59.000000Z",
//         "updated_at": "2025-01-27T17:53:59.000000Z"
//     }
// ]
// Sample response from the server if there is an error
// {
//     "message": "No products found"
// }

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
    return response.data;
  } catch (error) {
    // if there is an error, log the error
    console.error(error);
  }
};
// Sample response from the server
// {
//     "message": "Products found",
//     "category": null,
//     "products": [
//         {
//             "id": 4,
//             "product_name": "Product 1",
//             "product_description": "s",
//             "product_price": "1.20",
//             "product_rating": 1,
//             "slug": "product-1",
//             "images": [
//                 "http://127.0.0.1:8000/storage/http://127.0.0.1:8000/storage/images/products_images/6797c836f1600.jpg"
//             ],
//             "is_active": false,
//             "in_stock": false,
//             "category_id": 1,
//             "created_at": "2025-01-27T17:53:59.000000Z",
//             "updated_at": "2025-01-27T17:53:59.000000Z"
//         }
//     ]
// }
// Sample response from the server
// {
//     "message": "No products found in this category"
// }

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
    return response.data;
  } catch (error) {
    // if there is an error, log the error
    console.error(error);
  }
};
// Sample response from the server
// [
//     {
//         "id": 8,
//         "product_name": "Iphone 10",
//         "product_description": "Operating System: IOS",
//         "product_price": "430.20",
//         "product_rating": 4,
//         "slug": "iphone-10",
//         "images": [
//             "http://127.0.0.1:8000/storage/http://127.0.0.1:8000/storage/images/products_images/6798c7331ed16.jpg"
//         ],
//         "is_active": true,
//         "in_stock": false,
//         "category_id": 2,
//         "created_at": "2025-01-28T12:01:55.000000Z",
//         "updated_at": "2025-01-28T14:14:50.000000Z"
//     }
// ]
// Sample response from the server if there isn't a product within the price range
// {
//     "message": "No products found"
// }

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
    return response.data;
  } catch (error) {
    // if there is an error, log the error
    console.error(error);
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
    return response.data;
  } catch (error) {
    // if there is an error, log the error
    console.error(error);
  }
};
// Sample response from the server
// [
//     {
//         "id": 4,
//         "product_name": "Product 1",
//         "product_description": "s",
//         "product_price": "1.20",
//         "product_rating": 1,
//         "slug": "product-1",
//         "images": [
//             "http://127.0.0.1:8000/storage/http://127.0.0.1:8000/storage/images/products_images/6797c836f1600.jpg"
//         ],
//         "is_active": false,
//         "in_stock": false,
//         "category_id": 1,
//         "created_at": "2025-01-27T17:53:59.000000Z",
//         "updated_at": "2025-01-27T17:53:59.000000Z"
//     }
// ]
// Sample response from the server if there is an error
// {
//     "message": "No products found"
// }

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
    return response.data;
  } catch (error) {
    // if there is an error, log the error
    console.error(error);
  }
};
// Sample response from the server
// [
//   {
//     id: 8,
//     product_name: "Iphone 10",
//     product_description: "Operating System: IOS",
//     product_price: "430.20",
//     product_rating: 4,
//     slug: "iphone-10",
//     images: [
//       "http://127.0.0.1:8000/storage/http://127.0.0.1:8000/storage/images/products_images/6798c7331ed16.jpg",
//     ],
//     is_active: true,
//     in_stock: true,
//     category_id: 2,
//     created_at: "2025-01-28T12:01:55.000000Z",
//     updated_at: "2025-01-28T14:27:56.000000Z",
//   },
// ];
// {
//     "message": "No products found"
// }

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
    return response.data;
  } catch (error) {
    // if there is an error, log the error
    console.error(error);
  }
};
// Sample response from the server
// [
//     {
//         "id": 8,
//         "product_name": "Iphone 10",
//         "product_description": "Operating System: IOS",
//         "product_price": "430.20",
//         "product_rating": 4,
//         "slug": "iphone-10",
//         "images": [
//             "http://127.0.0.1:8000/storage/http://127.0.0.1:8000/storage/images/products_images/6798c7331ed16.jpg"
//         ],
//         "is_active": true,
//         "in_stock": true,
//         "category_id": 2,
//         "created_at": "2025-01-28T12:01:55.000000Z",
//         "updated_at": "2025-01-28T14:27:56.000000Z"
//     }
// ]
