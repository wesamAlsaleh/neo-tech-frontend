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
import Link from "next/link";

export default function ProductsList() {
  const [products, setProducts] = useState<Products[]>([]); // Products state
  const [loading, setLoading] = useState(true); // Loading state

  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  }); // Server response state

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selected product state for actions
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined
  );

  // Fetch Data function
  const fetchProductsData = async () => {
    try {
      // Fetch products
      const response = await getProducts();

      // Update the UI with the fetched data
      setServerResponse({
        status: response.status,
        message: response.message!,
      });

      if (response.status) {
        setProducts(response.products.data);
      }
    } catch (error) {
      setServerResponse({
        status: false,
        message: "Failed to fetch products. Please try again later.",
      });
    } finally {
      setLoading(false);
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
              Updated At
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
                  <div className="flex gap-2">
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
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition"
                      onClick={() => handleDeleteClick(product)}
                      title={`Delete product ${product.product_name}`}
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
                    <Link href={`/products/${product.slug}`} passHref>
                      <button
                        className={`bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition`}
                        title={`View ${product.product_name}`}
                      >
                        <img
                          src={icons.viewIcon48.src}
                          alt={`View ${product.product_name}`}
                          width={24}
                          height={24}
                        />
                      </button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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
    </div>
  );
}
