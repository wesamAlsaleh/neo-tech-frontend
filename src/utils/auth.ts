import axios from "axios";

export default async function handleRegisterSubmit(userData: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
}) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URI}/register`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        // withCredentials: true, // Enable cookies if needed
      }
    );

    // Successful registration
    if (response.status === 201) {
      // Extract the response data from the server response
      const responseData = response.data;

      // Store the token in localStorage (or use cookies for more secure storage)
      localStorage.setItem("userToken", responseData.data.token);
      return {
        success: true,
        message: response.data.message || "Registration successful.",
        responseData: response.data.data, // Return the user data
      };
    } else if (response.status === 500) {
      return {
        success: false,
        message: response.data.message || "Registration failed.",
        error: response.data.error || "Error occurred.",
      };
    } else
      return {
        success: false,
        error: "Unexpected response from the server.",
      };
  } catch (error: any) {
    // Handle general server errors
    return {
      success: false,
    };
  }
}
