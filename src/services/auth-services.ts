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
      userCartItemsCount: response.data.userCartItemsCount,
      userWishlistItemsCount: response.data.userWishlistCount,
      userAddress: response.data.userAddress, // User address data or null if not available
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
 * @function getUserRole - Retrieves the user role from the server using the auth token stored in cookies.
 */
export async function getUserRole(): Promise<{
  status: boolean;
  message?: string;
  userRole?: string;
}> {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // If the user token is not found
    if (!userToken) {
      return {
        status: false,
        message: "Please login to update your profile",
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
      status: true,
      userRole: response.data.userRole,
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
 * @function handleLogout - Handles the logout process by removing the user token and role from cookies
 */
export async function handleLogout() {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // If the user token is not found
    if (!userToken) {
      return {
        status: false,
        message: "Token not found in cookies.",
      };
    }

    // Remove the user token from the cookies
    cookieStore.delete("userToken");

    // Remove the user role from the cookies
    cookieStore.delete("userRole");

    // Revoke the user token from the server
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/logout`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        timeout: 5000, // 5 seconds timeout (meaning the server will wait for 5 seconds before timing out)
      }
    );

    return {
      success: true,
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
 * @function updateProfile - Update the user profile data on the server.
 */
export async function updateProfile(formData: FormData) {
  try {
    // get user token from cookies
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    // If the user token is not found
    if (!userToken) {
      return {
        status: false,
        message: "Please login to update your profile",
      };
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/update-user`,
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
