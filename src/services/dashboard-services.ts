"use server";

// Import axios for the API requests
import axios from "axios";

// Import the cookies from the next/headers module
import { cookies } from "next/headers";

/**
 * @function getTodaysOrders -get total orders for today
 */
export async function getTodaysOrders() {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // If the user token is not found
    if (!userToken) {
      return {
        status: false,
        message: "Please login to add items to your cart",
      };
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/todays-orders`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`, // this method requires the user to be authenticated and the token is to pass the sanctum middleware in the backend
        },
      }
    );

    return {
      status: true,
      totalOrders: response.data.total_orders,
      totalRevenue: response.data.total_revenue,
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

/**
 * @function getTotalPendingOrders -get total pending orders
 */
export async function getTotalPendingOrders() {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // If the user token is not found
    if (!userToken) {
      return {
        status: false,
        message: "Please login to add items to your cart",
      };
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/pending-orders-count`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`, // this method requires the user to be authenticated and the token is to pass the sanctum middleware in the backend
        },
      }
    );

    return {
      status: true,
      totalPendingOrders: response.data.total_pending_orders,
      totalPendingRevenue: response.data.total_revenue,
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

/**
 * @function getProductsInventoryStatus -get total products inventory status
 */
export async function getProductsInventoryStatus() {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // If the user token is not found
    if (!userToken) {
      return {
        status: false,
        message: "Please login to add items to your cart",
      };
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/products-inventory-status`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`, // this method requires the user to be authenticated and the token is to pass the sanctum middleware in the backend
        },
      }
    );

    return {
      status: true,
      totalProducts: response.data.total_products,
      totalActiveProducts: response.data.total_active_products,
      totalInactiveProducts: response.data.total_inactive_products,
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

/**
 * @function getTotalUsers -get total users
 */
export async function getTotalUsers() {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // If the user token is not found
    if (!userToken) {
      return {
        status: false,
        message: "Please login to add items to your cart",
      };
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/total-users`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`, // this method requires the user to be authenticated and the token is to pass the sanctum middleware in the backend
        },
      }
    );

    return {
      status: true,
      totalUsers: response.data.total_users,
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

/**
 * @function getTotalRevenueOfMonth -get total revenue of the current month
 */
export async function getTotalRevenueOfMonth() {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // If the user token is not found
    if (!userToken) {
      return {
        status: false,
        message: "Please login to add items to your cart",
      };
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/this-month-revenue`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`, // this method requires the user to be authenticated and the token is to pass the sanctum middleware in the backend
        },
      }
    );

    return {
      status: true,
      dateDetails: response.data.date_details,
      totalRevenue: response.data.total_revenue,
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

/**
 * @function getUserSignupStatistics -get user signup statistics for the past 3 months
 */
export async function getUserSignupStatistics() {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // If the user token is not found
    if (!userToken) {
      return {
        status: false,
        message: "Please login to add items to your cart",
      };
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/signup-statistics`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`, // this method requires the user to be authenticated and the token is to pass the sanctum middleware in the backend
        },
      }
    );

    return {
      status: true,
      growthData: response.data.growth_data,
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

/**
 * @function getMonthlyRevenueStatistics -get monthly revenue statistics for the past 2 months
 */
export async function getMonthlyRevenueStatistics() {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // If the user token is not found
    if (!userToken) {
      return {
        status: false,
        message: "Please login to add items to your cart",
      };
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/monthly-revenue`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`, // this method requires the user to be authenticated and the token is to pass the sanctum middleware in the backend
        },
      }
    );

    return {
      status: true,
      revenueData: response.data.revenue,
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

/**
 * @function getLastOrders - Get latest 8 orders for admin dashboard
 */
export async function getLastOrders() {
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
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/last-orders`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return {
      status: true,
      orders: response.data.orders,
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

/**
 * @function getSystemLogs - Fetches latest 15 system logs from the server.
 */
export async function getSystemLogs() {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // If the user token is not found
    if (!userToken) {
      return {
        status: false,
        message: "Please login to add items to your cart",
      };
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/system-performance-logs`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`, // this method requires the user to be authenticated and the token is to pass the sanctum middleware in the backend
        },
      }
    );

    return {
      status: true,
      logs: response.data.performance_logs,
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

/**
 * @function getMostViewedProducts - Fetches most viewed products from the server.
 */
export async function getMostViewedProducts() {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // If the user token is not found
    if (!userToken) {
      return {
        status: false,
        message: "Please login to add items to your cart",
      };
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/most-viewed-products`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`, // this method requires the user to be authenticated and the token is to pass the sanctum middleware in the backend
        },
      }
    );

    return {
      status: true,
      productsData: response.data.products_data,
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
