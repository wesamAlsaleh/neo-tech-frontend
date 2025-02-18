import React from "react";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export default function PageTitle({
  title,
  subtitle,
  actionButton,
}: PageTitleProps) {
  return (
    <div className="mb-6">
      {/* container for title, subtitle, and action button */}
      <div className="flex items-center justify-between mb-4">
        {/* container for title and subtitle */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-1 text-gray-600">{subtitle}</p>}
        </div>

        {/* action button */}
        {actionButton && <div>{actionButton}</div>}
      </div>

      {/* separator */}
      <hr className="border-t border-gray-200" />
    </div>
  );
}
