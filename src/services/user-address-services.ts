"use server";

// Import axios for the API requests
import axios from "axios";

// Import the cookies from the next/headers module
import { cookies } from "next/headers";

/**
 * @function putAddress - Create or update the user address based on the newAddress parameter
 * @param formData - The form data to be sent to the server
 * @param newAddress - A boolean indicating whether to create a new address or update an existing one
 */
export async function putAddress(formData: FormData, newAddress: boolean) {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // If the user token is not found
    if (!userToken) {
      return {
        status: false,
        message: "Please login to your account",
      };
    }

    // Put the API request URL based on the newAddress parameter (if the userAddress is null or not for creating a new address or updating an existing one)
    const requestURL = `${newAddress ? "add-address" : "update-address"}`;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/${requestURL}`,
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
