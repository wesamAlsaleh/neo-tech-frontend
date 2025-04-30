"use client";

import React, { useEffect, useState } from "react";

// Import server-side functions
import {
  deleteSliderImage,
  getSliderImagesAdmin,
  toggleActivity,
  toggleVisibility,
} from "@/services/slider-services";

// Import types
import { SliderImage } from "@/types/slider-image";

// Import icons
import { icons } from "../../public/icons";

// Import helper functions
import { formatDateTime } from "@/lib/helpers";

// Import custom components
import LoadingSpinner from "./LoadingSpinner";
import DeleteModal from "./DeleteModal";
import Table from "./Table";
import Image from "next/image";

export default function SliderImagesList() {
  // State to store the slider images
  const [sliderImages, setSliderImages] = useState<SliderImage[]>();

  // State to store the server response
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

  // loading state
  const [loading, setLoading] = useState(true);

  // State to store the action submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State to store the pagination details
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [firstPageUrl, setFirstPageUrl] = useState<string>("");
  const [lastPageUrl, setLastPageUrl] = useState<string>("");
  const [nextPageUrl, setNextPageUrl] = useState<string>("");
  const [prevPageUrl, setPrevPageUrl] = useState<string>("");
  const [from, setFrom] = useState<number>(0);
  const [to, setTo] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(1);

  // State to store the selected item
  const [selectedImage, setSelectedImage] = useState<SliderImage>();

  // State to store the modals visibility
  const [deleteModal, setDeleteModalVisible] = useState(false);

  // Function to fetch slider images from the server
  const fetchSliderImages = async () => {
    // Set loading to true to display loading spinner while request is in progress
    setLoading(true);

    // Fetch slider images from the server
    const response = await getSliderImagesAdmin(currentPage, 10);

    // Check if the response is successful
    if (response.status) {
      // Set the UI response state
      setServerResponse({
        status: true,
        message: "", // Clear the message
      });

      // Set the slider images state
      setSliderImages(response.sliderImages);

      // Set the pagination details if available
      if (response.pagination) {
        setCurrentPage(response.pagination.currentPage);
        setTotalPages(response.pagination.totalPages);
        setTotalItems(response.pagination.totalItems);
        setFirstPageUrl(response.pagination.firstPageUrl);
        setLastPageUrl(response.pagination.lastPageUrl);
        setNextPageUrl(response.pagination.nextPageUrl);
        setPrevPageUrl(response.pagination.prevPageUrl);
        setFrom(response.pagination.from);
        setTo(response.pagination.to);
        setPerPage(response.pagination.perPage);
      }
    }
  };

  // Fetch data from server
  useEffect(() => {
    const initFetch = async () => {
      // Set loading to true while fetching data
      setLoading(true);

      // Fetch the slider images
      await fetchSliderImages();

      // Set loading to false after fetching data
      setLoading(false);
    };

    initFetch();
  }, [currentPage]); // Fetch slider images when the component mounts or the currentPage state changes

  // Handle toggle activity feature
  const handleToggleActivity = async (imageId: string) => {
    try {
      // Set is submitting to true to disable the button while request is in progress
      setIsSubmitting(true);

      const response = await toggleActivity(imageId);

      // Display success message
      setServerResponse({
        status: response.status,
        message: response.message,
      });

      if (response.status) {
        // Reload the page after 1 second to reflect the changes
        setTimeout(() => window.location.reload(), 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle visibility feature
  const handleToggleVisibility = async (imageId: string) => {
    try {
      // Set is submitting to true to disable the button while request is in progress
      setIsSubmitting(true);

      const response = await toggleVisibility(imageId);

      // Display success message
      setServerResponse({
        status: response.status,
        message: response.message,
      });

      if (response.status) {
        // Reload the page after 1 second to reflect the changes
        setTimeout(() => window.location.reload(), 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle delete feature
  const handleDelete = async (imageId: string) => {
    try {
      // Set is submitting to true to disable the button while request is in progress
      setIsSubmitting(true);

      const response = await deleteSliderImage(imageId);

      // Display success message
      setServerResponse({
        status: response.status,
        message: response.message,
      });

      if (response.status) {
        // Reload the page after 1 second to reflect the changes
        setTimeout(() => window.location.reload(), 1000);
      }
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
    }
  };

  // Prepare the table columns
  const columns: {
    key: string;
    label: string;
    align?: "left" | "center" | "right";
  }[] = [
    { key: "name", label: "Title", align: "center" },
    { key: "url", label: "Image", align: "center" },
    { key: "is_active", label: "Status", align: "center" },
    { key: "visibility", label: "Visibility", align: "center" },
    { key: "created_at", label: "Created Date", align: "center" },
    { key: "actions", label: "Action", align: "center" },
  ];

  return (
    <>
      {/* Display message */}
      {serverResponse.message && (
        <div
          className={`px-4 py-3 rounded relative mb-4 ${
            serverResponse.status
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700 "
          }`}
          role="alert"
        >
          {serverResponse.status ? (
            <strong className="font-bold">Success! </strong>
          ) : (
            <strong className="font-bold">Error! </strong>
          )}
          <span className="block sm:inline">{serverResponse.message}</span>
        </div>
      )}

      {/* Content Table */}
      <Table
        columns={columns}
        rows={sliderImages || []}
        noDataMessage="No slider images found."
        renderCell={(row, key) => {
          // Render Image
          if (key === "url") {
            return (
              <div className="flex justify-center items-center h-40 overflow-hidden">
                {/* Image container */}
                <Image
                  className="object-contain"
                  width={200}
                  height={100}
                  src={row.url}
                  alt={row.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/100x100?text=No+Image";
                  }}
                />
              </div>
            );
          }

          // Render Status Badge
          if (key === "is_active") {
            // Get the image status
            const isActive = row.is_active ? true : false;

            const statusText = isActive ? "Active" : "Inactive";

            // Badge
            const baseClass =
              "px-3 py-1 rounded-md text-base border capitalize"; // Define the base class for the role badge
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

          // Render Visibility Badge
          if (key === "visibility") {
            // Get the image visibility status
            const visibility = row.visibility;

            // Badge
            const baseClass =
              "px-3 py-1 rounded-md text-base border capitalize"; // Define the base class for the role badge
            let badgeClass = "bg-gray-100 text-gray-700 border border-gray-400"; // Define the badge class based on the role

            // Define the badge class based on the status
            if (visibility === "members") {
              badgeClass = "bg-amber-100 text-amber-700 border-amber-400";
            } else {
              badgeClass = "bg-gray-100 text-gray-700 border-gray-400";
            }

            return (
              <span className={`${baseClass} ${badgeClass}`}>
                {visibility} Only
              </span>
            );
          }

          // Render Created Date
          if (key === "created_at") {
            return <span>{formatDateTime(row.created_at)}</span>;
          }

          // Render Actions
          if (key === "actions") {
            return (
              <div className="flex items-center justify-center gap-2">
                {/* Edit button */}

                {/* Toggle activity button */}
                <button
                  className={`${
                    row.is_active
                      ? "bg-rose-400 hover:bg-rose-500"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition`}
                  onClick={() => handleToggleActivity(String(row.id))}
                  title={
                    row.is_active
                      ? `Deactivate ${row.name}`
                      : `Activate sliderImage ${row.name}`
                  }
                  disabled={isSubmitting}
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

                {/* Toggle visibility button */}
                <button
                  className={`${
                    row.visibility === "public"
                      ? "bg-amber-400 hover:bg-amber-500"
                      : "bg-gray-400 hover:bg-gray-500"
                  } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition`}
                  onClick={() => handleToggleVisibility(String(row.id))}
                  title={
                    row.visibility === "public"
                      ? `Make ${row.name} exclusive to members`
                      : `Make ${row.name} public to all`
                  }
                  disabled={isSubmitting}
                >
                  <img
                    src={
                      row.visibility === "public"
                        ? icons.exclusive48.src
                        : icons.globe48.src
                    }
                    alt={
                      row.visibility
                        ? "Make Exclusive to Members"
                        : "Make Public to All"
                    }
                    width={24}
                    height={24}
                  />
                </button>

                {/* Delete button */}
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition"
                  onClick={() => {
                    setSelectedImage(row); // set selected image
                    setDeleteModalVisible(true); // show delete modal
                  }}
                  title={`Delete Image ${row.name}`}
                  disabled={isSubmitting}
                >
                  <img
                    src={icons.delete50.src}
                    alt="Delete"
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            );
          }

          // Return value based on the key without formatting
          return <span>{row[key]}</span>;
        }}
        isLoading={loading}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal}
        onClose={() => setDeleteModalVisible(false)}
        name={selectedImage?.name || ""}
        onConfirm={() => handleDelete(String(selectedImage?.id) || "")}
        permanentAlert
      />
    </>
  );
}
