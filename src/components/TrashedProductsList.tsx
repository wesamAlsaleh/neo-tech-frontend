"use client";
import Link from "next/link";

import { Suspense, useEffect, useState } from "react";

// import types
import { Product } from "@/types/product";

// Services import
import {
  restoreProduct,
  getTrashedProducts,
} from "@/services/products-services";

// import the LoadingSpinner component
import LoadingSpinner from "./LoadingSpinner";

// import icons
import { icons } from "../../public/icons";

// import custom components
import ConfirmationModal from "@/components/ConfirmationModal";
import ServerResponse from "./ServerResponse";

export default function TrashedProductsList() {
  const [products, setProducts] = useState<Product[]>([]); // Products state

  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  }); // Server response state

  // Modal states
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);

  // Selected product state for actions
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined
  );

  // Fetch Data function
  const fetchProductsData = async (page = 1) => {
    try {
      // Fetch products
      const { status, trashedProducts } = await getTrashedProducts();

      // Update the UI with the fetched data
      setServerResponse({
        status: status,
        message: "",
      });

      if (status) {
        setProducts(trashedProducts);
      }
    } catch (error: any) {
      setServerResponse({
        status: false,
        message: error.response?.data.message || "Failed to fetch products.",
      });
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchProductsData();
  }, []);

  // Handle restore product (to open modal with product data)
  const handleRestoreClick = (product: Product) => {
    setSelectedProduct(product);
    setIsRestoreModalOpen(true);
  };

  // Handle confirm restore product (to restore the product)
  const handleConfirmRestore = async () => {
    try {
      // If no product is selected, return
      if (!selectedProduct) return;

      // Delete the product
      const response = await restoreProduct(String(selectedProduct.id));

      // Update the UI with the response
      setServerResponse({
        status: response.status,
        message: response.message,
      });

      // Refresh products list by fetching data again
      if (response.status) {
        // Refresh products list by fetching data again
        fetchProductsData();

        // Close the modal after successful delete
        setIsRestoreModalOpen(false);
      }
    } catch (error) {
      // Update the UI with the error message
      setServerResponse({
        status: false,
        message: "Failed to delete product. Please try again later.",
      });
    }
  };

  return (
    <div className="overflow-x-auto">
      {/* action message */}
      {serverResponse.message && (
        <ServerResponse
          condition={serverResponse.status}
          message={serverResponse.message}
        />
      )}

      {/* Products Table */}
      <table className="min-w-full table-auto border-collapse border border-gray-300 shadow-md">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">
              Product Name
            </th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">
              Product Image
            </th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">
              Is Active
            </th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">
              In Stock
            </th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">
              Product Price
            </th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">
              Product View Count
            </th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">
              Product Sold Count
            </th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">
              Created At
            </th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">
              Updated At
            </th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">
              Deleted At
            </th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {(products?.length || []) === 0 ? (
            <tr>
              <td colSpan={11} className="px-4 py-6 text-center text-red-600">
                No products found.
              </td>
            </tr>
          ) : (
            products?.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-100 even:bg-gray-50"
              >
                {/* Product Name */}
                <td className="px-4 py-2 border border-gray-300">
                  {product.product_name}
                </td>

                {/* Product first image*/}
                <td className="px-4 py-2 border border-gray-300">
                  {product.images && product.images.length > 0 ? (
                    <img
                      className="h-10 w-10 object-cover rounded"
                      src={product.images[0]} // first image
                      alt={product.product_name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/100x100?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 flex items-center justify-center rounded">
                      <span className="text-xs text-gray-500">No image</span>
                    </div>
                  )}
                </td>

                {/* Product Status */}
                <td className="px-4 py-2 border border-gray-300">
                  <span
                    className={`${
                      product.is_active
                        ? "text-green-600 bg-green-100 px-2 py-1 rounded-md"
                        : "text-red-600 bg-red-100 px-2 py-1 rounded-md"
                    } font-medium`}
                  >
                    {product.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Product stock */}
                <td className="px-4 py-2 border border-gray-300">
                  <span
                    className={`${
                      product.product_stock > 0
                        ? "text-green-600 bg-green-100 px-2 py-1 rounded-md"
                        : "text-red-600 bg-red-100 px-2 py-1 rounded-md"
                    } font-medium`}
                  >
                    {product.product_stock > 0
                      ? `In Stock (${product.product_stock})`
                      : "Out of Stock"}
                  </span>
                </td>

                {/* Product Price */}
                <td className="px-4 py-2 border border-gray-300">
                  {parseFloat(product.product_price).toFixed(2)} BHD
                </td>

                {/* Product View count */}
                <td className="px-4 py-2 border border-gray-300">
                  {product.product_view}
                </td>

                {/* Product Sold count */}
                <td className="px-4 py-2 border border-gray-300">
                  {product.product_sold}
                </td>

                {/* Product Created Date */}
                <td className="px-4 py-2 border border-gray-300">
                  {new Date(product.created_at).toLocaleDateString()}
                </td>

                {/* Product updated Date */}
                <td className="px-4 py-2 border border-gray-300">
                  {new Date(product.updated_at).toLocaleDateString()}
                </td>

                {/* Product Delete Date */}
                <td className="px-4 py-2 border border-gray-300">
                  {product.deleted_at
                    ? new Date(product.deleted_at).toLocaleDateString()
                    : "N/A"}
                </td>

                {/* Action buttons */}
                <td className="px-4 py-2 border border-gray-300">
                  <div className="flex gap-2">
                    {/* Restore button */}
                    <button
                      className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition"
                      onClick={() => handleRestoreClick(product)}
                      title={`Restore ${product.product_name}`}
                    >
                      <img
                        src={icons.restoreIcon48.src}
                        alt="Restore"
                        width={24}
                        height={24}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* TODO: Pagination */}

      {/* Restore Confirmation Modal */}
      <ConfirmationModal
        title={`Restore ${selectedProduct?.product_name}`}
        subTitle="Are you sure you want to restore this product?"
        isOpen={isRestoreModalOpen} // open the modal
        onClose={() => setIsRestoreModalOpen(false)} // close the modal
        onConfirm={() => handleConfirmRestore()} // confirm restore
        buttonName="Restore" // button name
      />
    </div>
  );
}
