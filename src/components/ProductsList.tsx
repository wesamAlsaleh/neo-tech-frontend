"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// import types
import { Product } from "@/types/product";

// import helper functions
import { convertPriceToBHD, formatDateTime } from "@/lib/helpers";

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
import Table from "./Table";
import Image from "next/image";

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

  // State to store the pagination details
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10); // Set default items per page to 10

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
        fetchData();

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
        fetchData();
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

  // Fetch data from server
  const fetchData = async () => {
    // Call the server API to get the orders data
    const response = await getProducts(currentPage, perPage);

    // Set the server response
    setServerResponse({
      status: response.status,
      message: response.message, // message will be empty if fetching is successful
    });

    if (response.status) {
      setProducts(response.products);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
      setPerPage(response.perPage);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalProducts);
    }
  };

  // Fetch data from server
  useEffect(() => {
    const initFetch = async () => {
      // Set loading to true while fetching data
      setLoading(true);

      // Fetch the user cart data from the server
      await fetchData();

      // Set loading to false after fetching data
      setLoading(false);
    };

    initFetch();
  }, [currentPage, perPage]);

  // Prepare Table Columns
  const columns: {
    key: string;
    label: string;
    align?: "left" | "center" | "right";
  }[] = [
    { key: "product_name", label: "Product Name" },
    { key: "product_image", label: "Product Image" },
    { key: "is_active", label: "Is Active" },
    { key: "product_stock", label: "Stock" },
    { key: "onSale", label: "On Sale" },
    { key: "product_price", label: "Product Price" },
    { key: "created_at", label: "Created At" },
    { key: "updated_at", label: "Updated At" },
    { key: "actions", label: "Actions" },
  ];

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
      <Table
        columns={columns}
        rows={products || []}
        noDataMessage="No products found."
        onRowClick={(row) => router.push(`/products/${row.slug}`)}
        renderCell={(row, key) => {
          // Render Product Image
          if (key === "product_image") {
            if (row.images) {
              return (
                <Image
                  className="object-cover rounded"
                  src={row.images[0]} // first image
                  alt={row.product_name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/100x100?text=No+Image";
                  }}
                  width={80}
                  height={80}
                />
              );
            } else {
              return <span className="text-xs text-black-500">No image</span>;
            }
          }

          // Render Category Status Badge
          if (key === "is_active") {
            // Get the image status
            const isActive = row.is_active ? true : false;

            const statusText = isActive ? "Active" : "Inactive";

            // Badge
            const baseClass = "px-3 py-1 rounded-md text-sm border capitalize"; // Define the base class for the role badge
            let badgeClass = "bg-gray-100 text-gray-700 border border-gray-400"; // Define the badge class based on the role

            // Define the badge class based on the status
            if (isActive) {
              badgeClass = "bg-green-100 text-green-700 border-green-400";
            } else {
              badgeClass = "bg-red-100 text-red-700 border-red-400";
            }

            return (
              <span className={`${baseClass} ${badgeClass}`}>{statusText}</span>
            );
          }

          // Render Product Stock Badge
          if (key === "product_stock") {
            // Get the product stock
            const productStock = row.product_stock;
            // Badge
            const baseClass = "px-3 py-1 rounded-md text-sm border capitalize"; // Define the base class for the role badge
            let badgeClass = "bg-gray-100 text-gray-700 border border-gray-400"; // Define the badge class based on the role

            // Define the badge class based on the role
            if (productStock > 5) {
              badgeClass = "bg-blue-100 text-blue-700 border-blue-400";
            } else if (productStock < 5) {
              badgeClass = "bg-orange-100 text-orange-700 border-orange-400";
            } else {
              badgeClass = "bg-red-100 text-red-700 border-red-400";
            }

            return (
              <span className={`${baseClass} ${badgeClass}`}>
                {productStock}
              </span>
            );
          }

          // Render the sale badge
          if (key === "onSale") {
            // Check if the product is on sale
            const onSale = row.onSale;

            // Badge
            const baseClass =
              "px-3 py-1 rounded-md text-sm border capitalize truncate"; // Define the base class for the role badge
            let badgeClass = "bg-gray-100 text-gray-700 border border-gray-400"; // Define the badge class based on the role

            // Define the badge class based on the role
            if (onSale) {
              badgeClass = "bg-amber-100 text-amber-700 border-amber-400";
            } else {
              badgeClass = "bg-gray-100 text-gray-700 border-gray-400";
            }

            return (
              <span className={`${baseClass} ${badgeClass}`}>
                {onSale ? "On Sale" : "Not On Sale"}
              </span>
            );
          }

          // Render Product Price
          if (key === "product_price") {
            // Get the product price based on whether it's on sale or not
            const productPrice = row.onSale
              ? row.product_price_after_discount
              : row.product_price;

            return <span>{convertPriceToBHD(String(productPrice))}</span>;
          }

          // Render Category Created At
          if (key === "created_at" || key === "updated_at") {
            return (
              <span className="truncate">{formatDateTime(row.created_at)}</span>
            );
          }

          // Render Actions
          if (key === "actions") {
            return (
              <div className="flex items-center justify-center space-x-2">
                {/* Edit button */}
                <button
                  className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition"
                  onClick={() => handleEditClick(row)}
                  title={`Edit ${row.product_name}`}
                >
                  <img
                    src={icons.edit50.src}
                    alt="Edit"
                    width={24}
                    height={24}
                  />
                </button>

                {/* Toggle status button */}
                <button
                  className={`${
                    row.is_active
                      ? "bg-rose-400 hover:bg-rose-500"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition`}
                  onClick={() => handleToggleProductStatus(String(row.id))}
                  title={
                    row.is_active
                      ? `Deactivate ${row.product_name}`
                      : `Activate product ${row.product_name}`
                  }
                >
                  <img
                    src={
                      row.is_active
                        ? icons.removeBasket50.src
                        : icons.addBasket50.src
                    }
                    alt={row.is_active ? "Deactivate" : "Activate"}
                    width={24}
                    height={24}
                  />
                </button>

                {/* View product button */}
                {/* <button
                  className={` bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition`}
                  title={`View ${row.product_name}`}
                  onClick={() => router.push(`/products/${row.slug}`)}
                >
                  <img
                    src={icons.viewIcon96.src}
                    alt={`View ${row.product_name}`}
                    width={24}
                    height={24}
                  />
                </button> */}

                {/* Sale button */}
                <button
                  className={`${
                    row.onSale
                      ? "bg-amber-400 hover:bg-amber-500"
                      : "bg-lime-400 hover:bg-lime-600"
                  } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition`}
                  title={
                    row.onSale
                      ? `Remove ${row.product_name} From Sale`
                      : `Put ${row.product_name} On Sale`
                  }
                  onClick={() => handleSaleProduct(row)}
                >
                  <img
                    src={
                      row.onSale
                        ? icons.salePriceTag48.src
                        : icons.salePriceTag48.src
                    }
                    alt={row.onSale ? "Remove from Sale" : "Put On Sale"}
                    width={24}
                    height={24}
                  />
                </button>

                {/* Delete button */}
                {/* <button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition"
                  onClick={() => handleDeleteClick(row)}
                  title={`Delete ${row.product_name}`}
                >
                  <img
                    src={icons.delete50.src}
                    alt="Delete"
                    width={24}
                    height={24}
                  />
                </button> */}
              </div>
            );
          }

          // Render without any special formatting
          return <span>{row[key]}</span>;
        }}
      />

      {/* Edit Modal */}
      <EditProductModal
        product={selectedProduct}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          // Refresh data after edit modal closes
          fetchData();
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
