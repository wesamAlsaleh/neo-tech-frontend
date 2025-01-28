"use client";

import React, { useEffect, useState } from "react";

// import handle form submission function
import {} from "@/services/products-services";

// import categories service
import { getAllCategories } from "@/services/categories-services";

// import the category type
import { Category } from "@/types/category";

// import custom components

export default function AddProductForm() {
  // State to store the product name
  const [productName, setProductName] = useState<string>("");

  // State to store the product description
  const [productDescription, setProductDescription] = useState<string>("");

  // State to store the product price
  const [productPrice, setProductPrice] = useState<number>(0);

  // State to store the product rating
  const [productRating, setProductRating] = useState<number>(0);

  // State to store the product images
  const [productImages, setProductImages] = useState<File | null>(null);

  // State to store the product category
  const [productCategory, setProductCategory] = useState<number>(0);

  // State to store the product status 'active' or 'inactive'
  const [productStatus, setProductStatus] = useState<string>("");

  // State to store the product availability 'in stock' or 'out of stock'
  const [productAvailability, setProductAvailability] = useState<string>("");

  // State to store the categories list
  const [categories, setCategories] = useState<Category[]>([]);

  // State to store the response status to display to the user after form submission
  const [status, setStatus] = useState({});

  // Loading state
  const [loading, setLoading] = useState<boolean>(false);

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

  // Function to handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent the default form submission
    e.preventDefault();

    // Prepare form data
    const formData = new FormData();

    // formData.append("category_name", categoryName); // Add the category name

    // Submit the form data using the service
    // const result = await handleCreateCategorySubmit(null, formData);

    // Update UI with the response
    // setStatus(result);

    // Reload the page after second if the category is created successfully
    // if (result.success) {
    //   setTimeout(() => window.location.reload(), 1000);
    // }
  };

  // If the data is still loading, display a loading message
  if (loading) {
    return <p>Loading Dynamic Data...</p>;
  }

  return (
    // form container
    <div className="max-w-2xl mx-auto mt-8 bg-white shadow-lg rounded-lg p-6">
      {/* Form title */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Add a New Product
      </h2>

      {/* Form */}
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
              required
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
              onChange={(event) => setProductPrice(Number(event.target.value))}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              required
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
            Product Description (Optional)
          </label>

          <textarea
            id="product_description"
            value={productDescription}
            onChange={(event) => setProductDescription(event.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
            rows={3}
          />
        </div>

        {/* TODO: Image Upload field container */}
        <div>
          <label
            htmlFor="product_images"
            className="block text-sm font-medium text-gray-700"
          >
            Products Image (Max 4 images)
          </label>

          <input
            type="file"
            id="product_images"
            accept="image/*"
            onChange={
              (event) => setProductImages(event.target.files?.[0] || null) // TODO: handle multiple images
            }
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
            required
          />
        </div>
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
                // Get the selected category id
                const selectedCategoryId = Number(event.target.value);

                // Set the selected category id for the product
                setProductCategory(selectedCategoryId);
              }}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              required
            >
              {/* Start up option */}
              <option value="" disabled>
                Select a category
              </option>
              {/* list the categories in the select */}
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              ))}
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
              onChange={(event) => setProductStatus(event.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              required
            >
              <option value="" disabled>
                Select a status
              </option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
              onChange={(event) => setProductAvailability(event.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              required
            >
              <option value="" disabled>
                Select availability
              </option>
              <option value="in stock">In Stock</option>
              <option value="out of stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Star Rating field container */}
        <div>
          <label
            htmlFor="product_rating"
            className="block text-sm font-medium text-gray-700"
          >
            Product Rating (0-5) stars
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
            required
          >
            <option value="0">Default Rating (0)</option>
            <option value="1">⭐</option>
            <option value="2">⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="5">⭐⭐⭐⭐⭐</option>
          </select>
        </div>

        {/* submit button container */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition shadow-md"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}
