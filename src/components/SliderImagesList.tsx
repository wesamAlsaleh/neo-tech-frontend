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

  // State to store the pagination details
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
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

  // Fetch slider images from the server
  useEffect(() => {
    try {
      // Fetch slider images
      const fetchSliderImages = async () => {
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

      // Call the function to fetch slider images
      fetchSliderImages();
    } finally {
      // Set the loading state to false
      setLoading(false);
    }
  }, [currentPage]); // Fetch slider images when the component mounts or the currentPage state changes

  // Handle toggle activity feature
  const handleToggleActivity = async (imageId: string) => {
    try {
      // Set loading to true to display loading spinner while request is in progress
      setLoading(true);

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
      // Set loading to true to display loading spinner while request is in progress
      setLoading(true);

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
      // Set loading to true to display loading spinner while request is in progress
      setLoading(true);

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

  // If the slider images are still loading from the server display a loading spinner
  if (loading) {
    return <LoadingSpinner />;
  }

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
      <table className="min-w-full table-auto border-collapse border border-gray-300 shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-gray-300 w-48">Title</th>
            <th className="px-4 py-2 border border-gray-300 w-48">Image</th>
            <th className="px-4 py-2 border border-gray-300 w-32 ">Status</th>
            <th className="px-4 py-2 border border-gray-300 w-32">
              Visibility
            </th>
            <th className="px-4 py-2 border border-gray-300 w-48">
              Created Date
            </th>
            <th className="px-4 py-2 border border-gray-300 w-32">Actions</th>
          </tr>
        </thead>

        {sliderImages?.length === 0 && (
          <tbody>
            <tr>
              <td colSpan={5} className="text-center py-4">
                No slider images found.
              </td>
            </tr>
          </tbody>
        )}

        <tbody>
          {sliderImages?.map((sliderImage) => (
            <tr
              key={sliderImage.id}
              className="hover:bg-gray-100 even:bg-gray-50"
            >
              {/* Name Column */}
              <td className="px-4 py-2 border border-gray-300 text-center">
                {sliderImage.name}
              </td>

              {/* Image Column */}
              <td className="px-4 py-2 border border-gray-300 w-48">
                {/* Image container */}
                <div className="flex justify-center items-center h-32 overflow-hidden">
                  <img
                    className="object-contain w-full h-full"
                    src={sliderImage.url}
                    alt={sliderImage.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/100x100?text=No+Image";
                    }}
                  />
                </div>
              </td>

              {/* Status Column */}
              <td className="px-4 py-2 border border-gray-300 text-center">
                {/* bg color condition */}
                <span
                  className={`inline-block px-3 py-1 rounded-full font-semibold ${
                    sliderImage.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {/* text color condition */}
                  {sliderImage.is_active ? "Active" : "Inactive"}
                </span>
              </td>

              {/* Visibility Column */}
              <td className="px-4 py-2 border border-gray-300 text-center">
                {/* bg color condition */}
                <span
                  className={`inline-block px-3 py-1 rounded-full font-semibold ${
                    sliderImage.visibility === "public"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {/* text color condition */}
                  {sliderImage.visibility}
                </span>
              </td>

              {/* Date Column */}
              <td className="px-4 py-2 border border-gray-300 text-center">
                {formatDateTime(sliderImage.created_at)}
              </td>

              {/* Action Buttons Column */}
              <td className="px-4 py-2 border border-gray-300">
                <div className="flex items-center justify-center gap-2">
                  {/* Edit button */}

                  {/* Toggle activity button */}
                  <button
                    className={`${
                      sliderImage.is_active
                        ? "bg-rose-400 hover:bg-rose-500"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition`}
                    onClick={() => handleToggleActivity(String(sliderImage.id))}
                    title={
                      sliderImage.is_active
                        ? `Deactivate ${sliderImage.name}`
                        : `Activate sliderImage ${sliderImage.name}`
                    }
                  >
                    <img
                      src={
                        sliderImage.is_active
                          ? icons.removeBasket50.src
                          : icons.addBasket50.src
                      }
                      alt={sliderImage.is_active ? "Deactivate" : "Activate"}
                      width={24}
                      height={24}
                    />
                  </button>

                  {/* Toggle visibility button */}
                  <button
                    className={`${
                      sliderImage.visibility === "public"
                        ? "bg-purple-400 hover:bg-purple-500"
                        : "bg-amber-500 hover:bg-amber-600"
                    } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition`}
                    onClick={() =>
                      handleToggleVisibility(String(sliderImage.id))
                    }
                    title={
                      sliderImage.visibility === "public"
                        ? `Make ${sliderImage.name} exclusive to members`
                        : `Make ${sliderImage.name} public to all`
                    }
                  >
                    <img
                      src={
                        sliderImage.visibility === "public"
                          ? icons.exclusive48.src
                          : icons.globe48.src
                      }
                      alt={
                        sliderImage.visibility
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
                      setSelectedImage(sliderImage); // set selected image
                      setDeleteModalVisible(true); // show delete modal
                    }}
                    title={`Delete Image ${sliderImage.name}`}
                  >
                    <img
                      src={icons.delete50.src}
                      alt="Delete"
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

      {/* Pagination Control*/}
      {totalPages > 1 && (
        <div className="flex items-center mt-4 gap-x-4">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-orange-500 text-white"
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
                : "bg-orange-500 text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}

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
