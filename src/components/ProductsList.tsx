"use client";

import { useEffect, useState } from "react";

// import types
import { Products } from "@/types/product";

// Services import
import { getProducts } from "@/services/products-services";

// import the LoadingSpinner component
import LoadingSpinner from "./LoadingSpinner";

// import custom components

export default function ProductsList() {
  // Products state
  const [products, setProducts] = useState<Products[]>([]);

  // Message state
  const [message, setMessage] = useState<string>("");

  // Delete category message state
  const [deleteMessage, setDeleteMessage] = useState<string>("");

  // Loading state
  const [loading, setLoading] = useState<boolean>(true);

  // Edit Modal states
  //   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  //   const [selectedCategory, setSelectedCategory] = useState<
  //     Category | undefined
  //   >(undefined); // Selected category to edit

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

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

  // Render message if there are no products
  if (!products.length) {
    return <p>No Products in the system</p>;
  }

  return (
    // Categories Table Container
    <div className="overflow-x-auto">
      {/* Delete category success message */}
      {/* {deleteMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">{deleteMessage}</span>
        </div>
      )} */}

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
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => {}}
                >
                  Edit Product
                </button>

                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => {}}
                >
                  Delete Product
                </button>

                <button
                  className={`${
                    product.is_active
                      ? `bg-green-500 hover:bg-green-700`
                      : "bg-orange-400 hover:bg-orange-400"
                  } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                  onClick={() => {}}
                >
                  {product.is_active
                    ? "Deactivate Product"
                    : "Activate Product"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TODO: Edit Modal */}
    </div>
  );
}
