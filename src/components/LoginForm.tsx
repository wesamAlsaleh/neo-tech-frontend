"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";

// Import the handleLoginSubmit function from the auth util file in the utils folder
import { handleLoginSubmit } from "@/services/auth-services";

export default function LoginForm() {
  const [state, loginAction] = useActionState(handleLoginSubmit, null);

  return (
    <>
      <form
        action={loginAction}
        className="flex flex-col gap-4 w-full max-w-md rounded-md p-4 shadow-md"
      >
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

        {/* Submit button */}
        <SubmitButton />

        {/* Display form status */}
        {state && (
          <div
            className={`mt-4 p-2 text-center ${
              state.success ? "text-green-500" : "text-red-500"
            }`}
          >
            {/* success or fail message */}
            {state.message}
          </div>
        )}
      </form>

      {/* home page button */}
      <Link href="/">
        <button
          className={`border p-2 font-bold mt-4 shadow-md  ${
            state?.success ? "text-green-500" : "text-red-500"
          }`}
        >
          {state?.success ? "Go to Home Page" : "Cancel and Go to Home Page"}
        </button>
      </Link>

      {/* Register page button */}
      <Link href="/register">
        <button className="border p-2 font-bold mt-4 shadow-md text-sky-600">
          Go to Register Page
        </button>
      </Link>
    </>
  );
}

// Child component required by the parent component for the hook to work
function SubmitButton() {
  // Get the pending status from the useFormStatus hook in the react-dom library
  const { pending } = useFormStatus(); // useFormStatus is going to take care of the pending state of the form above

  return (
    <button
      type="submit"
      className="border p-2 bg-primary text-white shadow-md"
      disabled={pending}
    >
      Login
    </button>
  );
}
