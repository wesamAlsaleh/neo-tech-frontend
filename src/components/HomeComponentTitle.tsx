import React from "react";

// interface
interface HomeComponentTitleProps {
  title: string;
  subtitle: string;
  navigationButtons?: false;
}

export default function HomeComponentTitle({
  title,
  subtitle,
  navigationButtons,
}: HomeComponentTitleProps) {
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
      <div className="mb-4">
        <h1 className="font-bold text-3xl">{title}</h1>
      </div>
    </>
  );
}
