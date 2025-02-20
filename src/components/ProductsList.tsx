"use client";

import { Suspense, useEffect, useState } from "react";

// import types
import { Product, Products } from "@/types/product";

// Services import
import {
  deleteProduct,
  getProducts,
  toggleProductStatus,
} from "@/services/products-services";

// import the LoadingSpinner component
import LoadingSpinner from "./LoadingSpinner";

// import icons
import { icons } from "../../public/icons";

// import custom components
import EditProductModal from "./EditProductModal";
import DeleteModal from "./DeleteModal";

export default function ProductsList() {
  // Products state
  const [products, setProducts] = useState<Products[]>([]);

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  });

  // Message states
  const [actionMessage, setActionMessage] = useState<string>(""); // to show success or error message
  const [isSuccessfulResponse, setIsSuccessfulResponse] =
    useState<boolean>(false); // to show success or error message color

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selected product state for actions
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined
  );

  // Fetch Data function
  const fetchProductsData = async (page = 1) => {
    try {
      // Fetch products
      const response = await getProducts();

      if (response.status) {
        setProducts(response.products.data || []);

        setIsSuccessfulResponse(true);

        // Set pagination data
        if (response.products) {
          setPagination({
            currentPage: response.products.current_page,
            lastPage: response.products.last_page,
            perPage: response.products.per_page,
            total: response.products.total,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchProductsData();
  }, []);

  // Handle edit product (to open modal with product data)
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  // Handle delete product (to open modal with product data)
  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Handle confirm delete product
  const handleConfirmDelete = async () => {
    try {
      if (!selectedProduct) return;

      const response = await deleteProduct(String(selectedProduct.id));

      // Set action message
      setActionMessage(response.message);

      // Set response status
      setIsSuccessfulResponse(response.status === "success");

      if (response.status === "success") {
        // Refresh products list by fetching data again
        fetchProductsData(pagination.currentPage);

        // Close the modal after successful delete
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error("Delete error:", error);

      // Set action message
      setActionMessage("Failed to delete product. Please try again later.");

      // Set response status
      setIsSuccessfulResponse(false);
    }
  };

  // Handle toggle product status
  const handleToggleProductStatus = async (productId: string) => {
    try {
      if (!productId) return;

      // Toggle product status
      const response = await toggleProductStatus(productId);

      // Set action message
      setActionMessage(response.message);

      // Set response status
      setIsSuccessfulResponse(response.status === "success");

      if (response.status === "success") {
        // Refetch products data with current page and updated data
        fetchProductsData(pagination.currentPage);
      }
    } catch (error) {
      console.error("Toggle status error:", error);

      setActionMessage(
        "Failed to toggle product status. Please try again later."
      );
      setIsSuccessfulResponse(false);
    }
  };

  // Handle pagination change
  const handlePageChange = (page: number) => {
    fetchProductsData(page); // Refetch data with new page number to update the table
  };

  return (
    <div className="overflow-x-auto">
      <Suspense fallback={<LoadingSpinner />}>
        {/* action message */}
        {actionMessage && (
          <div
            className={`px-4 py-3 rounded relative mb-4 ${
              isSuccessfulResponse
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700 "
            }`}
            role="alert"
          >
            {isSuccessfulResponse ? (
              <strong className="font-bold">Success! </strong>
            ) : (
              <strong className="font-bold">Error! </strong>
            )}
            <span className="block sm:inline">{actionMessage}</span>
          </div>
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
                Product Rating
              </th>
              <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                Created At
              </th>
              <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-red-600">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
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
                        product.is_active ? "text-green-600" : "text-red-600"
                      } font-medium`}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Product Availability */}
                  <td className="px-4 py-2 border border-gray-300">
                    <span
                      className={`${
                        Number(product.product_stock) > 0
                          ? "text-green-600"
                          : "text-red-600"
                      } font-medium`}
                    >
                      {Number(product.product_stock) > 0
                        ? `In Stock (${product.product_stock})`
                        : "Out of Stock"}
                    </span>
                  </td>

                  {/* Product Price */}
                  <td className="px-4 py-2 border border-gray-300">
                    {parseFloat(product.product_price).toFixed(2)} BHD
                  </td>

                  {/* Product Rating */}
                  <td className="px-4 py-2 border border-gray-300">
                    {product.product_rating} ⭐
                  </td>

                  {/* Product Created Date */}
                  <td className="px-4 py-2 border border-gray-300">
                    {new Date(product.created_at).toLocaleDateString()}
                  </td>

                  {/* Action buttons */}
                  <td className="px-4 py-2 border border-gray-300">
                    <div className="flex gap-2">
                      {/* Edit button */}
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition"
                        onClick={() => handleEditClick(product)}
                        title="Edit product"
                      >
                        <img
                          src={icons.edit50.src}
                          alt="Edit"
                          width={24}
                          height={24}
                        />
                      </button>

                      {/* Delete button */}
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition"
                        onClick={() => handleDeleteClick(product)}
                        title="Delete product"
                      >
                        <img
                          src={icons.delete50.src}
                          alt="Delete"
                          width={24}
                          height={24}
                        />
                      </button>

                      {/* Toggle status button */}
                      <button
                        className={`${
                          product.is_active
                            ? "bg-orange-400 hover:bg-orange-500"
                            : "bg-green-500 hover:bg-green-600"
                        } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition`}
                        onClick={() =>
                          handleToggleProductStatus(String(product.id))
                        }
                        title={
                          product.is_active
                            ? "Deactivate product"
                            : "Activate product"
                        }
                      >
                        <img
                          src={
                            product.is_active
                              ? icons.removeBasket50.src
                              : icons.addBasket50.src
                          }
                          alt={product.is_active ? "Deactivate" : "Activate"}
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

        {/* Pagination */}
        {pagination.lastPage > 1 && (
          <div className="flex justify-center mt-4">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              {/* Previous Page Button */}
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                  pagination.currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                } text-sm font-medium`}
              >
                &laquo; Previous
              </button>

              {/* Page Numbers */}
              {[...Array(pagination.lastPage)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border ${
                    pagination.currentPage === i + 1
                      ? "bg-blue-50 border-blue-500 text-blue-600 z-10"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  } text-sm font-medium`}
                >
                  {i + 1}
                </button>
              ))}

              {/* Next Page Button */}
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.lastPage}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                  pagination.currentPage === pagination.lastPage
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                } text-sm font-medium`}
              >
                Next &raquo;
              </button>
            </nav>
          </div>
        )}
      </Suspense>

      {/* Edit Modal */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          // Refresh data after edit modal closes
          fetchProductsData(pagination.currentPage);
        }}
        product={selectedProduct}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen} // open the modal
        onClose={() => setIsDeleteModalOpen(false)} // close the modal
        onConfirm={() => handleConfirmDelete()} // confirm delete
        name={selectedProduct?.product_name || ""} // pass the selected product name to delete
      />
    </div>
  );
}
