"use server";

// Import axios for the API requests
import axios from "axios";

// Import the cookies from the next/headers module
import { cookies } from "next/headers";

// Client-side API URL
/**
 * @function get -
 */

/**
 * @function getAllOrders - Get all orders for admin
 */
export async function getAllOrders(perPage: number, page: number) {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // If the user token is not found
    if (!userToken) {
      return {
        status: false,
        message: "No authentication token found.",
      };
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/orders?perPage=${perPage}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`, // this method requires the user to be authenticated and the token is to pass the sanctum middleware in the backend
        },
      }
    );

    return {
      status: true,
      message: response.data.message,
      totalOrders: response.data.total_orders,
      orders: response.data.orders.data,
      currentPage: response.data.orders.current_page,
      perPage: response.data.orders.per_page,
      totalPages: response.data.orders.last_page,
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
}
