"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false); // loading state
  const [message, setMessage] = useState<string | null>(null); // Message state
  const [error, setError] = useState<string | null>(null); // Error state

  // IMPORTANT NOTE: handle submit function calls the handler function indirectly (submit.ts), This happens when handleSubmit sends a POST request to the API route where handler is defined.
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // prevent the default form submission
    setIsLoading(true); // set loading to true

    try {
      // Reset the message and error states
      setMessage(null);
      setError(null);

      // Get the form data
      const formData = new FormData(event.currentTarget);

      // Create a user data object from the form data
      const userData = {
        first_name: formData.get("first_name") as string,
        last_name: formData.get("last_name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        phone_number: formData.get("phone_number") as string,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URI}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      // Get the response data as JSON and set the message or error
      const data = await response.json();

      // Set the message or error based on the response data
      setMessage(data.message || "Registration successful!");
      setError(data.error || null);
    } catch (error) {
      // Log the error and set the error message
      console.error("Error during submission:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="font-bold text-4xl mb-4 text-blue-600">Register Page</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          defaultValue={""}
          required
          className="p-2 border"
        />

        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          defaultValue={""}
          required
          className="p-2 border"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          defaultValue={""}
          required
          className="p-2 border"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          defaultValue={""}
          required
          className="p-2 border"
        />

        <input
          type="tel"
          name="phone_number"
          maxLength={8}
          placeholder="Phone Number"
          defaultValue={""}
          required
          className="p-2 border"
        />

        <button
          type="submit"
          className="border p-2 bg-blue-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Register"}
        </button>
      </form>

      {/* if no error show the message */}
      {error ? null : (
        <p className="mt-4 text-green-500 font-bold">{message}</p>
      )}

      {error && <p className="mt-4 text-red-500 font-bold">{error}</p>}

      <Link href="/">
        <button className="border p-2 font-bold text-red-500 mt-4">
          Cancel and go back
        </button>
      </Link>
    </div>
  );
}
