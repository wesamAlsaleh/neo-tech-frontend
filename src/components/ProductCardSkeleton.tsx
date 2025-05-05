"use client";

import React from "react";

export default function ProductCardSkeleton() {
  return (
    // product skeleton container
    <div className="relative p-4 h-full rounded-lg flex flex-col justify-between bg-gray-50 animate-pulse">
      {/* Product Image Skeleton */}
      <div className="flex items-center justify-center">
        <div className="w-52 h-52 bg-gray-200 rounded-lg" />
      </div>

      {/* Product Details Skeleton */}
      <div className="mt-3">
        {/* Product Name Skeleton */}
        <div className="h-12 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>

        {/* Price Skeleton */}
        <div className="flex flex-col items-start mt-2 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}
