"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// import the auth context
import { useAuth } from "@/contexts/AuthContext";

// Import Components
import Breadcrumb from "@/components/PageBreadcrumb";
import UserProfileForms from "@/components/UserProfileForms";
import UserOrdersHistory from "@/components/UserOrdersHistory";

export default function page() {
  // Get the current user from the auth context
  const { user, userAddress } = useAuth();

  // Router instance
  const router = useRouter();

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
    </div>
  );
}
