"use server";

// Import axios for the API requests
import axios from "axios";

// Import the cookies from the next/headers module
import { cookies } from "next/headers";

// Client-side API URL
/**
 * @function checkout - Checkout the cart items for the user
 * @param {string} paymentMethod - The payment method selected by the user
 */
export async function checkout(paymentMethod: string) {
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

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/checkout`,
      {
        payment_method: paymentMethod,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`, // this method requires the user to be authenticated and the token is to pass the sanctum middleware in the backend
        },
      }
    );

    return {
      status: true,
      message: response.data.message,
      orderUUID: response.data.order_uuid,
      totalPrice: response.data.total_price,
      shippingAddress: response.data.shipping_address,
      paymentMethod: response.data.payment_method,
      orderStatus: response.data.order_status,
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
 * @function getAllUserOrders - Get all the orders history for the user
 */
export async function getAllUserOrders(currentPage: number, perPage: number) {
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
      `${process.env.NEXT_PUBLIC_APP_URI}/user-orders?page=${currentPage}&perPage=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`, // this method requires the user to be authenticated and the token is to pass the sanctum middleware in the backend
        },
      }
    );

    return {
      status: true,
      message: response.data.message,
      orders: response.data.orders.data,
      totalOrders: response.data.total_orders,
      currentPage: response.data.orders.current_page,
      totalPages: response.data.orders.last_page,
      perPage: response.data.orders.per_page,
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
 * @function getOrderByUUID - Get order by UUID for the user
 * @param {string} UUID - The UUID of the order to get the order details
 */
export async function getOrderByUUID(UUID: string) {
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
      `${process.env.NEXT_PUBLIC_APP_URI}/order-details/${UUID}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`, // this method requires the user to be authenticated and the token is to pass the sanctum middleware in the backend
        },
      }
    );

    return {
      status: true,
      order: response.data.order,
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

// ------------------------------------------------------
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

/**
 * @function getOrderById - Get order by id for admin
 * @param {string} orderId - The order id to get the order details
 *
 * @returns {Promise<{ status: boolean; order?: Order }>} - The order details
 */
export async function getOrderById(orderId: string) {
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
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/order/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`, // this method requires the user to be authenticated and the token is to pass the sanctum middleware in the backend
        },
      }
    );

    return {
      status: true,
      order: response.data.order,
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
 * @function updateOrderDetails - Update order details for admin
 */
export async function updateOrderDetails(formData: any) {
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

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/update-order`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`, // this method requires the user to be authenticated and the token is to pass the sanctum middleware in the backend
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
}

/**
 * @function removeOrderItem - Remove order item for admin
 * @param {string} orderId - The order id to remove the order item
 * @param {string} orderItemId - The order item id to remove the order item
 */
export async function removeOrderItem(orderId: string, orderItemId: string) {
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

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/order-items/remove-item`,
      {
        order_id: orderId,
        item_id: orderItemId,
      },
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
    // // Log the error to the console
    console.error(error.response.data);

    // // Return the details of the error
    console.error(error.response.data.devMessage);

    return {
      status: false,
      message: error.response.data.message || "An error occurred",
    };
  }
}

/**
 * @function addOrderItem - Add order item for admin
 * @param {string} orderId - The order id to add the order item
 * @param {string} productId - The product id to add the order item
 * @param {number} quantity - The quantity of the product to add the order item
 */
export async function addOrderItem(
  orderId: string,
  productId: string,
  quantity: number
) {
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

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/order-items/add-item`,
      {
        order_id: orderId,
        product_id: productId,
        quantity: quantity,
      },
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
    // // Log the error to the console
    console.error(error.response.data);

    // // Return the details of the error
    console.error(error.response.data.devMessage);

    return {
      status: false,
      message: error.response.data.message || "An error occurred",
    };
  }
}

/**
 * @function updateOrderItemQuantity - Update order item quantity for admin
 * @param {string} orderId - The order id to update the order item quantity
 * @param {string} orderItemId - The order item id to update the order item quantity
 * @param {number} quantity - The quantity of the product to update the order item quantity
 */
export async function updateOrderItemQuantity(
  orderId: string,
  orderItemId: string,
  quantity: number
) {
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

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/order-items/update-item-quantity`,
      {
        order_id: orderId,
        item_id: orderItemId,
        quantity: quantity,
      },
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
    // // Log the error to the console
    console.error(error.response.data);

    // // Return the details of the error
    console.error(error.response.data.devMessage);

    return {
      status: false,
      message: error.response.data.message || "An error occurred",
    };
  }
}

/**
 * @function updateOrderStatus - Update order status for admin
 * @param {string} orderId - The order id to update the order status
 * @param {string} status - The status to update the order status
 */
export async function updateOrderStatus(orderId: string, status: string) {
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

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/change-order-status/${orderId}`,
      {
        status,
      },
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
}

/**
 * @function getSalesReport - Get sales report for admin based on the date range
 * * @param {string} startDate - The start date of the report
 * @param {string} endDate - The end date of the report
 */
export async function getSalesReport(
  startDate: string,
  endDate: string,
  perPage: number,
  currentPage: number
) {
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
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/sales-report?start_date=${startDate}&end_date=${endDate}&per_page=${perPage}&page=${currentPage}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return {
      status: true,
      message: response.data.message,
      report: response.data.report.data,
      currentPage: response.data.report.current_page,
      perPage: response.data.report.per_page,
      totalPages: response.data.report.last_page,
      totalReports: response.data.report.total,
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
