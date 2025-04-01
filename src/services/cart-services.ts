"use server";

// Import axios for the API requests
import axios from "axios";

// Import the cookies from the next/headers module
import { cookies } from "next/headers";

/**
 * @function getUserCart - Get the user's cart
 */
export async function getUserCart() {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // If the user token is not found, get the cart from local storage
    if (!userToken) {
      // Check if there are items in local storage
      const cartItems = JSON.parse(localStorage.getItem("cart_items") || "[]");

      // Parse the cart items from local storage into a JavaScript object
      const parsedCartItems = JSON.parse(cartItems);

      return {
        status: true,
        message: "Cart items retrieved successfully",
        cart: parsedCartItems,
        totalItemsInCart: 1, // Assuming only one item in local storage for simplicity
        totalPrice: parsedCartItems.quantity * parsedCartItems.price, // Assuming price is available in local storage
      };
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/cart`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`, // this method requires the user to be authenticated and the token is to pass the sanctum middleware in the backend
        },
      }
    );

    return {
      status: true,
      message: response.data.message,
      cart: response.data.cart,
      totalItemsInCart: response.data.total_items,
      totalPrice: response.data.total_price,
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
 * @function addProductToCart - Add an item to the user's cart
 * @param {string} productId - The ID of the product to add to the cart
 * @param {number} quantity - The quantity of the product to add to the cart
 */
export async function addProductToCart(productId: string, quantity: number) {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // If the user token is not found, store the cart in local storage
    if (!userToken) {
      const cartItems = JSON.parse(localStorage.getItem("cart_items") || "[]");

      // Check if the item already exists in the cart
      const existingItemIndex = cartItems.findIndex(
        (item: any) => item.productId === productId
      );
      if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        cartItems.push({ productId, quantity });
      }

      // Save back to localStorage
      localStorage.setItem("cart_items", JSON.stringify(cartItems));

      return {
        status: true,
        message: "Added to cart successfully",
      };
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/cart`,
      { product_id: productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${userToken}`, // this method requires the user to be authenticated and the token is to pass the sanctum middleware in the backend
        },
      }
    );

    return {
      status: true,
      message: response.data.message,
      productId: response.data.cart_item.product_id,
      productName: response.data.cart_item.product_name,
      quantity: response.data.cart_item.quantity,
      unitPrice: response.data.cart_item.unit_price,
      totalPrice: response.data.cart_item.total_price,
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
 * @function updateCart - Update the quantity of an item in the user's cart
 * @param {string} productId - The ID of the product to update in the cart
 */
export async function updateCart(productId: string, quantity: number) {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // If the user token is not found, update the cart in local storage
    if (!userToken) {
      const cartItems = JSON.parse(localStorage.getItem("cart_items") || "[]");
      const itemIndex = cartItems.findIndex(
        (item: any) => item.productId === productId
      );

      if (itemIndex !== -1) {
        cartItems[itemIndex].quantity = quantity;
        localStorage.setItem("cart_items", JSON.stringify(cartItems));
        return {
          status: true,
          message: "Cart updated successfully",
          cart: cartItems,
        };
      }

      return { status: false, message: "Item not found in cart" };
    }

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_APP_URI}/cart/${productId}`,
      { quantity },
      {
        headers: {
          Authorization: `Bearer ${userToken}`, // this method requires the user to be authenticated and the token is to pass the sanctum middleware in the backend
        },
      }
    );

    return {
      status: true,
      message: response.data.message,
      productId: response.data.cart_item.product_id,
      productName: response.data.cart_item.product_name,
      quantity: response.data.cart_item.quantity,
      unitPrice: response.data.cart_item.unit_price,
      totalPrice: response.data.cart_item.total_price,
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
 * @function removeFromCart - Remove an item from the user's cart
 * @param {string} productId - The ID of the product to remove from the cart
 */
export async function removeProductFromCart(productId: string) {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // If the user token is not found, remove the cart from local storage
    if (!userToken) {
      const cartItems = JSON.parse(localStorage.getItem("cart_items") || "[]");
      const filteredCart = cartItems.filter(
        (item: any) => item.productId !== productId
      );
      localStorage.setItem("cart_items", JSON.stringify(filteredCart));
    }

    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_APP_URI}/cart/{cartItemId}${productId}`,
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
