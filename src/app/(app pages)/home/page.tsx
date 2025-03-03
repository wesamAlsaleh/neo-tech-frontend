"use client";

import React from "react";
import dynamic from "next/dynamic"; // dynamic import for custom components

// import custom components
import LoadingSpinner from "@/components/LoadingSpinner";

// import custom components with dynamic import for better performance
const HeroSection = dynamic(() => import("@/components/HeroSection"), {});

const FlashSalesSection = dynamic(
  () => import("@/components/FlashSalesSection")
);

const BrowseByCategorySection = dynamic(
  () => import("@/components/BrowseByCategorySection"),
  { ssr: false }
);

const BestSellingProductsSection = dynamic(
  () => import("@/components/BestSellingProductsSection"),
  { ssr: false }
);

export default function homePage() {
  return (
    <>
      {/* Hero section with side bar */}
      <HeroSection />

      {/* TODO: flash sales section, require productsManagement update */}
      <FlashSalesSection />

      {/* Browse Category Section  */}
      <BrowseByCategorySection />

      {/* Best Selling Section */}
      <BestSellingProductsSection />
    </>
  );
}
