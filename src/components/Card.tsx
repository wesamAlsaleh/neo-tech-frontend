"use client";

import React, { useState } from "react";

interface CardProps {
  title?: string;
  primaryContent?: string;
  secondaryContent?: string;
  footerContent?: string;
  buttonAction?: React.ReactNode;
  cancel?: React.ReactNode;
}

export default function Card({
  title = "Card Title",
  primaryContent = "This is a card component. It can be used to display information in a structured way. It can also be expanded to show more content. This is a card component. It can be used to display information in a structured way. It can also be expanded to show more content.",
  secondaryContent = "Additional content goes here. This is a card component. It can be used to display information in a structured way. It can also be expanded to show more content.",
  footerContent = "Updated April 12",
  buttonAction = null,
  cancel,
}: CardProps) {
  // State to manage the expanded state of the card
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="w-full max-w-md mx-auto rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden transition-all duration-200">
      {/* Card Header */}
      <div className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
        {/* Card Title */}
        <h3 className="text-lg font-medium">{title}</h3>

        {/* Expand buttons */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-100 h-9 w-9"
          aria-expanded={expanded}
        >
          {expanded ? (
            // icon for collapse
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          ) : (
            // icon for expand
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          )}
          <span className="sr-only">Toggle</span>
        </button>
      </div>

      {/* Card Content Container */}
      <div
        className={`px-6 py-4 transition-all duration-200 ${
          expanded ? "max-h-96" : "max-h-24"
        } overflow-hidden`}
      >
        {/* Rendered Content */}
        <p className="text-sm text-gray-500 leading-relaxed">
          {primaryContent}
        </p>

        {/* Conditionally render secondary content if expanded */}
        <div className="mt-4">
          <p className="text-sm text-gray-500 leading-relaxed">
            {secondaryContent}
          </p>
        </div>
      </div>

      {/* Card Footer Container */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
        {/* Footer Content */}
        <p className="text-xs text-gray-500">{footerContent}</p>

        {/* Action and Cancel Buttons Container */}
        <div className="flex space-x-2">
          {/* Action Button */}
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-800 h-8 px-3 py-2"
            onClick={() => buttonAction}
          >
            Action
          </button>

          {/* Cancel Button */}
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-100 h-8 px-3 py-2">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
