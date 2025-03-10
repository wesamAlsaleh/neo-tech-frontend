"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// import types
import { Product } from "@/types/product";

// import helper functions
import { convertPriceToBHD } from "@/lib/helpers";

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
import SaleModal from "./SaleModal";
import TableStatusColumn from "./TableStatusColumn";

export default function ProductsList() {
  // Router instance
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>(); // Products state
  const [loading, setLoading] = useState(true); // Loading state

  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  }); // Server response state

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  // Selected product state for actions
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Fetch Data function
  const fetchProductsData = async () => {
    try {
      // Fetch products
      const response = await getProducts(currentPage);

      // Update the UI with the fetched data
      setServerResponse({
        status: response.status,
        message: response.message!,
      });

      if (response.status) {
        setProducts(response.products);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data
  useEffect(() => {
    fetchProductsData();
  }, [currentPage]); // Fetch data when the page changes (pagination) or on initial load

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
      // If no product is selected, return
      if (!selectedProduct) return;

      // Delete the product
      const response = await deleteProduct(String(selectedProduct.id));

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
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      // Update the UI with the error message
      setServerResponse({
        status: false,
        message: "Failed to delete product. Please try again later.",
      });
    }
  };

  // Handle toggle product status
  const handleToggleProductStatus = async (productId: string) => {
    try {
      // If no product id is provided, return
      if (!productId) return;

      // Toggle product status
      const response = await toggleProductStatus(productId);

      // Update the UI with the response
      setServerResponse({
        status: response.status,
        message: response.message,
      });

      // Refresh products list by fetching data again
      if (response.status) {
        // Refetch products data
        fetchProductsData();
      }
    } catch (error) {
      // Update the UI with the error message
      setServerResponse({
        status: false,
        message: "Failed to toggle product status. Please try again later.",
      });
    }
  };

  // Handle sale product event
  const handleSaleProduct = async (product: Product) => {
    setSelectedProduct(product);
    setIsSaleModalOpen(true);
  };

  // If loading, show loading spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="overflow-x-auto">
      {/* action message */}
      {serverResponse.message && (
        <div
          className={`px-4 py-3 rounded relative mb-4 ${
            serverResponse.status
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700 "
          }`}
          role="alert"
        >
          {serverResponse.status ? (
            <strong className="font-bold">Success! </strong>
          ) : (
            <strong className="font-bold">Error! </strong>
          )}
          <span className="block sm:inline">{serverResponse.message}</span>
        </div>
      )}

      {/* Products Table */}
      <table className="min-w-full table-auto border-collapse border border-gray-300 shadow-md">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="px-4 py-2 border border-gray-300">Product Name</th>
            <th className="px-4 py-2 border border-gray-300">Product Image</th>
            <th className="px-4 py-2 border border-gray-300">Is Active</th>
            <th className="px-4 py-2 border border-gray-300">In Stock</th>
            <th className="px-4 py-2 border border-gray-300">On Sale</th>
            <th className="px-4 py-2 border border-gray-300">Product Price</th>
            <th className="px-4 py-2 border border-gray-300">Product Rating</th>
            <th className="px-4 py-2 border border-gray-300">Created At</th>
            <th className="px-4 py-2 border border-gray-300">Updated At</th>
            <th className="px-4 py-2 border border-gray-300">Actions</th>
          </tr>
        </thead>

        <tbody>
          {(products || []).length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-6 text-center">
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

                {/* Product Active Status */}
                <td className="px-4 py-2 border border-gray-300">
                  <TableStatusColumn
                    condition={product.is_active}
                    onYes="Active"
                    onNo="Inactive"
                  />
                </td>

                {/* Product stock Status */}
                <td className="px-4 py-2 border border-gray-300">
                  {product.product_stock > 0 ? (
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-md font-bold">
                      {product.product_stock} in stock
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md font-bold">
                      Out of stock
                    </span>
                  )}
                </td>

                {/* Product On Sale Status */}
                <td className="px-4 py-2 border border-gray-300">
                  <TableStatusColumn
                    condition={product.onSale}
                    onYes="Yes"
                    onNo="No"
                  />
                </td>

                {/* Product Original Price */}
                <td className="px-4 py-2 border border-gray-300">
                  {product.onSale ? (
                    <>
                      <span className="line-through text-gray-500 mr-2">
                        {convertPriceToBHD(product.product_price)}
                      </span>
                      <span>
                        {convertPriceToBHD(
                          product.product_price_after_discount
                        )}
                      </span>
                    </>
                  ) : (
                    <span>{convertPriceToBHD(product.product_price)}</span>
                  )}
                </td>

                {/* Product Rating */}
                <td className="px-4 py-2 border border-gray-300">
                  {product.product_rating} ⭐
                </td>

                {/* Product Created Date */}
                <td className="px-4 py-2 border border-gray-300">
                  {new Date(product.created_at).toLocaleDateString()}
                </td>

                {/* Product updated Date */}
                <td className="px-4 py-2 border border-gray-300">
                  {new Date(product.updated_at).toLocaleDateString()}
                </td>

                {/* Action buttons */}
                <td className="px-4 py-2 border border-gray-300">
                  <div className="flex items-center justify-center space-x-2">
                    {/* Edit button */}
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition"
                      onClick={() => handleEditClick(product)}
                      title={`Edit ${product.product_name}`}
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
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition"
                      onClick={() => handleDeleteClick(product)}
                      title={`Delete ${product.product_name}`}
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
                          ? "bg-rose-400 hover:bg-rose-500"
                          : "bg-green-500 hover:bg-green-600"
                      } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition`}
                      onClick={() =>
                        handleToggleProductStatus(String(product.id))
                      }
                      title={
                        product.is_active
                          ? `Deactivate ${product.product_name}`
                          : `Activate product ${product.product_name}`
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

                    {/* View product button */}
                    <button
                      className={` bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition`}
                      title={`View ${product.product_name}`}
                      onClick={() => router.push(`/products/${product.slug}`)}
                    >
                      <img
                        src={icons.viewIcon96.src}
                        alt={`View ${product.product_name}`}
                        width={24}
                        height={24}
                      />
                    </button>

                    {/* Sale button */}
                    <button
                      className={`${
                        product.onSale
                          ? "bg-amber-400 hover:bg-amber-500"
                          : "bg-lime-400 hover:bg-lime-600"
                      } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition`}
                      title={
                        product.onSale
                          ? `Remove ${product.product_name} From Sale`
                          : `Put ${product.product_name} On Sale`
                      }
                      onClick={() => handleSaleProduct(product)}
                    >
                      <img
                        src={
                          product.onSale
                            ? icons.salePriceTag48.src
                            : icons.salePriceTag48.src
                        }
                        alt={
                          product.onSale ? "Remove from Sale" : "Put On Sale"
                        }
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

      {/* Pagination Control */}
      {totalPages > 1 && (
        <div className="flex items-center mt-4 gap-x-4">
          {/* Previous Button */}
          <button
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

      {/* Edit Modal */}
      <EditProductModal
        product={selectedProduct}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          // Refresh data after edit modal closes
          fetchProductsData();
        }}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen} // open the modal
        onClose={() => setIsDeleteModalOpen(false)} // close the modal
        onConfirm={() => handleConfirmDelete()} // confirm delete
        name={selectedProduct?.product_name || ""} // pass the selected product name to delete
      />

      {/* Sale Modal */}
      <SaleModal
        isOpen={isSaleModalOpen} // open the modal
        onClose={() => setIsSaleModalOpen(false)} // close the modal
        product={selectedProduct!} // pass the selected product to the modal
      />
    </div>
  );
}
