"use client";

import React, { useEffect, useState } from "react";

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

export default function EditProductModal({
  isOpen, // modal open state
  onClose, // set isOpen to false then close the modal
  product, // the product to edit
}: ProductEditModalProps) {
  // state to store the product data
  const [productId, setProductId] = useState<number>(product?.id || 0);
  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productPrice, setProductPrice] = useState<number>(0);
  const [productImages, setProductImages] = useState<FileList | null>(null);
  const [productRating, setProductRating] = useState<number>(0);
  const [productCategory, setProductCategory] = useState<string | number>("");
  const [productStatus, setProductStatus] = useState<string | number>(""); // 1 for active, 0 for inactive
  const [productAvailability, setProductAvailability] = useState<
    string | number
  >("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // set the product data when the product prop changes
  useEffect(() => {
    setProductId(product?.id || 0);
    setProductName(product?.product_name || "");
    setProductDescription(product?.product_description || "");
    setProductPrice(Number(product?.product_price) || 0);
    setProductStatus(Number(product?.is_active) || 0);
    setProductAvailability(Number(product?.in_stock) || 0);
    setProductRating(Number(product?.product_rating) || 0);
    setProductCategory(product?.category_id || "");
  }, [product]);

  // State to store the response status to display to the user after form submission
  const [status, setStatus] = useState<string>("");

  // Loading state
  const [loading, setLoading] = useState<boolean>(false);

  //
  const [isSuccessfulResponse, setIsSuccessfulResponse] =
    useState<boolean>(false);

  // Fetch the categories list from the API
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        // Set loading state to true
        setLoading(true);

        // Fetch the categories
        const fetchCategories = await getAllCategories();

        // Extract the categories from the response
        const { categories } = fetchCategories;

        // Set the categories state
        setCategories(categories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesData();
  }, []);

  // Function to handle the image change
  const handleImageChange = (files: FileList) => {
    // Set the product images and image previews
    setProductImages(files);
  };

  // Function to handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent the default form submission
    e.preventDefault();

    // Prepare form data
    const formData = new FormData();

    // Append text fields
    formData.append("product_name", productName);
    formData.append("product_description", productDescription);
    formData.append("product_price", String(productPrice));
    formData.append("product_rating", String(productRating));
    formData.append("is_active", String(productStatus));
    formData.append("in_stock", String(productAvailability));
    formData.append("category_id", String(productCategory));

    // Append image files
    if (productImages) {
      // Convert FileList to Array for easier handling
      const filesArray = Array.from(productImages);

      // Append each file with the same field name 'product_images[]'
      filesArray.forEach((file) => {
        formData.append("product_images[]", file);
      });
    }

    try {
      // Display the form data in the console
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      // Submit the form data using the service
      const result = await updateProduct(formData, productId);

      // Reload the page after second if the category is created successfully
      if (result?.status === "success") {
        // Set the response status to true to display the success message with a green background
        setIsSuccessfulResponse(true);

        // Update UI with the response message
        setStatus(result?.message);

        // Clear form after successful submission
        setProductName("");
        setProductDescription("");
        setProductPrice(0);
        setProductImages(null);
        setProductRating(0);
        setProductCategory(0);
        setProductStatus(0);
        setProductAvailability(0);

        // Reload the page after successful submission
        window.location.reload();
      } else {
        // Set error response
        setIsSuccessfulResponse(false);

        // Update UI with the error message
        setStatus(result.message);
      }
    } catch (error) {
      // Set error response
      setIsSuccessfulResponse(false);

      // Update UI with the error message
      setStatus("Error creating product. Please try again. 😕");
    }
  };

  // Return null if the modal is not open
  if (!isOpen) return null;
  return (
    // ... container
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* ... container */}
      <div className="bg-white p-6 rounded-lg w-96">
        {/* ... container */}
        <div className="flex justify-between items-center mb-4">
          {/* Modal title */}
          <h2 className="text-xl font-bold">Edit {product?.product_name}</h2>

          {/* Close button */}
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

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
                Product Name
              </label>

              <input
                type="text"
                id="product_name"
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
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
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
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
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              rows={3}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {imagePreviews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Preview ${index}`}
                className="w-20 h-20 object-cover rounded-lg"
              />
            ))}
          </div>

          {/* Image preview container */}
          <div className="flex flex-wrap gap-2">
            {product?.images.map((image_url, index) => (
              <img
                key={index}
                src={image_url}
                alt={`Preview ${index}`}
                className="w-20 h-20 object-cover rounded-lg"
              />
            ))}
          </div>

          {/* Image Upload field container */}
          <ProductImageUpload onChange={handleImageChange} required={false} />

          {/* Category, Status, Availability */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category field container */}
            <div>
              <label
                htmlFor="product_category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>

              <select
                id="product_category"
                value={productCategory}
                onChange={(event) => {
                  // Set the selected category id for the product
                  setProductCategory(Number(event.target.value));
                }}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              >
                {/* Start up option */}
                <option value="" disabled>
                  Select a category
                </option>

                {loading ? (
                  <p>Loading categories...</p>
                ) : (
                  // list the categories in the select options
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.category_name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Status field container */}
            <div>
              <label
                htmlFor="product_status"
                className="block text-sm font-medium text-gray-700"
              >
                Product Status
              </label>

              <select
                id="product_status"
                value={productStatus}
                onChange={(event) =>
                  setProductStatus(Number(event.target.value))
                }
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              >
                <option value="" disabled>
                  Select a status
                </option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            {/* Availability field container */}
            <div>
              <label
                htmlFor="product_availability"
                className="block text-sm font-medium text-gray-700"
              >
                Product Availability
              </label>

              <select
                id="product_availability"
                value={productAvailability}
                onChange={(event) =>
                  setProductAvailability(Number(event.target.value))
                }
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              >
                <option value="" disabled>
                  Select availability
                </option>
                <option value="1">In Stock</option>
                <option value="0">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Star Rating field container */}
          <div>
            <label
              htmlFor="product_rating"
              className="block text-sm font-medium text-gray-700"
            >
              Product Rating (0-5) star
            </label>

            <select
              id="product_rating"
              value={productRating}
              onChange={(event) => {
                // Get the selected rating
                const selectedRating = Number(event.target.value);

                // Set the selected rating for the product
                setProductRating(selectedRating);
              }}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
            >
              <option value="0">Default Rating (0)</option>
              <option value="1">⭐</option>
              <option value="2">⭐⭐</option>
              <option value="3">⭐⭐⭐</option>
              <option value="4">⭐⭐⭐⭐</option>
              <option value="5">⭐⭐⭐⭐⭐</option>
            </select>
          </div>

          {/* status */}
          <div
            className={`mt-4 text-center ${
              isSuccessfulResponse ? "text-green-600" : "text-red-600"
            }`}
          >
            {status}
          </div>

          {/* submit button container */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition shadow-md disabled:bg-blue-300"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
