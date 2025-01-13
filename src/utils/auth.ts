"use server";

import { cookies } from "next/headers";
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
      name: "authToken",
      value: response.data.data.token,
      httpOnly: true,
      path: "/",
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

// {
//   "status": "success",
//   "message": "User created successfully",
//   "data": {
//       "user": {
//           "first_name": "Ali",
//           "last_name": "Esa",
//           "email": "wesammuneerali8003z@gmail.com",
//           "phone_number": "11111172",
//           "updated_at": "2025-01-13T01:19:20.000000Z",
//           "created_at": "2025-01-13T01:19:20.000000Z",
//           "id": 37
//       },
//       "token": "39|wnYwAqIBcJcyUvlHonYvGoNHPZ7hCDwsiFee3bAoa33293fe"
//   }
// }
