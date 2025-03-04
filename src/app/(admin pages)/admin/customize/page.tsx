"use client";

import React from "react";
import { useRouter } from "next/navigation";

// import custom components
import PageTitle from "@/components/PageTitle";

export default function page() {
  // Router instance
  const router = useRouter();

  return (
    <>
      {/* Page Title */}
      <PageTitle
        title="Customize NeoTech Shop"
        subtitle="Customize your shop features"
      />

      {/* Customize actions container */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6 p-4">
        {/* Customize Banner page link */}
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-3 shadow-md transition duration-300">
          Customize Banner
        </button>

        {/* Customize trust badges page link */}
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-3 shadow-md transition duration-300"
          onClick={() => router.push("/admin/customize/features")}
        >
          Customize NeoTech Trust Badges
        </button>

        {/* TODO: Image Carousels page link */}
        <button
          className="bg-violet-500 hover:bg-violet-600 text-white font-semibold rounded-lg px-4 py-3 shadow-md transition duration-300"
          onClick={() => {}}
        >
          Customize Image Carousels (Coming Soon)
        </button>

        <button
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-4 py-3 shadow-md transition duration-300"
          onClick={() => {}}
        >
          Customize NeoTech Sales (Coming Soon)
        </button>
      </div>
    </>
  );
}
