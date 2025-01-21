"use server";

// Import the cookies from the next/headers module
import { cookies } from "next/headers";

// import axios to make requests to the server
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

    // Save the token in a cookie  @NOTE: consider adding secure: true and sameSite: "Strict" for better security
    cookieStore.set({
      name: "userToken", // Cookie name
      value: response.data.userData.token, // Save the token in the cookie
      secure: true, // Make it accessible only on the server side and not on the client side
      httpOnly: true, // Make it accessible only on the server side
      path: "/", // Root path to make it accessible everywhere in the app
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // Expires in 7 days
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
//           "last_name": "Esa",
//           "email": "wesammuneerali800@gmail.com",
//           "phone_number": "23232323",
//           "updated_at": "2025-01-16T00:25:58.000000Z",
//           "created_at": "2025-01-16T00:25:58.000000Z",
//           "id": 6
//       },
//       "token": "14|D8qNtchclDPec24scFFTp9IzwvYxeNUbp37sk4bic5bc1bbc"
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
      value: response.data.userData.token, // Save the token in the cookie
      secure: true, // Make it accessible only on the server side and not on the client side
      httpOnly: true, // Make it accessible only on the server side
      path: "/", // Root path to make it accessible everywhere in the app
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // Expires in 7 days
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
    const cookieStore = await cookies();

    // Extract the auth token from the cookies
    const authToken = cookieStore.get("userToken")?.value;

    if (!authToken) {
      return {
        success: false,
        message: "Token not found in cookies.",
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

    // Check if the user role is stored in the cookies
    const hasRoleCookie = cookieStore.has("userRole");

    // If the role is stored in the cookies, delete it and set the new role
    if (hasRoleCookie) {
      (await cookies())
        .delete("userRole")
        .set("userRole", response.data.userData.role, { secure: true });
    }

    // Save the role in a cookie
    cookieStore.set({
      name: "userRole", // Cookie name
      value: response.data.userData.role, // Save the role in the cookie
      secure: true, // Make it accessible only on the server side and not on the client side
      httpOnly: true, // Make it accessible only on the server side
      path: "/", // Root path to make it accessible everywhere in the app
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // Expires in 7 days
    });

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

/**
 * Retrieves the user role by accessing the authentication token from cookies
 * and making a request to the user-role endpoint.
 *
 * @returns {Promise<{ success: boolean; message?: string; userRole?: string }>}
 * An object containing the success status, an optional message, and the user role if successful.
 *
 * @throws {Error} If an unexpected error occurs during the request.
 */
export async function getUserRole(): Promise<{
  success: boolean;
  message?: string;
  userRole?: string;
}> {
  try {
    // Access the cookies
    const cookieStore = cookies();

    // Extract the auth token from the cookies
    const userToken = (await cookieStore).get("userToken")?.value;

    if (!userToken) {
      return {
        success: false,
        message: "Token not found in cookies.",
      };
    }

    // Request the user data using the token
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/user-role`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        timeout: 5000, // 5 seconds timeout
      }
    );

    // Return success and user role
    return {
      success: true,
      userRole: response.data.userRole,
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

// Response from the server when a user role is retrieved successfully
// {
//   "message": "User role retrieved successfully",
//   "userRole": "admin"
// }

// Response from the server when a user role is not retrieved successfully
// {
//   "message": "Unauthenticated."
// }

// TODO: Handle logout
