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

const AdBannerSection = dynamic(() => import("@/components/AdBannerSection"), {
  ssr: false,
});

const ExploreProductsSection = dynamic(
  () => import("@/components/ExploreProductsSection"),
  {
    ssr: false,
  }
);

const TrustBadgesSection = dynamic(
  () => import("@/components/TrustBadgesSection"),
  {
    ssr: false,
  }
);

export default function homePage() {
  return (
    <>
      {/* TODO: Hero Section */}
      <HeroSection />

      {/* TODO: Flash Sales Section, require productsManagement update */}
      <FlashSalesSection />

      {/* Browse Category Section  */}
      <BrowseByCategorySection />

      {/* Best Selling Section */}
      <BestSellingProductsSection />

      {/* TODO: Special Banner Section */}
      <AdBannerSection />

      {/* Explore Products Section */}
      <ExploreProductsSection />

      {/* TODO: New Arrival Section */}

      {/* Trust Badges Section */}
      <TrustBadgesSection />
    </>
  );
}
