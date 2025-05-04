"use client";

import React from "react";

interface FilterProps {
  url?: string;
  perPage?: number;
  setPerPage?: (perPage: number) => void;
  currentPage?: number;
  setCurrentPage?: (currentPage: number) => void;
  totalPages?: number;
  setTotalPages?: (totalPages: number) => void;
  style?: "col" | "row";
  className?: string;
}

export default function Filter(props: FilterProps) {
  // Destructure props
  const {
    url,
    perPage,
    setPerPage,
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
    style = "row",
    className,
  } = props;

  return (
    <div>
      <div>
        <label htmlFor="start-date" className="block text-sm font-medium">
          Per Page
        </label>

        <input
          id="per-page"
          type="number"
          value={currentPage ?? ""}
          onChange={(e) => {
            if (setPerPage) {
              setPerPage(Number(e.target.value));
            } else {
              alert("setPerPage function is not provided");
            }

            // TODO: If URL is provided, update the URL with the new per_page value
            if (url) {
              const urlParams = new URLSearchParams(url); // Create a new URLSearchParams object from the URL
              urlParams.set("per_page", e.target.value); // Set the per_page parameter to the new value
              window.location.href = `${
                url.split("?")[0]
              }?${urlParams.toString()}`; // Redirect to the new URL with the updated per_page value
            } else {
              alert("URL is not provided");
            }
          }}
          className="border px-2 py-1 rounded w-full"
        />
      </div>
    </div>
  );
}
