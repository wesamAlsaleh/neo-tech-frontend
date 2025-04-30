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
import DeleteModal from "./DeleteModal";
import EditTrustBadgeModal from "./EditTrustBadgeModal";
import Table from "./Table";
import Image from "next/image";
import { formatDateTime } from "@/lib/helpers";

export default function TrustBadgeList() {
  const [features, setFeatures] = useState<Feature[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Modal state
  const [deleteModal, setDeleteModalVisible] = useState<boolean>(false);
  const [editModal, setEditModalVisible] = useState<boolean>(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

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
        // Reload the page to reflect the changes
        window.location.reload();
      } else {
        setError(response.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle delete feature
  const handleDeleteFeature = async (featureId: string) => {
    try {
      // Set loading to true to display loading spinner while request is in progress
      setLoading(true);

      const response = await deleteShopFeature(featureId);

      if (response.status) {
        // Reload the page after 1 second to reflect the changes
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setError(response.message);
      }
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
    }
  };

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

  // Prepare Table Columns
  const columns: {
    key: string;
    label: string;
    align?: "left" | "center" | "right";
  }[] = [
    { key: "name", label: "Badge Name", align: "center" },
    { key: "description", label: "Badge Description", align: "center" },
    { key: "color", label: "Badge Theme Color", align: "center" },
    { key: "icon", label: "Badge Icon", align: "center" },
    { key: "is_active", label: "Badge Status", align: "center" },
    { key: "created_at", label: "Created At", align: "center" },
    { key: "actions", label: "Actions", align: "center" },
  ];
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
      <Table
        columns={columns}
        rows={features || []}
        noDataMessage="No Badges found."
        renderCell={(row, key) => {
          // Render Description
          if (key === "description") {
            return <span className="text-sm">{row.description}</span>;
          }

          // Render Badge Color
          if (key === "color") {
            return (
              <div
                className="w-full h-10 rounded-lg"
                style={{ backgroundColor: row.color }}
              />
            );
          }

          // Render Badge Icon
          if (key === "icon") {
            return (
              <Image
                className="rounded"
                src={row.icon}
                alt={row.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/100x100?text=No+Image";
                }}
                width={50}
                height={50}
              />
            );
          }

          // Render Badge Status
          if (key === "is_active") {
            // Get the image status
            const isActive = row.is_active ? true : false;

            const statusText = isActive ? "Active" : "Inactive";

            // Badge
            const baseClass = "px-3 py-1 rounded-md text-sm border capitalize"; // Define the base class for the role badge
            let badgeClass = "bg-gray-100 text-gray-700 border border-gray-400"; // Define the badge class based on the role

            // Define the badge class based on the status
            if (isActive) {
              badgeClass = "bg-green-100 text-green-700 border-green-400";
            } else {
              badgeClass = "bg-red-100 text-red-700 border-red-400";
            }

            return (
              <span className={`${baseClass} ${badgeClass}`}>{statusText}</span>
            );
          }

          // Render Created At
          if (key === "created_at") {
            return <span>{formatDateTime(String(row.created_at))}</span>;
          }

          // Render Actions
          if (key === "actions") {
            return (
              <div className="flex gap-2">
                {/* Edit button */}
                <button
                  className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition"
                  onClick={() => {
                    setSelectedFeature(row); // set selected feature to delete
                    setEditModalVisible(true); // show delete modal
                  }}
                  title={`Edit ${row.name}`}
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
                  onClick={() => {
                    setSelectedFeature(row); // set selected feature to delete
                    setDeleteModalVisible(true); // show delete modal
                  }}
                  title={`Delete product ${row.name}`}
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
                    row.is_active
                      ? "bg-orange-400 hover:bg-orange-500"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition`}
                  onClick={() => handleToggleFeatureStatus(String(row.id))}
                  title={
                    row.is_active
                      ? `Deactivate ${row.name}`
                      : `Activate product ${row.name}`
                  }
                >
                  <img
                    src={
                      row.is_active
                        ? icons.removeBasket50.src
                        : icons.addBasket50.src
                    }
                    alt={row.is_active ? "Deactivate" : "Activate"}
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            );
          }
          // Render without formatting
          return <span>{row[key]}</span>;
        }}
        isLoading={loading}
      />

      {/* Edit Modal */}
      <EditTrustBadgeModal
        isOpen={editModal}
        onClose={() => setEditModalVisible(false)}
        badge={selectedFeature!}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal}
        onClose={() => setDeleteModalVisible(false)}
        name={selectedFeature?.name || ""}
        onConfirm={() => handleDeleteFeature(String(selectedFeature?.id))}
        permanentAlert
      />
    </>
  );
}
