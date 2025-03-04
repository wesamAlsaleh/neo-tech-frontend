"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

// import services
import { createShopFeature } from "@/services/shop-feature-services";

// UI interface for the form status
interface FormStatus {
  success: boolean;
  message: string;
}

export default function AddFeatureForm() {
  // State to store the form data
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [color, setColor] = useState("#000000");
  const [icon, setIcon] = useState<File | null>(null);

  // State to store the response status to display to the user after form submission
  const [status, setStatus] = useState<FormStatus>({
    success: false,
    message: "",
  });

  // State to store the form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Router instance
  const router = useRouter();

  // Function to handle the form submission
  const handleSubmit = async (e: React.FormEvent, resetForm = false) => {
    // Prevent the default form submission
    e.preventDefault();

    // Set the form submission status to true to disable the submit button
    setIsSubmitting(true);

    // Prepare form data
    const formData = new FormData();

    // Append the form data
    formData.append("name", name);
    formData.append("description", description);
    formData.append("color", color);
    formData.append("icon", icon!);

    try {
      // Submit the form data using the service
      const result = await createShopFeature(formData);

      // Update UI with the response
      setStatus({
        success: result.status,
        message: result.message,
      });

      // Reload the page after the category is created successfully
      if (result.status) {
        // Reset the form fields if the resetForm parameter is true
        if (resetForm) {
          resetFormFields();
        } else {
          router.push("/admin/customize/features"); // Redirect to the parent page
        }
      }
    } finally {
      // Set the form submission status to false to enable the submit button
      setIsSubmitting(false);
    }
  };

  // Function to reset the form fields
  const resetFormFields = () => {
    // Reset the form status after 2 seconds
    setTimeout(() => {
      setStatus({
        success: false,
        message: "",
      });
    }, 2000);

    // Reset the form state
    setName("");
    setDescription("");
    setColor("");
    setIcon(null);

    // Reset the file input field
    const fileInput = document.getElementById("icon") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <>
      {/* display message */}
      {status.message && (
        <div
          className={`px-4 py-3 rounded relative mb-4 ${
            status.success
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700 "
          }`}
          role="alert"
        >
          {status.success ? (
            <strong className="font-bold">Success! </strong>
          ) : (
            <strong className="font-bold">Error! </strong>
          )}
          <span className="block sm:inline">{status.message}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
        {/* Name field container */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Feature Name<span className="text-red-600">*</span>
          </label>

          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          />
        </div>

        {/* Description field container */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Feature description<span className="text-red-600">*</span>
          </label>

          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          />
        </div>

        {/* Color field container */}
        <div className="space-y-2">
          <label
            htmlFor="color"
            className="block text-sm font-medium text-gray-700"
          >
            Select The Feature Color Theme
            <span className="text-red-600">*</span>
          </label>

          <input
            type="color"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm "
          />
        </div>

        {/* Image field container */}
        <div className="space-y-2">
          <label
            htmlFor="category_image"
            className="block text-sm font-medium text-gray-700"
          >
            Feature Icon<span className="text-red-600">*</span>
          </label>

          <input
            type="file"
            id="icon"
            accept="image/*"
            onChange={(e) => setIcon(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {/* Action buttons container */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding..." : "Add Feature"}
          </button>

          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Another Feature
          </button>
        </div>
      </form>
    </>
  );
}
