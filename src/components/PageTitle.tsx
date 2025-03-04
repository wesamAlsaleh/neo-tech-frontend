import React from "react";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  highlightText?: string;
  actionButton?: React.ReactNode;
  actionButton2?: React.ReactNode;
  recycleButton?: React.ReactNode;
}

export default function PageTitle({
  title,
  subtitle,
  highlightText,
  actionButton,
  actionButton2,
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

        <div className="flex items-center space-x-2">
          {/* recycle button Optional! */}
          {recycleButton && <>{recycleButton}</>}

          {/* Go Back Button Optional! */}
          {actionButton2 && <>{actionButton2}</>}

          {/* action button */}
          {actionButton && <>{actionButton}</>}
        </div>
      </div>

      {/* separator */}
      <hr className="border-t border-gray-200" />
    </div>
  );
}
