"use client";

import React from "react";
import { useRouter } from "next/navigation";

// interface
interface HomeComponentTitleProps {
  title: string;
  subtitle: string;
  viewAllButton?: boolean;
  url?: string;
  paginationControl?: React.ReactNode;
}

export default function HomeComponentTitle({
  title,
  subtitle,
  viewAllButton,
  url,
  paginationControl: paginationControls,
}: HomeComponentTitleProps) {
  // router instance
  const router = useRouter();

  return (
    <>
      {/* component sub-name container */}
      <div className="flex items-center gap-x-2 mb-2">
        {/* red box container */}
        <div>
          <div className="w-5 h-10 bg-primary rounded-md" />
        </div>

        {/* category name container */}
        <div>
          <h1 className="text-primary font-bold text-base ml-1">{subtitle}</h1>
        </div>
      </div>

      {/* component main name container + navigation buttons if available */}
      <div className="mb-4 flex items-center justify-between">
        {/* title */}
        <h1 className="font-bold text-3xl">{title}</h1>

        {/* actions */}
        {viewAllButton && url && (
          <button
            className="bg-primary text-white font-bold px-4 py-1 rounded-md"
            onClick={() => router.push(url!)}
          >
            View All
          </button>
        )}

        {/* Pagination control if provided */}
        {paginationControls}
      </div>
    </>
  );
}
