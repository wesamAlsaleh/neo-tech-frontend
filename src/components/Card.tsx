"use client";

import React from "react";

interface CardProps {
  CardTitle?: string;
  CardDescription?: string;
  CardContent?: React.ReactNode;
  CardFooter?: string | React.ReactNode;
  CardHeight?: string | number; // Height of the card (e.g., "h-64", "h-auto")
  CardMaxContentHeight?: string | number; // Max height for content area (e.g., "max-h-64")
  loading?: boolean; // Loading state for the card
}

export default function Card({
  // CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardHeight = "h-auto",
  CardMaxContentHeight = "max-h-64", // Default max height for content area
  loading = false, // Loading state for the card
}: CardProps) {
  // Loading state for the card
  if (loading) {
    return (
      // Loading Card Layout
      <div
        className={`rounded-xl border bg-white shadow-sm ${CardHeight} flex flex-col`}
      >
        {/* Title & Description Loading Container */}
        <div className="px-6 pt-4 pb-2 flex-none space-y-2">
          {/* Title Loading Skeleton */}
          <div className="h-7 w-1/2 bg-gray-200 rounded animate-pulse" />

          {/* Description Loading Skeleton */}
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Content Loading Container  */}
        <div
          className={`px-6 py-4 flex-grow ${CardMaxContentHeight} space-y-3`}
        >
          {/* Content skeleton */}
          <div className="h-full w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    // Card Layout with fixed height if specified
    <div
      className={`rounded-xl border bg-white text-gray-800 shadow-sm ${CardHeight} flex flex-col`}
    >
      {/* Title & Description Container - Fixed height */}
      {(CardTitle || CardDescription) && (
        <div className="px-6 pt-4 pb-2 flex-none truncate">
          {/* Title */}
          {CardTitle && (
            <h2 className="text-2xl font-semibold leading-tight tracking-tight">
              {CardTitle}
            </h2>
          )}

          {/* Description */}
          {CardDescription && (
            <p className="mt-0.5 text-sm text-gray-500">{CardDescription}</p>
          )}
        </div>
      )}

      {/* Content Container - Scrollable with fixed height */}
      {CardContent && (
        <div
          className={`px-6 py-4 flex-grow overflow-y-auto ${CardMaxContentHeight}`}
        >
          {CardContent}
        </div>
      )}

      {/* Footer + separator Container - Fixed at bottom */}
      {CardFooter && (
        <div className="px-6 py-4 border-t border-gray-100 text-sm text-gray-500 flex-none">
          <div className="w-full">{CardFooter}</div>
        </div>
      )}
    </div>
  );
}
