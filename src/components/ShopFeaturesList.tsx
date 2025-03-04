"use client";

import React, { use, useEffect, useState } from "react";

// import services
import { getShopFeaturesAdmin } from "@/services/shop-feature-services";

// import types
import { Feature } from "@/types/features";

// import custom components

export default function ShopFeaturesList() {
  const [features, setFeatures] = useState<Feature[]>();
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch all features from the database
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await getShopFeaturesAdmin();

        if (response.status) {
          setFeatures(response.features);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <table className="min-w-full table-auto border-collapse border border-gray-300 shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-gray-300">Feature Name</th>
            <th className="px-4 py-2 border border-gray-300">
              Feature Description
            </th>
            <th className="px-4 py-2 border border-gray-300">
              Feature Theme Color
            </th>
            <th className="px-4 py-2 border border-gray-300">Feature Icon</th>
            <th className="px-4 py-2 border border-gray-300">Feature Status</th>
            <th className="px-4 py-2 border border-gray-300">Actions</th>
          </tr>
        </thead>

        <tbody>
          {features?.map((feature) => (
            <tr key={feature.id} className="hover:bg-gray-100 even:bg-gray-50">
              <td className="px-4 py-2 border border-gray-300 text-center">
                {feature.name}
              </td>

              <td className="px-4 py-2 border border-gray-300 text-center">
                {feature.description}
              </td>

              <td className="px-4 py-2 border border-gray-300">
                <div
                  className="w-full h-10 rounded-lg"
                  style={{ backgroundColor: feature.color }}
                />
              </td>

              <td className="px-4 py-2 border border-gray-300 flex justify-center items-center border-none">
                <img
                  className="object-cover rounded w-14 h-14"
                  src={feature.icon}
                  alt={feature.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/100x100?text=No+Image";
                  }}
                />
              </td>

              <td className="px-4 py-2 border border-gray-300 text-center">
                {/* bg color */}
                <span
                  className={`inline-block px-3 py-1 rounded-full font-semibold ${
                    feature.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {/* text */}
                  {feature.is_active ? "Active" : "Inactive"}
                </span>
              </td>

              <td className="px-4 py-2 border border-gray-300">
                <a
                  href={`/admin/features/edit-feature/${feature.id}`}
                  className="text-blue-500"
                >
                  Edit
                </a>
                <a
                  href={`/admin/features/edit-feature/${feature.id}`}
                  className="text-red-500"
                >
                  Delete
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
