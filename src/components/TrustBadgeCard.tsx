import React from "react";

// Import types
import { Feature } from "@/types/features";

interface TrustBadgeCardProps {
  badge: Feature;
}

export default function TrustBadgeCard({ badge }: TrustBadgeCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-4 my-8">
      {/* Badge Icon Container */}
      <div
        className="w-20 h-20 flex items-center justify-center rounded-full"
        style={{ backgroundColor: `${badge.color}60` }} // Lighter background
      >
        {/* Nested Circle Theme Design */}
        <div
          className="w-16 h-16 flex items-center justify-center rounded-full"
          style={{ backgroundColor: badge.color }}
        >
          <img src={badge.icon} alt={badge.name} className="w-8 h-8" />
        </div>
      </div>

      {/* Details Container */}
      <div>
        {/* Badge Title */}
        <h3 className="mt-4 text-lg font-bold">{badge.name}</h3>

        {/* Badge Description */}
        <p className="text-gray-500 text-sm">{badge.description}</p>
      </div>
    </div>
  );
}
