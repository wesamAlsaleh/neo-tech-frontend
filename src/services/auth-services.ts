"use server";

import { cookies } from "next/headers";

//
import axios from "axios";

type RegisterUserData = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
};

type LoginUserData = {
  email: string;
  password: string;
};

// Handle registration form submission to the server
export async function handleRegisterSubmit(prevState: any, formData: FormData) {
  // Get the cookies
  const cookieStore = await cookies();

  try {
    // Manual validation of the form data by converting FormData to UserData object using the RegisterUserData interface
    const userData: RegisterUserData = {
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
      error: error.response?.data?.errorMessage || error.message,
    };
  }
}

// Response from the server when a user is registered successfully
// {
//   "message": "User created successfully",
//   "userData": {
//       "user": {
//           "first_name": "Ali",
//           "last_name": "Esa 3",
//           "email": "wesammuneerali80sq0@gmail.com",
//           "phone_number": "33333333",
//           "updated_at": "2025-01-15T00:59:38.000000Z",
//           "created_at": "2025-01-15T00:59:38.000000Z",
//           "id": 11
//       },
//       "token": "14|k6LrmI5C4EnohZpp22m5uIW5PdIEY1TvCAyzVg1kec594a19"
//   }
// }

// Response from the server when a user is not registered unsuccessfully
// {
//   "message": "User not created",
//   "errorMessage": "The email has already been taken. (and 1 more error)"
// }

// Handle login form submission to the server
export async function handleLoginSubmit(prevState: any, formData: FormData) {
  // Get the cookies to save the token
  const cookieStore = await cookies();

  try {
    // Manual validation of the form data
    const userData: LoginUserData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/login`,
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
    };
  }
}

// Response from the server when a user is logged in successfully
// {
//   "message": "User logged in successfully",
//   "userData": {
//       "user": {
//           "id": 5,
//           "first_name": "Wesam",
//           "last_name": "Muneer",
//           "email": "wesammuneer@gmail.com",
//           "email_verified_at": null,
//           "role": "user",
//           "phone_number": "37234155",
//           "created_at": "2025-01-13T17:45:12.000000Z",
//           "updated_at": "2025-01-13T17:45:12.000000Z"
//       },
//       "token": "15|bFIVNgp1o95cGOBa5DZOPd8xHpFfD8R4YkSgZbrfff4a287a"
//   }
// }

// Response from the server when a user is not logged in successfully
// {
//   "message": "Invalid credentials"
// }

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
      userData: response.data.userData,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An unexpected error occurred. GetUser service failed.",
    };
  }
}

// Response from the server when a user is retrieved successfully
// {
//   "message": "User retrieved successfully",
//   "userData": {
//       "id": 5,
//       "first_name": "Wesam",
//       "last_name": "Muneer",
//       "email": "wesammuneer@gmail.com",
//       "email_verified_at": null,
//       "role": "user",
//       "phone_number": "37234155",
//       "created_at": "2025-01-13T17:45:12.000000Z",
//       "updated_at": "2025-01-13T17:45:12.000000Z"
//   }
// }

// Response from the server when a user is not retrieved successfully
// {
//   "message": "Unauthenticated."
// }
