"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// import services
import { getSaleProducts } from "@/services/products-services";
import { createFlashSale } from "@/services/sale-services";

// import types
import { Product } from "@/types/product";

// import helper functions
import { convertPriceToBHD, convertSalePercentage } from "@/lib/helpers";

// import custom components
import LoadingSpinner from "./LoadingSpinner";

export default function AddFlashSaleForm() {
  // Products on sale state
  const [productsOnSale, setProductsOnSale] = useState<Product[]>([]); // Products state

  // State to store the form data
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]); // Selected products IDs as strings array

  // State to store the response status to display to the user after fetching the products
  const [serverResponseForProducts, setServerResponseForProducts] = useState({
    status: false,
    message: "",
  }); // Server response state

  // State to store the response status to display to the user after form submission
  const [serverResponseForFlashSale, setServerResponseForFlashSale] = useState({
    status: false,
    message: "",
    duration: 0,
  }); // Server response state

  const [isSubmitting, setIsSubmitting] = useState(false); // State to store the form submission status
  const [loading, setLoading] = useState(true); // State to store the loading status

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);

  // Function to fetch the product from the server
  const fetchOnSaleProducts = async () => {
    try {
      // Set loading to true to display the loading spinner while fetching data (even in the pagination)
      setLoading(true);

      // Fetch products
      const response = await getSaleProducts(currentPage);

      // Update the UI with the fetched data
      setServerResponseForProducts({
        status: response.status,
        message: response.message!,
      });

      if (response.status) {
        setProductsOnSale(response.products);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
        setTotalProducts(response.totalProducts);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch products data
  useEffect(() => {
    fetchOnSaleProducts();
  }, [currentPage]); // Fetch products when the currentPage changes (pagination) or when the component mounts

  // Router instance
  const router = useRouter();

  // Function to handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent the default form submission
    e.preventDefault();

    // Set the form submission status to true to disable the submit button
    setIsSubmitting(true);

    // Prepare form data
    const formData = new FormData();

    // Append the form data
    formData.append("name", name);
    formData.append("description", description);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    selectedProducts.forEach((id) => formData.append("products[]", id));

    try {
      // Submit the form data using the service
      const result = await createFlashSale(formData);

      // Update UI with the response
      setServerResponseForFlashSale({
        status: result.status,
        message: result.message,
        duration: result.duration,
      });

      // Reload the page after the flash sale is created successfully
      if (result.status) {
        setTimeout(() => router.push("/admin/customize/sales"), 3000); // Redirect after 3 seconds
      } else {
        console.log(
          result.message +
            " " +
            serverResponseForFlashSale.message +
            " " +
            result.status +
            " " +
            "This is the error"
        );
      }
    } finally {
      setIsSubmitting(false); // Re-enable the submit button
    }
  };

  // Display loading spinner when fetching data
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* display message for fetching data*/}
      {!serverResponseForProducts.status && (
        // Display the message if the status is false (error)
        <div
          className={`px-4 py-3 rounded relative mb-4 ${
            serverResponseForProducts.status
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700"
          }`}
          role="alert"
        >
          {serverResponseForProducts.status ? (
            <span className="font-bold">Success! </span>
          ) : (
            <span className="font-bold">Error! </span>
          )}
          <span className="block sm:inline">
            {serverResponseForProducts.message}
          </span>
        </div>
      )}

      {/* display message for flash sale creation*/}
      {serverResponseForFlashSale.message && (
        <div
          className={`px-4 py-3 rounded relative mb-4 ${
            serverResponseForFlashSale.status
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700"
          }`}
          role="alert"
        >
          {serverResponseForFlashSale.status ? (
            <span className="font-bold">Success! </span>
          ) : (
            <span className="font-bold">Error! </span>
          )}
          <span className="block sm:inline">
            {serverResponseForFlashSale.message}
          </span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
        {/* Name field container */}
        <div className="space-y-2">
          <label htmlFor="" className="block text-sm font-medium text-gray-700">
            Flash Sale Name<span className="text-red-600">*</span>
          </label>

          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter the flash sale name e.g. Black Friday"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            required
          />
        </div>

        {/* Description field container */}
        <div className="space-y-2">
          <label htmlFor="" className="block text-sm font-medium text-gray-700">
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter the flash sale description e.g. The biggest sale of the year"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          />
        </div>

        {/* Start Date field container */}
        <div className="space-y-2">
          <label htmlFor="" className="block text-sm font-medium text-gray-700">
            Start Date<span className="text-red-600">*</span>
          </label>

          <input
            type="datetime-local"
            id="start_date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            required
          />
        </div>

        {/* End Date field container */}
        <div className="space-y-2">
          <label htmlFor="" className="block text-sm font-medium text-gray-700">
            End Date<span className="text-red-600">*</span>
          </label>

          <input
            type="datetime-local"
            id="end_date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            required
          />
        </div>

        {/* Products field container */}
        <div className="space-y-2">
          <label htmlFor="" className="block text-sm font-medium text-gray-700">
            Products ({totalProducts})<span className="text-red-600">*</span>
          </label>

          {/* If no products show the message from the server */}
          {productsOnSale.length === 0 && (
            <p className="px-4 py-3 rounded relative bg-red-100 border border-red-400 text-red-700 w-full">
              {serverResponseForProducts.message}
            </p>
          )}

          {/* Products grid */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
            {productsOnSale.map((product) => (
              // Product card container
              <div
                key={product.id}
                className="bg-white shadow-md rounded-md p-4"
              >
                {/* Product Name & checkbox container */}
                <div className="flex justify-between items-center">
                  {/* Product Name */}
                  <h3 className="text-lg font-semibold">
                    {product.product_name}
                  </h3>

                  {/* CheckBox */}
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    checked={selectedProducts.includes(String(product.id))} // Check if product is already selected
                    onChange={(e) => {
                      // If the checkbox is checked, add the product to the selected products array
                      if (e.target.checked) {
                        setSelectedProducts((prev) => [
                          ...prev,
                          String(product.id),
                        ]); // Add product
                      } else {
                        // If the checkbox is unchecked, remove the product from the selected products array
                        setSelectedProducts(
                          (prev) =>
                            prev.filter((id) => id !== String(product.id)) // Remove product
                        );
                      }
                    }}
                  />
                </div>

                {/* Product details container */}
                <div className="space-y-1 mt-0.5">
                  {/* Discount details container */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sale Details</span>
                    <span className="text-sm text-gray-600">
                      {convertSalePercentage(product.discount)}
                    </span>
                  </div>

                  {/* Price after discount container  */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Product Price</span>
                    <span className="text-sm text-gray-600">
                      {convertPriceToBHD(product.product_price_after_discount)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Control Container*/}
          <div className="flex justify-start items-center">
            {totalPages > 1 && (
              <div className="flex items-center mt-4 gap-x-4">
                {/* Previous Button */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
          </div>
        </div>

        {/* Action buttons container */}
        <div className="flex gap-2">
          {productsOnSale.length > 0 && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Adding..." : "Add Flash Sale"}
            </button>
          )}
        </div>
      </form>
    </>
  );
}
