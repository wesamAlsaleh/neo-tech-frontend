"use client";

import React, { useState, useEffect } from "react";

// Importing types
import { Feature } from "@/types/features";

// Importing services
import { updateShopFeature } from "@/services/shop-feature-services";

interface EditModalProps {
  isOpen: boolean; // modal open state
  onClose: () => void; // set isOpen to false then close the modal
  badge?: Feature; // Item to edit
}

interface FormStatus {
  status: boolean;
  message: string;
}

export default function EditTrustBadgeModal({
  isOpen, // modal open state
  onClose, // set isOpen to false then close the modal
  badge, // badge to edit
}: EditModalProps) {
  // Item data states
  const [badgeName, setBadgeName] = useState(badge?.name || "");
  const [badgeDescription, setBadgeDescription] = useState(
    badge?.description || ""
  );
  const [badgeColor, setBadgeColor] = useState(badge?.color || "#000000"); // Default color
  const [badgeIcon, setBadgeIcon] = useState<File | null>(null);

  // State to store the response status to display to the user after form submission
  const [status, setStatus] = useState<FormStatus>({
    status: false,
    message: "",
  });

  // State to store the form submission status to disable the submit button while submitting
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch the item data when the modal is opened
  useEffect(() => {
    // Set the item data to the form fields when the modal is opened
    setBadgeName(badge?.name || "");
    setBadgeDescription(badge?.description || "");
    setBadgeColor(badge?.color || "#000000");
    setBadgeIcon(null); // The initial icon is available as a string, so set it to null because the input field requires a File object
  }, [badge]); // Re-run the effect when the data changes

  // Close the modal if it's not open
  if (!isOpen) return null;

  // Handle the form submission when the user clicks the update button
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission

    setIsSubmitting(true); // Set the form submission status to true

    // Prepare form data
    const formData = new FormData();

    // Append the form data
    formData.append("name", badgeName);
    formData.append("description", badgeDescription);
    formData.append("color", badgeColor);
    if (badgeIcon) formData.append("icon", badgeIcon);

    try {
      // Submit the form data using the service
      const result = await updateShopFeature(formData, String(badge?.id));

      // Update UI with the response
      setStatus({
        status: result.status,
        message: result.message,
      });

      // Reload the page after second if the category is updated successfully
      if (result.status) {
        setTimeout(() => window.location.reload(), 1000);
      }
    } finally {
      setIsSubmitting(false); // Set the form submission status to false
    }
  };
  return (
    // Modal container
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* ... container */}
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        {/* Header container */}
        <div className="flex justify-between items-center mb-4">
          {/* Modal title */}
          <h2 className="text-xl font-bold">Edit {badge?.name}</h2>
        </div>

        {/* Display the status message */}
        {status.message && (
          <div
            className={`px-4 py-3 rounded relative mb-4 ${
              status.status
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700 "
            }`}
            role="alert"
          >
            {status.status ? (
              <strong className="font-bold">Success! </strong>
            ) : (
              <strong className="font-bold">Error! </strong>
            )}
            <span className="block sm:inline">{status.message}</span>
          </div>
        )}

        {/* Edit form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field container */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Badge Name
            </label>

            <input
              type="text"
              id="name"
              value={badgeName}
              onChange={(event) => setBadgeName(event.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            />
          </div>

          {/* Description field container */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Badge Description
            </label>

            <textarea
              id="description"
              value={badgeDescription}
              onChange={(event) => setBadgeDescription(event.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          {/* Color field container */}
          <div className="space-y-2">
            <label
              htmlFor="color"
              className="block text-sm font-medium text-gray-700"
            >
              Select The Badge Color Theme
            </label>

            <input
              type="color"
              id="color"
              value={badgeColor}
              onChange={(e) => setBadgeColor(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm "
            />
          </div>

          {/* Image field container */}
          <div className="space-y-2">
            <label
              htmlFor="icon"
              className="block text-sm font-medium text-gray-700"
            >
              Badge Icon
            </label>

            <input
              type="file"
              id="icon"
              accept="image/*"
              onChange={(e) => setBadgeIcon(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            />
          </div>

          {/* button containers */}
          <div className="flex justify-end gap-2">
            {/* Cancel button */}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>

            {/* submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update Badge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
