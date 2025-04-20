"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// import the auth context
import { useAuth } from "@/contexts/AuthContext";

// Import Components
import Breadcrumb from "@/components/PageBreadcrumb";
import UserProfileForms from "@/components/UserProfileForms";
import UserOrdersHistory from "@/components/UserOrdersHistory";
import { handleLogout } from "@/services/auth-services";

export default function page() {
  // Get the current user from the auth context
  const {
    user,
    userAddress,
    setUserAddress,
    setUser,
    setUserCartItemsCount,
    setUserWishlistCount,
  } = useAuth();

  // Router instance
  const router = useRouter();

  // State to store the form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to handle the logout form submission
  const handleLogoutSubmit = async () => {
    // Set the form submission status to true to disable the submit button
    setIsSubmitting(true);

    // Call the logout service
    const response = await handleLogout();

    // Redirect to the home page after the logout is successful
    if (response.status) {
      // Clear the user data from the auth context and redirect to the home page
      setUser(null);
      setUserAddress(null);
      setUserCartItemsCount(0);
      setUserWishlistCount(0);

      router.push("/home");
    }
  };

  // If the user is not logged in, display a message
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h1 className="text-2xl font-semibold text-gray-500 mb-4">
          Please login to view your account details
        </h1>

        <p className="text-gray-500 mb-4">
          You need to login to access this page. Please click the button below
          to login.
        </p>

        <Link
          href="/login"
          className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    // Page Layout div
    <div className="flex flex-col p-4">
      {/* Header Section Container */}
      <div className="flex items-center justify-between">
        <Breadcrumb
          firstLink="/profile"
          firstTitle="My Account"
          firstTitleCN="text-black font-semibold"
        />

        <h1 className="font-bold text-black">
          Welcome{" "}
          <span className="text-orange-600">{`${user?.first_name} ${user?.last_name}`}</span>
        </h1>
      </div>

      {/* Page title Container */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-start text-gray-800">
          Manage My Account
        </h1>
      </div>

      {/* Form */}
      <UserProfileForms user={user} userAddress={userAddress} />

      {/* Logout Button */}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={isSubmitting}
          className="mt-8 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed w-full"
          onClick={() => handleLogoutSubmit()}
        >
          {isSubmitting ? "Logging Out" : "Logout"}
        </button>
      </div>
    </div>
  );
}
