"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false); // loading state
  const [message, setMessage] = useState<string | null>(null); // Message state
  const [error, setError] = useState<string | null>(null); // Error state

  // IMPORTANT NOTE: handle submit function calls the handler function indirectly (submit.ts), This happens when handleSubmit sends a POST request to the API route where handler is defined.
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // Prevent the default form submission
    event.preventDefault();

    // Set loading to true when the request starts
    setIsLoading(true);

    try {
      // Clear the message and error states
      setMessage(null);
      setError(null);

      // Get the form data
      const formData = new FormData(event.currentTarget);

      const userData = {
        first_name: formData.get("first_name") as string,
        last_name: formData.get("last_name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        phone_number: formData.get("phone_number") as string,
      };

      // Request to the server to register the user
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URI}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      // Handle the response from the server (for example, display the status message)
      const data = await response.json();

      setMessage(data.message);
      setError(data.error);

      console.log(data);
    } catch (error) {
      // Handle error if necessary
      console.error(error);
    } finally {
      setIsLoading(false); // Set loading to false when the request completes
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
          required
          className="p-2 border"
        />

        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          required
          className="p-2 border"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="p-2 border"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="p-2 border"
        />

        <input
          type="tel"
          name="phone_number"
          maxLength={8}
          placeholder="Phone Number"
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
