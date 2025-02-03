"use client";

import { useEffect, useState } from "react";

// import types
import { Product, Products } from "@/types/product";

// Services import
import {
  deleteProduct,
  getProducts,
  toggleProductAvailability,
  toggleProductStatus,
} from "@/services/products-services";

// import the LoadingSpinner component
import LoadingSpinner from "./LoadingSpinner";

// import icons
import { icons } from "../../public/icons";
import EditProductModal from "./EditProductModal";

// import custom components

export default function ProductsList() {
  // Products state
  const [products, setProducts] = useState<Products[]>([]);

  // Message state
  const [message, setMessage] = useState<string>("");

  // Edit category message state
  const [editMessage, setEditMessage] = useState<string>("");

  // Delete category message state
  const [deleteMessage, setDeleteMessage] = useState<string>("");

  // Toggle product status message state
  const [toggleProductStatusMessage, setToggleProductStatusMessage] =
    useState<string>("");

  // Loading state
  const [loading, setLoading] = useState<boolean>(true);

  // Form submission response status
  const [isSuccessfulResponse, setIsSuccessfulResponse] =
    useState<boolean>(false);

  // Edit Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProductToEdit, setSelectedProductToEdit] = useState<
    Product | undefined
  >(undefined); // Selected product to edit

  // Delete Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selected product name to delete
  const [selectedProductNameToDelete, setSelectedProductNameToDelete] =
    useState<string>("");

  // Selected product id to delete
  const [selectedProductIdToDelete, setSelectedProductIdToDelete] =
    useState<number>(0);

  // Fetch Data after the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // clear the message states
        setMessage("");
        setEditMessage("");
        setDeleteMessage("");
        setToggleProductStatusMessage("");

        const fetchProducts = await getProducts();

        setProducts(fetchProducts);
      } catch (error) {
        setMessage("Failed to load products. Please try again later.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render loading spinner or message
  if (loading) {
    return <LoadingSpinner />;
  }

  // Handle edit product
  const handleEditClick = (product: Product) => {
    setIsEditModalOpen(true); // open the edit modal after setting the selected product to edit
    setSelectedProductToEdit(product); // set the selected product to edit
  };

  // Handle delete product
  const handleDeleteClick = (productId: number, productName: string) => {
    setSelectedProductNameToDelete(productName); // set the selected product to delete to add it to the delete modal
    setSelectedProductIdToDelete(productId); // set the selected product id to delete
    setIsDeleteModalOpen(true); // open the delete modal after setting the selected product to delete
  };

  // Handle confirm delete product
  const handleConfirmDelete = async (productId: number) => {
    try {
      // If there is no product id, return
      if (!productId) return;

      // Delete product
      const response = await deleteProduct(productId);

      if (response.status === "success") {
        // Set the success background color to true
        setIsSuccessfulResponse(true);

        // Set delete message
        setDeleteMessage(response.message);

        // Reload the page to update the products list
        window.location.reload();
      } else {
        // Set the success background color to false
        setIsSuccessfulResponse(false);

        // Set delete message
        setDeleteMessage(response.message);
      }
    } catch (error) {
      setMessage("Failed to delete product. Please try again later.");
      console.error(error);
    }
  };

  // Handle toggle product status
  const handleToggleProductStatus = async (productId: number) => {
    try {
      // If there is no product id, return
      if (!productId) return;

      // Toggle product status
      const response = await toggleProductStatus(productId);

      if (response.status === "success") {
        // Set the success background color to true
        setIsSuccessfulResponse(true);

        // Set toggle product status message
        setToggleProductStatusMessage(response.message);

        // Reload the page to update the products list
        window.location.reload();
      } else {
        // Set the success background color to false
        setIsSuccessfulResponse(false);

        // Set toggle product status message
        setToggleProductStatusMessage(response.message);
      }
    } catch (error) {
      setMessage("Failed to toggle product status. Please try again later.");
      console.error(error);
    }
  };

  // Handle toggle product availability
  const handleToggleProductAvailability = async (productId: number) => {
    try {
      // If there is no product id, return
      if (!productId) return;

      // Toggle product availability
      const response = await toggleProductAvailability(productId);

      if (response.status === "success") {
        // Set the success background color to true
        setIsSuccessfulResponse(true);

        // Set toggle product status message
        setToggleProductStatusMessage(response.message);

        // Reload the page to update the products list
        window.location.reload();
      } else {
        // Set the success background color to false
        setIsSuccessfulResponse(false);

        // Set toggle product status message
        setToggleProductStatusMessage(response.message);
      }
    } catch (error) {
      setMessage(
        "Failed to toggle product availability. Please try again later."
      );
      console.error(error);
    }
  };

  // Render message if there are no products
  if (!products.length) {
    return <p>No Products in the system</p>;
  }

  return (
    // Categories Table Container
    <div className="overflow-x-auto">
      {/* Delete category message */}
      {deleteMessage && (
        <div
          className={`px-4 py-3 rounded relative mb-4 ${
            isSuccessfulResponse
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700 "
          }`}
          role="alert"
        >
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">{deleteMessage}</span>
        </div>
      )}

      {/* Categories Table */}
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
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-100 even:bg-gray-50">
              {/* Product Name */}
              <td className="px-4 py-2 border border-gray-300">
                {product.product_name}
              </td>

              {/* Product first image*/}
              <td className="px-4 py-2 border border-gray-300">
                <img
                  className="h-10 w-10 object-cover"
                  src={product.images[0] || undefined}
                  alt={product.product_name}
                />
              </td>

              {/* Product Status */}
              <td className="px-4 py-2 border border-gray-300">
                {product.is_active ? (
                  <span className="text-green-600 font-medium">Active</span>
                ) : (
                  <span className="text-red-600 font-medium">Inactive</span>
                )}
              </td>

              {/* Product Availability */}
              <td className="px-4 py-2 border border-gray-300">
                {product.in_stock ? (
                  <span className="text-green-600 font-medium">In Stock</span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </td>

              {/* Product Price */}
              <td className="px-4 py-2 border border-gray-300">
                {product.product_price} BHD
              </td>

              {/* Product Rating */}
              <td className="px-4 py-2 border border-gray-300">
                {product.product_rating} ⭐
              </td>

              {/* Product Created Date */}
              <td className="px-4 py-2 border border-gray-300">
                {new Date(product.created_at).toLocaleDateString()}
              </td>

              {/* Product Edit*/}
              <td className="px-4 py-2 border border-gray-300 flex gap-2">
                {/* Edit button */}
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleEditClick(product)}
                >
                  {" "}
                  <img
                    src={icons.edit50.src}
                    alt="Add to Basket"
                    width={35}
                    height={35}
                  />
                </button>

                {/* Delete button */}
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() =>
                    handleDeleteClick(product.id, product.product_name)
                  }
                >
                  {" "}
                  <img
                    src={icons.delete50.src}
                    alt="Add to Basket"
                    width={35}
                    height={35}
                  />
                </button>

                {/* Toggle status button */}
                <button
                  className={`${
                    product.is_active
                      ? "bg-orange-400 hover:bg-orange-400"
                      : `bg-green-500 hover:bg-green-700`
                  } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                  onClick={() => handleToggleProductStatus(product.id)}
                >
                  {product.is_active ? (
                    <img
                      src={icons.removeBasket50.src}
                      alt="Add to Basket"
                      width={35}
                      height={35}
                    />
                  ) : (
                    <img
                      src={icons.addBasket50.src}
                      alt="Add to Basket"
                      width={35}
                      height={35}
                    />
                  )}
                </button>

                {/* Toggle availability button */}
                <button
                  className={`${
                    product.in_stock
                      ? "bg-rose-400 hover:bg-rose-400"
                      : `bg-fuchsia-500 hover:bg-fuchsia-700`
                  } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                  onClick={() => handleToggleProductAvailability(product.id)}
                >
                  {product.in_stock ? (
                    <img
                      src={icons.unavailableIcon50.src}
                      alt="Add to Basket"
                      width={35}
                      height={35}
                    />
                  ) : (
                    <img
                      src={icons.availableIcon50.src}
                      alt="Add to Basket"
                      width={35}
                      height={35}
                    />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProductToEdit}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen} // open the modal
        onClose={() => setIsDeleteModalOpen(false)} // close the modal
        productName={selectedProductNameToDelete} // pass the selected product name to delete
        onConfirm={() => handleConfirmDelete(selectedProductIdToDelete)} // confirm delete product
      />
    </div>
  );
}

// Delete Modal Component
function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}) {
  // close the modal if it's not open
  if (!isOpen) return null;

  return (
    // Modal Container
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Content */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {/* Modal Name */}
        <h2 className="text-lg font-semibold">Confirm Deletion</h2>

        {/* Product Name container*/}
        <p className="mt-2 text-gray-600">
          Are you sure you want to delete <strong>{productName}</strong>?
        </p>

        {/* Buttons Container */}
        <div className="mt-4 flex justify-end gap-2">
          {/* Cancel Button */}
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
            onClick={onClose}
          >
            Cancel
          </button>

          {/* Delete Button */}
          <button
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
