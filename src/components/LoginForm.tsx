"use client";

import React, { useActionState, useEffect } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";

// Import the handleLoginSubmit function from the auth util file in the utils folder
import { handleLoginSubmit } from "@/services/auth-services";

// import router from the next/navigation module to redirect the user to the home page after successful login
import { useRouter } from "next/navigation";

export default function LoginForm() {
  // Get the router object from the useRouter hook
  const router = useRouter();

  const [state, loginAction] = useActionState(handleLoginSubmit, null);

  // Redirect the user to the home page after login is successful
  useEffect(() => {
    if (state?.success) {
      router.push("/home");
    }
  }, [state?.success, router]);

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
            {/* success or fail message without details! */}
            {state.message}
          </div>
        )}
      </form>

      {/* home page button */}
      {state?.success === false && (
        <Link href="/">
          <button
            className={`border p-2 font-bold mt-4 shadow-md text-red-500`}
          >
            Cancel and Go to Home Page
          </button>
        </Link>
      )}

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
