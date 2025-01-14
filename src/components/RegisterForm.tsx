"use client";

import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";

// Import the handleRegisterSubmit function from the auth util file in the utils folder
import { handleRegisterSubmit } from "@/services/auth-services";
import Link from "next/link";

export default function RegisterForm() {
  const [state, registerAction] = useActionState(handleRegisterSubmit, null);

  return (
    <>
      <form
        action={registerAction}
        className="flex flex-col gap-4 w-full max-w-md rounded-md p-4 shadow-md"
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
            {/* if there is an error show it */}
            {state.error && `: ${state.error}`}
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
      Register
    </button>
  );
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
