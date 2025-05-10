import React from "react";

type PaginationControlProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function PaginationControl(props: PaginationControlProps) {
  // Destructure the props to get the current page, total pages, and the function to change the page
  const { currentPage, totalPages, onPageChange } = props;

  // No pagination needed if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    // Pagination Control
    <div className="flex items-center mt-4 gap-x-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 text-white rounded-md text-sm font-medium disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 ${"bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"} ${
          currentPage === 1 ? "cursor-not-allowed" : ""
        }`}
      >
        Previous
      </button>

      {/* Counter of current page */}
      <span className="font-semibold">{`${currentPage} of ${totalPages}`}</span>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 text-white rounded-md text-sm font-medium disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 ${"bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"} ${
          currentPage === totalPages ? "cursor-not-allowed" : ""
        }`}
      >
        Next
      </button>
    </div>
  );
}
