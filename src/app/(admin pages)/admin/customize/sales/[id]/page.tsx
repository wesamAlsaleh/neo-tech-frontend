"use client";

import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";

// Import types
import { FlashSale } from "@/types/sale";
import { Product } from "@/types/product";

// import helper functions
import {
  convertPriceToBHD,
  convertSalePercentage,
  formatDateTime,
} from "@/lib/helpers";

// import server functions
import { getSaleProducts } from "@/services/products-services";
import { getFlashSale, updateFlashSale } from "@/services/sale-services";

// import custom components
import LoadingSpinner from "@/components/LoadingSpinner";
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";

export default function EditFlashSalePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Router instance
  const router = useRouter();

  const [flashSale, setFlashSale] = useState<FlashSale>(); // Flash sale details state
  const [loading, setLoading] = useState(true); // Loading state
  const [submitting, setSubmitting] = useState(false); // Submitting state

  // Form data state for flash sale fields
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  // Product states
  const [saleProducts, setSaleProducts] = useState<Product[]>([]); // All products available for selection
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]); // Selected products IDs as strings

  // Server responses for the form submission
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

  // Server response for fetching products that are on sale
  const [serverResponseForProducts, setServerResponseForProducts] = useState({
    status: false,
    message: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);

  // set the params to be used in the useEffect
  const resolvedParams = use(params);

  // Fetch the flash sale by id on component mount
  useEffect(() => {
    const fetchSaleDetails = async () => {
      try {
        setLoading(true); // Set loading to true

        // Get the sale id from the resolved params
        const id = resolvedParams.id;

        // If the id is not available, redirect to 404 page
        if (!id) {
          router.push("/404");
          return;
        }

        // Fetch the flash sale details
        const serverResponse = await getFlashSale(id);

        // If the response status is false, redirect to 404 page
        if (!serverResponse.status) {
          router.push("/404");
          return;
        }

        // Update the UI with the fetched sale details
        setServerResponse({
          status: serverResponse.status,
          message: serverResponse.message!,
        });

        // Set the flash sale details in state to be used in the form
        setFlashSale(serverResponse.flashSale);

        // Initialize form data with fetched sale details
        setFormData({
          name: serverResponse.flashSale.name,
          description: serverResponse.flashSale.description,
          start_date: serverResponse.flashSale.start_date,
          end_date: serverResponse.flashSale.end_date,
        });

        // Initialize selected products as an array of product IDs
        const selectedProductIds =
          serverResponse.flashSale.products?.map((product: Product) =>
            String(product.id)
          ) || []; // Fallback to an empty array if products is undefined

        // Set the selected products in state as an array of product IDs
        setSelectedProducts(selectedProductIds);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleDetails();
  }, [resolvedParams, router]);

  // Fetch all products for selection
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // Set loading to true

        // Fetch the products that are on sale for the current page
        const response = await getSaleProducts(currentPage);

        // Update the UI with the fetched products
        setServerResponseForProducts({
          status: response.status,
          message: response.message,
        });

        // If the response status is true
        if (response.status) {
          // Set the products in state
          setSaleProducts(response.products);

          // Set the navigation states
          setCurrentPage(response.currentPage);
          setTotalPages(response.totalPages);
          setTotalProducts(response.totalProducts);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  // Handle form input changes, this will update the form data state "formData"
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // Extract the name and value from the input element
    const { name, value } = e.target;

    // Update the form data state
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handles the selection of a product by adding or removing it from the selected products list.
   *
   * @param {string} productId - The ID of the product being selected or deselected.
   * @param {boolean} checked - A boolean indicating whether the product is selected (true) or deselected (false).
   */
  const handleProductSelection = (productId: string, checked: boolean) => {
    // If checked is true, add the product to selected products as new product (as string)
    if (checked) {
      // Add product to selected products
      setSelectedProducts((prev) => [...prev, productId]);
    } else {
      // If not checked, remove the product from selected products array (if the checkbox is unchecked)
      setSelectedProducts((prev) => prev.filter((id) => id !== productId));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    try {
      // Prepare form data
      const formDataToSubmit = new FormData();

      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("description", formData.description);
      formDataToSubmit.append("start_date", formData.start_date);
      formDataToSubmit.append("end_date", formData.end_date);

      // Add selected products with their IDs to the form data
      selectedProducts?.forEach((productId) => {
        formDataToSubmit.append("products[]", productId);
      });

      // Call API to update flash sale
      const response = await updateFlashSale(
        formDataToSubmit,
        String(resolvedParams.id)
      );

      // Update the server response state
      setServerResponse({
        status: response.status,
        message: response.message,
      });

      // If the response status is true redirect to the flash sales list
      if (response.status) {
        // Redirect to the flash sales list after successful update
        setTimeout(() => {
          router.push("/admin/customize/sales");
        }, 3000);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // If loading display loading spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageTitle
        title={`Edit Flash Sale: ${flashSale?.name}`}
        subtitle="Modify the flash sale details and product discounts"
        actionButton={
          <ActionButton text="Back" href="/admin/customize/sales" />
        }
      />

      {/* Server Response Message in case of form error */}
      {serverResponse.message && !serverResponse.status && (
        <div
          className={`p-4 mb-4 rounded-md ${
            serverResponse.status
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {serverResponse.status ? (
            <span className="font-bold">Success! </span>
          ) : (
            <span className="font-bold">Error! </span>
          )}
          <span className="block sm:inline">{serverResponse.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Flash Sale Details */}
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-lg font-semibold mb-4">Flash Sale Details</h2>

          {/* Flash Sale Details Input container */}
          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Flash Sale Name
              </label>

              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter the flash sale name e.g. Black Friday"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 `}
                required
              />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                placeholder="Enter the flash sale description e.g. The biggest sale of the year"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 `}
              />
            </div>

            {/* Date fields container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <label
                  htmlFor="start_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>

                <input
                  type="datetime-local"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 `}
                  required
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label
                  htmlFor="end_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>

                <input
                  type="datetime-local"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 `}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Products Section container */}
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-lg font-semibold mb-4">
            Products ({totalProducts})
          </h2>

          {/* Display message for product fetch errors */}
          {loading ? (
            <LoadingSpinner />
          ) : !serverResponseForProducts.status ? (
            <p className="px-4 py-3 rounded relative bg-red-100 border border-red-400 text-red-700 w-full">
              {serverResponseForProducts.message}
            </p>
          ) : saleProducts.length === 0 ? (
            <p className="px-4 py-3 rounded relative bg-red-100 border border-red-400 text-red-700 w-full">
              No products available.
            </p>
          ) : (
            // Render the products grid
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
              {saleProducts.map((product) => {
                // Check if the product (on sale) is selected by checking if the product ID is in the selected products array
                const isSelected = selectedProducts?.includes(
                  String(product.id)
                );

                return (
                  // Product card container
                  <div
                    key={product.id}
                    className={`${
                      isSelected ? "bg-blue-50" : "bg-white"
                    } shadow-md rounded-md p-4`}
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
                        checked={isSelected}
                        onChange={(e) =>
                          handleProductSelection(
                            String(product.id),
                            e.target.checked
                          )
                        }
                      />
                    </div>

                    {/* Product details container */}
                    <div className="space-y-3 mt-2">
                      {/* Original Price */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Original Price
                        </span>
                        <span className="text-sm">
                          {convertPriceToBHD(product.product_price)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Control */}
          {totalPages > 1 && (
            <div className="flex items-center mt-6 gap-x-4">
              {/* Previous Button */}
              <button
                type="button"
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
                type="button"
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

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push("/admin/customize/sales")}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </>
  );
}
