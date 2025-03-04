"use client";

import React, { use, useEffect, useState } from "react";

// import services
import {
  getShopFeaturesAdmin,
  toggleShopFeatureStatus,
  deleteShopFeature,
} from "@/services/shop-feature-services";

// import types
import { Feature } from "@/types/features";
import LoadingSpinner from "./LoadingSpinner";
import { icons } from "../../public/icons";

// import custom components

export default function ShopFeaturesList() {
  const [features, setFeatures] = useState<Feature[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Fetch all features from the database
  const fetchFeatures = async () => {
    try {
      const response = await getShopFeaturesAdmin(currentPage);

      if (response.status) {
        setFeatures(response.features);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle feature status
  const handleToggleFeatureStatus = async (featureId: string) => {
    try {
      // Set loading to true to display loading spinner while request is in progress
      setLoading(true);

      const response = await toggleShopFeatureStatus(featureId);

      if (response.status) {
        // Refetch the features list
        fetchFeatures();
      } else {
        setError(response.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle delete feature
  const handleDeleteFeature = async (featureId: string) => {};

  // Fetch all features
  useEffect(() => {
    fetchFeatures();
  }, [currentPage]); // fetch features when currentPage changes or on initial render only

  // Clear error message after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [error]); // clear error message when error changes

  // If loading, display loading message instead of the table
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Error Display */}
      {error && (
        <div
          className="px-4 py-3 rounded relative mb-4 bg-red-100 border border-red-400 text-red-700 "
          role="alert"
        >
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Features Table */}
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

        {features?.length === 0 && (
          <tbody>
            <tr>
              <td colSpan={6} className="text-center py-4">
                No features found.
              </td>
            </tr>
          </tbody>
        )}

        <tbody>
          {features?.map((feature) => (
            <tr key={feature.id} className="hover:bg-gray-100 even:bg-gray-50">
              {/* Name Container */}
              <td className="px-4 py-2 border border-gray-300 text-center">
                {feature.name}
              </td>

              {/* Description Container */}
              <td className="px-4 py-2 border border-gray-300 text-center">
                {feature.description}
              </td>

              {/* Color Container */}
              <td className="px-4 py-2 border border-gray-300">
                <div
                  className="w-full h-10 rounded-lg"
                  style={{ backgroundColor: feature.color }}
                />
              </td>

              {/* Icon Container */}
              <td className="px-4 py-2 border border-gray-300 flex justify-center items-center">
                <img
                  className="object-scale-down rounded w-12 h-12"
                  src={feature.icon}
                  alt={feature.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/100x100?text=No+Image";
                  }}
                />
              </td>

              {/* Status Container */}
              <td className="px-4 py-2 border border-gray-300 text-center">
                {/* bg color condition */}
                <span
                  className={`inline-block px-3 py-1 rounded-full font-semibold ${
                    feature.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {/* text color condition */}
                  {feature.is_active ? "Active" : "Inactive"}
                </span>
              </td>

              {/* Action buttons */}
              <td className="px-4 py-2 border border-gray-300">
                <div className="flex gap-2">
                  {/* Edit button */}
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition"
                    onClick={() => {}}
                    title={`Edit ${feature.name}`}
                  >
                    <img
                      src={icons.edit50.src}
                      alt="Edit"
                      width={24}
                      height={24}
                    />
                  </button>

                  {/* Delete button */}
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition"
                    onClick={() => {}}
                    title={`Delete product ${feature.name}`}
                  >
                    <img
                      src={icons.delete50.src}
                      alt="Delete"
                      width={24}
                      height={24}
                    />
                  </button>

                  {/* Toggle status button */}
                  <button
                    className={`${
                      feature.is_active
                        ? "bg-orange-400 hover:bg-orange-500"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition`}
                    onClick={() =>
                      handleToggleFeatureStatus(String(feature.id))
                    }
                    title={
                      feature.is_active
                        ? `Deactivate ${feature.name}`
                        : `Activate product ${feature.name}`
                    }
                  >
                    <img
                      src={
                        feature.is_active
                          ? icons.removeBasket50.src
                          : icons.addBasket50.src
                      }
                      alt={feature.is_active ? "Deactivate" : "Activate"}
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Control */}
      {totalPages > 1 && (
        <div className="flex items-center mt-4 gap-x-4">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            Previous
          </button>

          <span className="font-semibold">{`${currentPage} of ${totalPages}`}</span>

          {/* Next Button */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border rounded ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
