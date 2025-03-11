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
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]); // Selected products IDs as strings

  // Form validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Server responses
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

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
        const id = resolvedParams.id;

        if (!id) {
          router.push("/404");
          return;
        }

        const serverResponse = await getFlashSale(id);

        if (!serverResponse.status) {
          router.push("/404");
          return;
        }

        setServerResponse({
          status: serverResponse.status,
          message: serverResponse.message!,
        });

        const sale = serverResponse.flashSale;
        setFlashSale(sale);

        // Initialize form data with fetched sale details
        setFormData({
          name: sale.name,
          description: sale.description,
          start_date: sale.start_date,
          end_date: sale.end_date,
        });

        // Initialize selected products
        const selectedProductIds = sale.products.map((product: Product) =>
          String(product.id)
        );

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
        setLoading(true);

        const response = await getSaleProducts(currentPage);

        setServerResponseForProducts({
          status: response.status,
          message: response.message,
        });

        if (response.status) {
          setAllProducts(response.products);
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

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle product selection
  const handleProductSelection = (productId: string, checked: boolean) => {
    // If checked is true, add the product to selected products
    if (checked) {
      // Add product to selected products
      setSelectedProducts((prev) => [...prev, productId]);
    } else {
      // Remove product from selected products
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

      // Add selected products with their discounts
      selectedProducts.forEach((productId) => {
        formDataToSubmit.append("products[]", productId);
      });

      // Call API to update flash sale
      const response = await updateFlashSale(
        formDataToSubmit,
        String(resolvedParams.id)
      );

      setServerResponse({
        status: response.status,
        message: response.message || "Flash sale updated successfully!",
      });

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

      {/* Server Response Message */}
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
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 ${
                  formErrors.name ? "border-red-500" : ""
                }`}
                required
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
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
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter the flash sale description e.g. The biggest sale of the year"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 ${
                  formErrors.description ? "border-red-500" : ""
                }`}
              />
              {formErrors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.description}
                </p>
              )}
            </div>

            {/* Date Range */}
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
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 ${
                    formErrors.start_date ? "border-red-500" : ""
                  }`}
                  required
                />
                {formErrors.start_date && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.start_date}
                  </p>
                )}
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
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 ${
                    formErrors.end_date ? "border-red-500" : ""
                  }`}
                  required
                />
                {formErrors.end_date && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.end_date}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-lg font-semibold mb-4">
            Products ({totalProducts})
          </h2>

          {/* Display message for product fetch errors */}
          {!serverResponseForProducts.status &&
            serverResponseForProducts.message && (
              <div
                className="px-4 py-3 rounded relative mb-4 bg-red-100 border border-red-400 text-red-700"
                role="alert"
              >
                <span className="font-bold">Error! </span>
                <span className="block sm:inline">
                  {serverResponseForProducts.message}
                </span>
              </div>
            )}

          {formErrors.products && (
            <p className="mt-1 mb-4 text-sm text-red-600">
              {formErrors.products}
            </p>
          )}

          {/* If no products show the message */}
          {allProducts.length === 0 && (
            <p className="px-4 py-3 rounded relative bg-red-100 border border-red-400 text-red-700 w-full">
              No products available.
            </p>
          )}

          {/* Products grid */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
            {allProducts.map((product) => {
              const isSelected = selectedProducts.includes(String(product.id));
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
