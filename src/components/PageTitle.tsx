import React from "react";

// import custom components
import Separator from "./Separator";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  highlightText?: string;
  actionButton?: React.ReactNode;
  actionButton2?: React.ReactNode;
  actionButton3?: React.ReactNode;
  actionButton4?: React.ReactNode;
  recycleButton?: React.ReactNode;
}

export default function PageTitle({
  title,
  subtitle,
  highlightText,
  actionButton,
  actionButton2,
  actionButton3,
  actionButton4,
  recycleButton,
}: PageTitleProps) {
  return (
    <div className="mb-6">
      {/* container for title, subtitle, and action button */}
      <div className="flex items-center justify-between mb-4">
        {/* container for title and subtitle */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-gray-600">
              {subtitle}{" "}
              {highlightText && (
                <span className="bg-yellow-300 rounded-sm p-1 text-sm text-gray-800">
                  {highlightText}
                </span>
              )}
            </p>
          )}
        </div>

        {/* Buttons Container */}
        <div className="flex items-center space-x-2">
          {/* Action button Button Optional! */}
          {actionButton4 && <>{actionButton4}</>}

          {/* Action button Button Optional! */}
          {actionButton3 && <>{actionButton3}</>}

          {/* Action button Button Optional! */}
          {actionButton2 && <>{actionButton2}</>}

          {/* Action button Optional! */}
          {actionButton && <>{actionButton}</>}
        </div>
      </div>

      {/* Separator */}
      <Separator
        color="border-gray-200"
        thickness="border-t"
        width="w-full"
        margin="my-4"
      />
    </div>
  );
}
