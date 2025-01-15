"use server";

import { cookies } from "next/headers";

//
import axios from "axios";

type UserData = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
};

// Handle registration form submission to the server
export async function handleRegisterSubmit(prevState: any, formData: FormData) {
  // Get the cookies
  const cookieStore = await cookies();

  try {
    // Convert FormData to UserData object
    const userData: UserData = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      phone_number: formData.get("phone_number") as string,
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/register`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    // Save the token in a cookie
    cookieStore.set({
      name: "userToken", // Cookie name
      value: response.data.data.token, // Save the token in the cookie
      httpOnly: true, // Make it accessible only on the server side
      path: "/", // Root path to make it accessible everywhere in the app
    });

    // Return the response data
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while registering using handleRegisterSubmit",
      error: error.response?.data?.error || error.message,
    };
  }
}

// Handle get user data to the server
export async function getUser() {
  try {
    // Access the cookies
    const cookieStore = cookies();

    // Extract the auth token
    const authToken = (await cookieStore).get("authToken")?.value;

    if (!authToken) {
      return {
        success: false,
        message: "Auth token not found in cookies.",
      };
    }

    // Request the user data using the token
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/user`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        timeout: 5000, // 5 seconds timeout
      }
    );

    // Return success and user data
    return {
      success: true,
      message: response.data.message,
      userData: response.data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An unexpected error occurred. handler!",
    };
  }
}
