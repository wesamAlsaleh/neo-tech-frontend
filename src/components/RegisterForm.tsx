"use client";

import React, { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";

// Import the handleRegisterSubmit function from the auth util file in the utils folder
import { handleRegisterSubmit } from "@/services/auth-services";

// import router from the next/navigation module to redirect the user to the home page after successful registration
import { useRouter } from "next/navigation";

// Import the useAuth hook from the auth context
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterForm() {
  // Get the user setter from the auth context
  const {
    setUser,
    setUserAddress,
    setUserCartItemsCount,
    setUserWishlistCount,
  } = useAuth();

  // Get the router object from the useRouter hook
  const router = useRouter();

  // useActionState hook to handle the form submission
  const [state, registerAction] = useActionState(handleRegisterSubmit, null);

  // Redirect the user to the home page after registration is successful
  useEffect(() => {
    if (state?.status) {
      // Set the user data in the auth context to access them in the app
      setUser(state.userData);
      setUserAddress(state.userAddress);
      setUserCartItemsCount(state.userCartItemsCount);
      setUserWishlistCount(state.userWishlistItemsCount);

      // Redirect the user to the home page
      router.push("/home");
    }
  }, [state?.status, router]);

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
              state.status ? "text-green-500" : "text-red-500"
            }`}
          >
            {/* success or fail message with details */}
            {`${state.message}`}
          </div>
        )}
      </form>

      {/* home page button */}
      {state?.status === false && (
        <Link href="/">
          <button
            className={`border p-2 font-bold mt-4 shadow-md text-red-500`}
          >
            Cancel and Go to Home Page
          </button>
        </Link>
      )}

      {/* login page button */}
      <Link href="/login">
        <button className="border p-2 font-bold mt-4 shadow-md text-indigo-600">
          Go to Login Page
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

// Response from the server when a user is created successfully
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
