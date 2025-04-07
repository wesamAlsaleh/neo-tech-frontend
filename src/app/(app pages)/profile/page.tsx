"use client";

import React from "react";
import { useRouter } from "next/navigation";

// import the auth context
import { useAuth } from "@/contexts/AuthContext";

// Import Components
import Breadcrumb from "@/components/PageBreadcrumb";
import UserProfileForms from "@/components/UserProfileForms";

export default function page() {
  // Get the current user from the auth context
  const { user, userAddress } = useAuth();

  // Router instance
  const router = useRouter();

  // Check if the user is logged in, if not redirect to login page
  if (!user) {
    router.push("/login");
    return null; // Prevent rendering the rest of the component
  }

  return (
    // Page Layout div
    <div className="flex flex-col gap-4 p-4">
      {/* Header Section Container */}
      <div className="flex items-center justify-between">
        <Breadcrumb
          firstLink="/profile"
          firstTitle="My Account"
          firstTitleCN="text-black font-semibold"
        />

        <h1 className="font-bold">
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
