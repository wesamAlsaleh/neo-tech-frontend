import React from "react";

// import custom components
import ShopFeaturesList from "@/components/ShopFeaturesList";
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";

export default function page() {
  return (
    <>
      {/* Page Title */}
      <PageTitle
        title="Customize NeoTech Shop"
        subtitle="Customize your shop features"
      />

      {/* Customize actions container */}
      {/* Customize actions container */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6 p-4">
        {/* Customize Banner */}
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-3 shadow-md transition duration-300 ">
          Customize Banner
        </button>

        {/* Customize Shop Features */}
        <button className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-3 shadow-md transition duration-300 ">
          Customize NeoTech Trust Badges
        </button>

        {/* TODO: add action here soon */}
        <button className="bg-violet-500 hover:bg-violet-600 text-white font-semibold rounded-lg px-4 py-3 shadow-md transition duration-300 ">
          Customize Image Carousels (Coming Soon)
        </button>

        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-4 py-3 shadow-md transition duration-300 ">
          Customize NeoTech Sales (Coming Soon)
        </button>

        {/* Add more buttons as needed */}
      </div>
    </>
  );
}
