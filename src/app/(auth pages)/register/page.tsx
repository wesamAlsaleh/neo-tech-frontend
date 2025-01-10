"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";

// Import the axios library for making HTTP requests
import axios from "axios";

// Import the useRouter hook to redirect to another page after successful registration
import { useRouter } from "next/navigation";

export default function Page() {
  // State for status and error messages
  const [status, setStatus] = useState("");

  // Error handling state
  const [error, setError] = useState(""); // For capturing error messages

  // router instance for redirecting to another page
  const router = useRouter();

  // Function to handle form submission
  async function handleRegisterSubmit(event: FormEvent<HTMLFormElement>) {
    // Prevent the default form submission behavior (refreshing the page)
    event.preventDefault();

    // Get the form data
    const formData = new FormData(event.currentTarget);

    // Extract the form data fields
    const first_name = formData.get("first_name");
    const last_name = formData.get("last_name");
    const email = formData.get("email");
    const password = formData.get("password");
    const phone_number = formData.get("phone_number");

    // Send a POST request to the server with the form data
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URI}/register`,
        {
          first_name,
          last_name,
          email,
          password,
          phone_number,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle successful response
      if (response.status === 201) {
        // Extract the response data from the server response
        const responseData = response.data;

        // Set the status message from the response
        setStatus(responseData.message);

        setError(""); // Reset any previous errors

        // Store the token in localStorage (or use cookies for more secure storage)
        localStorage.setItem("userToken", responseData.data.token);

        // Redirect to home page
        router.push("/");
      } else {
        // Handle error response
        setStatus(""); // Clear status on error

        setError(
          response.data.error || "An error occurred during registration."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus(""); // Clear status on error
      setError("An unexpected error occurred.");
    }
  }

  return (
    <div>
      <h1 style={{ color: "blue" }} className="font-bold text-4xl mb-4">
        Register Page
      </h1>

      <form onSubmit={handleRegisterSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          required
        />
        <input type="text" name="last_name" placeholder="Last Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <input
          type="tel"
          name="phone_number"
          maxLength={8}
          placeholder="Phone Number"
          required
        />
        <button type="submit" className="border p-2 bg-primary text-white">
          Register
        </button>
      </form>

      {/* Display status or error */}
      <p className={`text-green-500 mt-4`}>{status}</p>
      <p className={`text-red-500 mt-4`}>{error}</p>

      <Link href="/" className="font-bold text-red-500 mt-4">
        Cancel and go back
      </Link>
    </div>
  );
}
