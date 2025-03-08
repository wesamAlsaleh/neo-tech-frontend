"use client";

import React, { useState, useEffect } from "react";

// import the Product type
import { Product } from "@/types/product";

// Importing services
import {
  putProductOnSale,
  removeProductFromSale,
} from "@/services/products-services";

// Sale Modal Component Props
interface SaleModalProps {
  isOpen: boolean; // modal open state
  onClose: () => void; // set isOpen to false then close the modal
  product: Product; // product to add or remove from sale
}

// Form Status Interface
interface FormStatus {
  status: boolean;
  message: string;
}

export default function SaleModal({
  isOpen,
  onClose,
  product,
}: SaleModalProps) {
  // close the modal if it's not open
  if (!isOpen) return null;

  // Sale Form States
  const [discount, setDiscount] = useState<number>(0);
  const [saleStart, setSaleStart] = useState("");
  const [saleEnd, setSaleEnd] = useState("");

  // State to store the response status to display to the user after form submission
  const [status, setStatus] = useState<FormStatus>({
    status: false,
    message: "",
  });

  // State to store the form submission status to disable the submit button while submitting
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle the form submission when the user clicks the update button
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission

    setIsSubmitting(true); // Set the form submission status to true

    // Prepare form data
    const formData = new FormData();

    // Append the form data
    formData.append("discount", String(discount));
    formData.append("sale_start", saleStart);
    formData.append("sale_end", saleEnd);

    try {
      // Submit the form data using the service
      const result = await putProductOnSale(String(product.id), formData);

      // Update UI with the response
      setStatus({
        status: result.status,
        message: result.message,
      });

      // Reload the page after 10 second if the action was successful to reflect the changes
      if (result.status) {
        setTimeout(() => window.location.reload(), 10000);
      }
    } finally {
      setIsSubmitting(false); // Set the form submission status to false
    }
  };

  // Handle Remove from Sale action
  const handleRemoveFromSale = async () => {
    setIsSubmitting(true); // Set the form submission status to true

    try {
      // Submit the form data using the service
      const result = await removeProductFromSale(String(product.id));

      // Update UI with the response
      setStatus({
        status: result.status,
        message: result.message,
      });

      // Reload the page after 10 second if the action was successful to reflect the changes
      if (result.status) {
        setTimeout(() => window.location.reload(), 10000);
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
          <h2 className="text-xl font-bold">
            {product.onSale ? "Remove" : "Add"} {product.product_name}{" "}
            {product.onSale ? "from Sale" : "on Sale"}
          </h2>
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

        {/* Remove from sale content container */}
        {product.onSale ? (
          <div className="space-y-4">
            <p className="mt-2 text-red-600 bg-red-100 p-2 rounded text-sm font-semibold text-center">
              This action is permanent and cannot be undone!
            </p>

            <div className="space-y-1">
              <p className="text-gray-600 text-base">
                Are you sure you want to remove{" "}
                <strong className="">{product.product_name}</strong> from sale?
              </p>

              <p className="text-gray-600 text-sm">
                Note: {product.product_name} will be available at its original
                price on {product.sale_end}
              </p>
            </div>

            {/* button containers */}
            <div className="col-span-5 flex justify-start gap-2 mt-4">
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
                hidden={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleRemoveFromSale}
              >
                {isSubmitting
                  ? "Updating..."
                  : `Set ${product.onSale ? "Off" : "On"} Sale`}
              </button>
            </div>
          </div>
        ) : null}

        {/* Add sale Container */}
        {!product.onSale && (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            {/* Discount Rate field container */}
            <div className="space-y-2">
              <label
                htmlFor="discount"
                className="block text-sm font-medium text-gray-700"
              >
                Discount Rate (%)<span className="text-red-500">*</span>
              </label>

              <input
                type="number"
                id="discount"
                min="0"
                max="100"
                value={discount}
                onChange={(event) => setDiscount(Number(event.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
            </div>

            {/* Sale Start Date field container */}
            <div className="space-y-2">
              <label
                htmlFor="saleStart"
                className="block text-sm font-medium text-gray-700"
              >
                Sale Start Date<span className="text-red-500">*</span>
              </label>

              <input
                type="date"
                id="saleStart"
                value={saleStart}
                onChange={(event) => setSaleStart(event.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
            </div>

            {/* Sale End Date field container */}
            <div className="space-y-2">
              <label
                htmlFor="saleEnd"
                className="block text-sm font-medium text-gray-700"
              >
                Sale End Date<span className="text-red-500">*</span>
              </label>

              <input
                type="date"
                id="saleEnd"
                value={saleEnd}
                onChange={(event) => setSaleEnd(event.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              />
            </div>

            {/* button containers */}
            <div className="col-span-5 flex justify-start gap-2 mt-4">
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
                {isSubmitting
                  ? "Updating..."
                  : `Set ${product.onSale ? "Off" : "On"} Sale`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
