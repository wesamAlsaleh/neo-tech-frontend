"use client";

import React, { Suspense, useEffect, useState } from "react";

// import types
import { Product } from "@/types/product";
import { Category } from "@/types/category";

// import backend services
import { getAllCategories } from "@/services/categories-services";
import { updateProduct } from "@/services/products-services";
import ProductImageUpload from "./ProductImageUpload";

interface ProductEditModalProps {
  isOpen: boolean; // modal open state
  onClose: () => void; // set isOpen to false then close the modal
  product?: Product; // item to edit if any
}

interface FormStatus {
  success: boolean;
  message: string;
  error: string;
}

export default function EditProductModal({
  isOpen, // modal open state
  onClose, // set isOpen to false then close the modal
  product, // the product to edit
}: ProductEditModalProps) {
  // state to store the product data
  const [productId, setProductId] = useState<number>(product?.id || 0); // product id to update
  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productPrice, setProductPrice] = useState<number>(0);
  const [productImages, setProductImages] = useState<FileList | null>(null);
  const [productRating, setProductRating] = useState<number>(0);
  const [productStatus, setProductStatus] = useState<string | number>(""); // 1 for active, 0 for inactive
  const [productCategory, setProductCategory] = useState<string | number>(""); // number for category id or string for category name
  const [productStock, setProductStock] = useState<number>(0);
  const [productBarcode, setProductBarcode] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);

  // set the product data when the product prop changes
  useEffect(() => {
    setProductId(product?.id || 0);
    setProductName(product?.product_name || "");
    setProductDescription(product?.product_description || "");
    setProductPrice(Number(product?.product_price) || 0);
    setProductImages(product?.images ? new DataTransfer().files : null);
    setProductStatus(Number(product?.is_active) || 0);
    setProductStock(Number(product?.product_stock) || 0);
    setProductRating(Number(product?.product_rating) || 0);
    setProductCategory(product?.category_id || 0);
    setProductBarcode(String(product?.product_barcode) || "");
  }, [product]);

  const [serverResponse, setServerResponse] = useState<FormStatus>({
    success: false,
    message: "",
    error: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // form submission status

  // Fetch the categories list from the API
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        // Fetch the categories
        const result = await getAllCategories();

        // Extract the categories from the response
        const { categories } = result;

        // Set the categories state
        setCategories(categories);
      } catch (error: any) {
        // Update the UI with the error message
        setServerResponse({
          success: error.response?.data?.status,
          message: error.response?.data?.message,
          error: error.response?.data?.error,
        });
      }
    };

    fetchCategoriesData();
  }, []);

  // Function to handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent the default form submission
    e.preventDefault();

    // Prepare form data
    const formData = new FormData();

    // Set the form submission status to true
    setIsSubmitting(true);

    // Append text fields
    formData.append("product_name", productName);
    formData.append("product_description", productDescription);
    formData.append("product_price", String(productPrice));
    formData.append("product_rating", String(productRating));
    formData.append("is_active", String(productStatus));
    formData.append("category_id", String(productCategory));
    formData.append("product_stock", String(productStock));
    formData.append("product_barcode", productBarcode);

    // Append image files [productImages from the onChange event]
    if (productImages) {
      // Convert FileList to Array for easier handling
      const imagesArray = Array.from(productImages);

      // Append each file with the same field name 'product_images[]'
      imagesArray.forEach((image) => {
        formData.append("product_images[]", image);
      });
    }

    try {
      // Display the form data in the console
      // formData.forEach((value, key) => {
      //   console.log(`${key}:`, value);
      // });

      // Submit the form data using the service
      const result = await updateProduct(formData, productId);

      // Update UI with the response
      setServerResponse({
        success: result.status, // should be true if the product is updated successfully
        message: result.message,
        error: "",
      });

      // Reload the page after second if the product is updated successfully
      if (result.status) {
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error: any) {
      // Update UI with the error message
      setServerResponse({
        success: false,
        message: error.response?.data?.message,
        error: error.response?.data?.errors,
      });
    } finally {
      // Set the form submission status to false
      setIsSubmitting(false);
    }
  };

  // Return null if the modal is not open
  if (!isOpen) return null;

  return (
    // ... container
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* ... container */}
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        {/* Header container */}
        <div className="flex justify-between items-center mb-4">
          {/* Modal title */}
          <h2 className="text-xl font-bold">Edit {product?.product_name}</h2>
        </div>

        {/* Display the status message */}
        {serverResponse.message && (
          <div
            className={`px-4 py-3 rounded relative mb-4 ${
              serverResponse.success
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700 "
            }`}
            role="alert"
          >
            {serverResponse.success ? (
              <strong className="font-bold">Success! </strong>
            ) : (
              <strong className="font-bold">Error! </strong>
            )}
            <span className="block sm:inline">{serverResponse.message}</span>
          </div>
        )}

        {/* Edit form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Price Fields container*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name field container */}
            <div>
              <label
                htmlFor="product_name"
                className="block text-sm font-medium text-gray-700"
              >
                Product Name<span className="text-red-600">*</span>
              </label>

              <input
                type="text"
                id="product_name"
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50 p-2"
              />
            </div>

            {/* Price field container */}
            <div>
              <label
                htmlFor="product_price"
                className="block text-sm font-medium text-gray-700"
              >
                Product Price (BHD)
              </label>

              <input
                type="number"
                id="product_price"
                value={productPrice}
                onChange={(event) =>
                  setProductPrice(Number(event.target.value))
                }
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50 p-2"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Description field container */}
          <div>
            <label
              htmlFor="product_description"
              className="block text-sm font-medium text-gray-700"
            >
              Product Description
            </label>

            <textarea
              id="product_description"
              value={productDescription}
              onChange={(event) => setProductDescription(event.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
              rows={3}
            />
          </div>

          {/* Product images container */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {product?.images?.map((image, index) => (
              // Display the product images
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>

          {/* Image Upload field container */}
          <ProductImageUpload
            onChange={(files: FileList) => setProductImages(files)} // set the product images state when the user uploads images
            required={false}
          />

          {/* Product details container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category field container */}
            <Suspense fallback={<p>Loading categories...</p>}>
              <div>
                {/* Label for category selection */}
                <label
                  htmlFor="product_category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category<span className="text-red-600">*</span>
                </label>

                {/* Dropdown to select a product category */}
                <select
                  id="product_category"
                  value={productCategory}
                  onChange={(event) =>
                    setProductCategory(Number(event.target.value))
                  }
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                          focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50 p-2"
                >
                  {/* Default disabled option prompting selection */}
                  <option value="" disabled>
                    Select a category
                  </option>

                  {/* Dynamically listing available categories */}
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>
            </Suspense>

            {/* Status field container */}
            <div>
              {/* Label for product status selection */}
              <label
                htmlFor="product_status"
                className="block text-sm font-medium text-gray-700"
              >
                Product Status<span className="text-red-600">*</span>
              </label>

              {/* Dropdown to set product status (Active/Inactive) */}
              <select
                id="product_status"
                value={productStatus}
                onChange={(event) =>
                  setProductStatus(Number(event.target.value))
                }
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                        focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50 p-2"
              >
                {/* Default disabled option prompting selection */}
                <option value="" disabled>
                  Select a status
                </option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            {/* Product Stock field container */}
            <div>
              {/* Label for product stock input */}
              <label
                htmlFor="product_stock"
                className="block text-sm font-medium text-gray-700"
              >
                Product Stock
              </label>

              {/* Input field for entering product stock quantity */}
              <input
                type="number"
                id="product_stock"
                min="0" // Ensures no negative stock values
                value={productStock}
                onChange={(event) =>
                  setProductStock(Number(event.target.value) || 0)
                }
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                        focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50 p-2"
              />
            </div>

            {/* Product Barcode field container */}
            <div>
              {/* Label for barcode input field */}
              <label
                htmlFor="product_barcode"
                className="block text-sm font-medium text-gray-700"
              >
                Product Barcode (13 digits)
                <span className="text-red-600">*</span>
              </label>

              {/* Input field for barcode entry */}
              <input
                type="text"
                pattern="[0-9]*" // Restricts input to numeric values only
                maxLength={13} // Limits input length to 13 digits
                id="product_barcode"
                value={String(productBarcode)}
                onChange={(event) => setProductBarcode(event.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                        focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50 p-2"
              />
            </div>
          </div>

          {/* Star Rating field container */}
          {/* <div>
                 <label
                   htmlFor="product_rating"
                   className="block text-sm font-medium text-gray-700"
                 >
                   Product Rating (0-5) stars
                 </label>
       
                 <select
                   id="product_rating"
                   value={productRating}
                   onChange={(event) => setProductRating(Number(event.target.value))} // set the product rating state when the user selects a rating
                   className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50 p-2"
                   required
                 >
                   <option value="0">Default Rating (0)</option>
                   <option value="1">⭐</option>
                   <option value="2">⭐⭐</option>
                   <option value="3">⭐⭐⭐</option>
                   <option value="4">⭐⭐⭐⭐</option>
                   <option value="5">⭐⭐⭐⭐⭐</option>
                 </select>
               </div> */}

          {/* button containers */}
          <div className="flex justify-end gap-2">
            {/* Cancel button */}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Cancel
            </button>

            {/* submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : `Update Product`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
