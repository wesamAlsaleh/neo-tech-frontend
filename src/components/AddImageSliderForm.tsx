"use client";

import { addSliderImage } from "@/services/slider-services";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// import services

// UI interface for the form status
interface FormStatus {
  status: boolean;
  message: string;
}

export default function AddImageSliderForm() {
  // Router instance
  const router = useRouter();

  // State to store the form data
  const [name, setName] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("public"); // Default visibility is public
  const [image, setImage] = useState<File | null>(null);

  // State to store the response status to display to the user after form submission
  const [serverResponse, setServerResponse] = useState<FormStatus>({
    status: false,
    message: "",
  });

  // State to store the form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    formData.append("visibility", visibility);
    formData.append("image", image!);

    try {
      // Submit the form data using the service
      const result = await addSliderImage(formData);

      // Update UI with the response
      setServerResponse({
        status: result.status,
        message: result.message,
      });

      // If the form submission is successful reset the form fields or redirect to the parent page
      if (result.status) {
        // Reset the form fields if the resetForm parameter is true
        if (resetForm) {
          resetFormFields();
        } else {
          router.push("/admin/customize/slider"); // Redirect to the parent page
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
      setServerResponse({
        status: false,
        message: "",
      });
    }, 2000);

    // Reset the form state
    setName("");
    setVisibility("");
    setImage(null);

    // Reset the file (image) input field
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };
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

      {/* Form */}
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
        {/* Name Field Container */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Slider Image Name<span className="text-red-600">*</span>
          </label>

          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
          />
        </div>

        {/* Visibility Field Container */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Visibility
          </label>

          <div className="flex items-center space-x-2">
            <input
              id="visibility"
              type="checkbox"
              checked={visibility === "members"}
              onChange={(e) =>
                setVisibility(e.target.checked ? "members" : "public")
              }
              className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="visibility" className="text-sm text-gray-700">
              Make it exclusive to members only{" "}
              <span className="text-xs text-gray-500">
                (default: For all users)
              </span>
            </label>
          </div>
        </div>

        {/* Image Field Container */}
        <div className="space-y-2">
          <label
            htmlFor="icon"
            className="block text-sm font-medium text-gray-700"
          >
            Slider Image<span className="text-red-600">*</span>
          </label>

          <input
            required
            type="file"
            id="icon"
            accept="image/*" // accept only image files
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-orange-50 file:text-orange-700
              hover:file:bg-orange-100"
          />
        </div>

        {/* Action buttons container */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding..." : "Add Image"}
          </button>

          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Another Image
          </button>
        </div>
      </form>
    </>
  );
}
