"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";

// Import the useRouter hook to access the router object in the component
import { useRouter } from "next/navigation";

// Import axios to make HTTP requests
import axios from "axios";

export default function page() {
  // status state
  const [status, setStatus] = useState("");

  // Create a router object to navigate to other pages in the app
  const router = useRouter();

  // Create an async function to handle the form submission
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Prevent the default form submission behavior which refreshes the page when the form is submitted
    event.preventDefault();

    // Get the form data from the form element that triggered the submit event
    const formData = new FormData(event.currentTarget);

    // Get the values from the form data
    const first_name = formData.get("first_name");
    const last_name = formData.get("last_name");
    const email = formData.get("email");
    const password = formData.get("password");
    const phone_number = formData.get("phone_number");

    // Make a POST request to the /register endpoint with the form data
    axios
      .post(
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
      )
      .then((response) => {
        // Set the status message
        setStatus(`${response.status}`);

        // Redirect to the home page if the login is successful
        router.push("/");
      })
      .catch((error) => {
        // Handle errors
        console.error("Registration failed");
      });
  }

  return (
    <div>
      <h1 style={{ color: "blue" }} className="font-bold text-4xl mb-4">
        register page
      </h1>
      <br />
      {/* register form */}
      <form onSubmit={handleSubmit} className="flex justify-center space-y-4">
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
          max={8}
          placeholder="Phone Number"
          required
        />

        <button type="submit" className="border p-2 bg-primary text-white">
          Register
        </button>
      </form>

      {/* request status */}
      <p className={`text-green-500`}>{status}</p>

      {/* cancel and go back */}
      <button>
        <Link href={"/"} className="font-bold text-red-500">
          Cancel and go back
        </Link>
      </button>
    </div>
  );
}
