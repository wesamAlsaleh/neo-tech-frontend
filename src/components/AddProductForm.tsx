"use client";

import React, { Suspense, useEffect, useState } from "react";

// import handle form submission function
import { createProduct } from "@/services/products-services";

// import categories service
import { getAllCategories } from "@/services/categories-services";

// import the category type
import { Category } from "@/types/category";

// import custom components
import ProductImageUpload from "@/components/ProductImageUpload";
import { useRouter } from "next/navigation";

// Form status interface
interface FormStatus {
  success: boolean;
  message: string;
  error: string;
}

export default function AddProductForm() {
  const [productName, setProductName] = useState<string>(""); // State to store the product name
  const [productDescription, setProductDescription] = useState<string>(""); // State to store the product description
  const [productPrice, setProductPrice] = useState<number>(0); // State to store the product price
  // const [productRating, setProductRating] = useState<number>(0); // State to store the product rating
  const [productImages, setProductImages] = useState<FileList | null>(null); // State to store the product images
  const [productStatus, setProductStatus] = useState<string | number>(""); // State to store the product status 'active' or 'inactive'
  const [productCategory, setProductCategory] = useState<string | number>(""); // State to store the product category
  const [productStock, setProductStock] = useState<number>(0); // State to store the product stock
  const [productBarcode, setProductBarcode] = useState<string>(""); // State to store the product barcode
  const [categories, setCategories] = useState<Category[]>([]); // State to store the fetched categories
  const [serverResponse, setServerResponse] = useState<FormStatus>({
    success: false,
    message: "",
    error: "",
  }); // State to store the response status to display to the user after form submission
  const [isSubmitting, setIsSubmitting] = useState(false); // State to store the form submission status

  // Router instance
  const router = useRouter();

  // Function to fetch the categories list from the API
  const fetchCategoriesData = async () => {
    try {
      // Fetch the categories
      const fetchCategories = await getAllCategories();

      // Extract the categories from the response
      const { categories } = fetchCategories;

      // Set the categories state
      setCategories(categories);
    } catch (error) {
      // Log the error to the console
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch the categories list from the API
  useEffect(() => {
    fetchCategoriesData();
  }, []);

  // Function to reset the form fields after submission
  const resetFormFields = () => {
    // Reset all the form fields
    setProductName("");
    setProductDescription("");
    setProductPrice(0);
    setProductStatus(0);
    setProductCategory("");
    setProductStock(0);
    setProductBarcode("");
    setProductImages(null);
  };

  // Function to handle the form submission
  const handleSubmit = async (e: React.FormEvent, resetForm = false) => {
    // Prevent the default form submission
    e.preventDefault();

    // Set the form submission status to true to disable the submit button
    setIsSubmitting(true);

    console.log();

    // Prepare form data
    const formData = new FormData();

    // If any field is empty, display an error message and return
    if (!productName || !productCategory || !productImages || !productBarcode) {
      setServerResponse({
        success: false,
        message: `${!productName ? "Product Name, " : ""}${
          !productCategory ? "Category, " : ""
        }${!productStatus ? "Status, " : ""}${
          !productImages ? "Images, " : ""
        } ${!productBarcode ? "Barcode" : ""} cannot be empty*`,
        error: "client error",
      });

      setIsSubmitting(false); // Reset the form submission status

      return;
    }

    // If the product barcode is not 13 digits or is not a number, display an error message and return
    if (productBarcode.length !== 13 || isNaN(Number(productBarcode))) {
      setServerResponse({
        success: false,
        message: "Product barcode must be 13 digits*",
        error: "client error",
      });

      setIsSubmitting(false); // Reset the form submission status

      return;
    }

    // Append text fields
    formData.append("product_name", productName);
    formData.append("product_description", productDescription);
    formData.append("product_price", String(productPrice));
    // formData.append("product_rating", String(productRating));
    formData.append("is_active", String(productStatus));
    formData.append("category_id", String(productCategory));
    formData.append("product_stock", String(productStock));
    formData.append("product_barcode", productBarcode);

    // Append image files (in other words, put the images in array format called 'product_images[]')
    if (productImages) {
      // Convert FileList to Array for easier handling
      const productImagesArray = Array.from(productImages);

      // Append each file with the same field name 'product_images[]'
      productImagesArray.forEach((image) => {
        formData.append("product_images[]", image);
      });
    }

    try {
      // Submit the form data using the service
      const result = await createProduct(formData);

      // Update UI with the response message
      setServerResponse({
        success: result.status,
        message: result.message,
        error: "",
      });

      // If the form submission is successful, reload the page or reset the form fields if the resetForm parameter is true
      if (result.status) {
        // Reset the form fields if the resetForm parameter is true
        if (resetForm) {
          resetFormFields();
        } else {
          router.push("/admin/products"); // Redirect to the categories page
        }
      }
    } catch (error: any) {
      // Update UI with the error message
      setServerResponse({
        success: false,
        message: error.response.data.message,
        error: "server error",
      });
    } finally {
      setIsSubmitting(false); // Reset the form submission
    }
  };

  return (
    <>
      {/* Display the status message */}
      {serverResponse.message && (
        <div
          className={`p-3 rounded-lg  my-3 ${
            serverResponse.success
              ? "bg-green-100 text-green-600" // Success styles
              : "bg-red-100 text-red-600" // Error styles
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

      {/* Form container */}
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
              placeholder="Product Name"
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
              onChange={(event) => setProductPrice(Number(event.target.value))}
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
            placeholder="Product Description"
            value={productDescription}
            onChange={(event) => setProductDescription(event.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
            rows={3}
          />
        </div>

        {/* Image Upload field container */}
        <ProductImageUpload
          onChange={(files: FileList) => setProductImages(files)} // set the product images state when the user uploads images
        />

        {/* Product details container */}
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
              Product Status
            </label>

            {/* Dropdown to set product status (Active/Inactive) */}
            <select
              id="product_status"
              value={productStatus} // Default value is 0 (Inactive)
              onChange={(event) => setProductStatus(Number(event.target.value))}
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
              Product Barcode (13 digits)<span className="text-red-600">*</span>
            </label>

            {/* Input field for barcode entry */}
            <input
              type="text"
              pattern="[0-9]*" // Restricts input to numeric values only
              maxLength={13} // Limits input length to 13 digits
              placeholder="1234567890123"
              id="product_barcode"
              value={productBarcode}
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

        {/* Action buttons container */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding..." : "Add Category"}
          </button>

          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Another Category
          </button>
        </div>
      </form>
    </>
  );
}
