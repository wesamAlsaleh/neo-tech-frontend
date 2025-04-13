"use client";

import React from "react";

interface CardProps {
  CardHeader?: string;
  CardTitle?: string;
  CardDescription?: string;
  CardContent?: React.ReactNode;
  CardFooter?: string | React.ReactNode;
}

export default function Card({
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
}: CardProps) {
  return (
    // Card Layout
    <div className="rounded-xl border bg-white text-gray-800 shadow-sm">
      {/* Header Container */}
      {CardHeader && (
        <div className="px-6 pt-6 text-sm text-gray-400">{CardHeader}</div>
      )}

      {/* Title & Description Container */}
      {(CardTitle || CardDescription) && (
        <div className="px-6 pt-4 pb-2">
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

      {/* Content Container */}
      {CardContent && <div className="px-6 py-4">{CardContent}</div>}

      {/* Footer + separator Container */}
      {CardFooter && (
        <div className="px-6 pb-6 pt-2 border-t border-gray-100 text-sm text-gray-500">
          {CardFooter}
        </div>
      )}
    </div>
  );
}
