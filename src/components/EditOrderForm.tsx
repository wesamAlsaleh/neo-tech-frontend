"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

// import types
import { OrderDetails } from "@/types/order";
import { Product } from "@/types/product";

// import backend services
import { getOrderById, updateOrderDetails } from "@/services/order-services";
import { searchProduct } from "@/services/products-services";

// import the cities
import { cities } from "@/types/cities";

// import helpers
import { convertPriceToBHD, formatDateTime } from "@/lib/helpers";

// import custom hooks
import { useDebounce } from "@/lib/hooks";

// import icons
import { icons } from "../../public/icons";

// import custom components
import Card from "./Card";
import LoadingSpinner from "./LoadingSpinner";
import Button from "./Button";

interface propsType {
  orderId: string;
}

export default function EditOrderForm(props: propsType) {
  // Destructure the props
  const { orderId } = props;

  // State to store products
  const [products, setProducts] = useState<Product[]>([]);
  const [productsCount, setProductsCount] = useState<number>(0);

  // State to store order details
  const [order, setOrder] = useState<OrderDetails>();

  // State to store order items to manipulate the order items
  const [orderItems, setOrderItems] = useState<OrderDetails["order_items"]>();

  // State to store loading status
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);

  // State to store submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State to store the server response
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

  // States to append the form fields
  const [orderStatus, setOrderStatus] = useState<string | null>();
  const [orderPaymentMethod, setOrderPaymentMethod] = useState<string | null>();
  const [address, setAddress] = useState({
    homeNumber: "",
    streetNumber: "",
    blockNumber: "",
    city: "",
  });

  // State to manage order items being edited
  const [editedOrderItems, setEditedOrderItems] = useState<
    { product_id: number; quantity: number; originalQuantity?: number }[]
  >([]);

  // State to track selected product from search
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantityToAdd, setQuantityToAdd] = useState<number>(1);

  // State to store search term
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Function to fetch order details and products available
  const fetchData = async (orderId: string) => {
    // Fetch order details from the server
    const orderResponse = await getOrderById(orderId);

    // Update UI state once with all changes
    setServerResponse({
      status: orderResponse.status,
      message: orderResponse.message,
    });

    if (orderResponse.status) {
      setOrder(orderResponse.order);
      setOrderItems(orderResponse.order.order_items);
      setOrderStatus(orderResponse.order.status);
      setOrderPaymentMethod(orderResponse.order.payment_method);
    }
  };

  // Fetch data from server
  useEffect(() => {
    const initFetch = async () => {
      // Set loading to true while fetching data
      setLoading(true);

      // Fetch the user cart data from the server
      await fetchData(orderId);

      // Set loading to false after fetching data
      setLoading(false);
    };

    initFetch();
  }, []);

  // Set debounced search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!debouncedSearchTerm) return;

      // Set loading to true while fetching data
      setProductsLoading(true);

      // Call the API to get the products based on the search term
      const response = await searchProduct(debouncedSearchTerm);

      // Set loading to false after fetching data
      setProductsLoading(false);

      // Update the UI state with the response
      setServerResponse({
        status: response.status,
        message: !response.status && response.message, // show error message only if the response is not successful
      });

      // If the response is successful, set the products state with the search results
      setProducts(response.searchResults);
      setProductsCount(response.totalItems);
    };

    fetchProducts();
  }, [debouncedSearchTerm]);

  // Populate the editedOrderItems when orderItems are loaded
  useEffect(() => {
    if (orderItems && orderItems.length > 0) {
      setEditedOrderItems(
        orderItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity, // quantity of the product that is being edited
          originalQuantity: item.quantity, // original quantity of the product
        }))
      );
    }
  }, [orderItems]);

  // Function to handle address changes
  const handleAddressChange = (field: string, value: string) => {
    setAddress((prev) => ({
      ...prev, // preserve previous state (in other words, spread operator to copy the previous state of the object to the new object)
      [field]: value, // update the specific field based on the field name
    }));
  };

  // Function to handle quantity change for existing order items
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    // Change the quantity of the product that is being edited based on the product id
    setEditedOrderItems((prevItems) =>
      prevItems.map(
        (item) =>
          item.product_id === productId // get the product id from the order items
            ? { ...item, quantity: newQuantity } // update the quantity of the product
            : item // preserve the previous state of the product
      )
    );
  };

  // Function to remove an item from the order
  const handleRemoveItem = (productId: number) => {
    setEditedOrderItems(
      (prevItems) => prevItems.filter((item) => item.product_id !== productId) // get every item that is not equal to the product id
    );
  };

  // Function to add a new product to the order
  const handleAddProduct = () => {
    // If no product is selected, return early
    if (!selectedProduct) return;

    // Check if product already exists in the order
    const existingItemIndex = editedOrderItems.findIndex(
      (item) => item.product_id === selectedProduct.id // get the index of the product that is selected from the search results
    );

    // If product already exists (not -1), update the quantity
    if (existingItemIndex >= 0) {
      // Initialize array of all order items that are being manipulated
      const updatedItems = [...editedOrderItems];

      // Update the quantity of the existing product using the index
      updatedItems[existingItemIndex].quantity += quantityToAdd;

      // Save the updated order items to the state to be sent to the server after the form is submitted
      setEditedOrderItems(updatedItems);
    } else {
      // Add new product to order
      setEditedOrderItems([
        ...editedOrderItems,
        {
          product_id: selectedProduct.id,
          quantity: quantityToAdd,
        },
      ]);
    }

    // Reset selection
    setSelectedProduct(null);

    // Reset quantity to add to 1 to avoid adding more than 1 product at a time
    setQuantityToAdd(1);

    // Reset search term to clear the search input field
    setSearchTerm("");
  };

  // Function to handle product selection from the search results
  const handleSelectProduct = (productId: number) => {
    // Find the selected product from the search results
    const product = products.find(
      (resultProduct) => resultProduct.id === productId
    );

    // Set the selected product state to the selected product or null if not found
    setSelectedProduct(product || null);
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    // Set the form submission status to true to disable the submit button
    setIsSubmitting(true);

    // Prepare form data
    const formData = new FormData();

    const requestData = {
      status: orderStatus || "",
      payment_method: orderPaymentMethod || "",
      home_number: address.homeNumber || "",
      street_number: address.streetNumber || "",
      block_number: address.blockNumber || "",
      city: address.city || "",
      items: editedOrderItems, // This will be sent as an array
    };

    try {
      // Submit the form data using the service
      const result = await updateOrderDetails(order?.id!, requestData);

      // Update UI with the response
      setServerResponse({
        status: result.status,
        message: result.message,
      });

      // Reload the page after successful update
      if (result.status) {
        // Refresh data
        await fetchData(orderId);
      }
    } finally {
      // Set the form submission status to false to enable the submit button
      setIsSubmitting(false);
    }
  };

  // Handle loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    // Parent div container
    <div className="flex flex-col gap-4 w-full">
      {/* display message */}
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

      {/* Order Quick Details Container */}
      <div>
        <Card
          CardTitle={`Order #${orderId} Details`}
          CardContent={
            <div className="grid grid-cols-4 gap-4">
              {/* User Name */}
              <div className="col-span-1">
                <strong>User Name:</strong> {order?.user.first_name}{" "}
                {order?.user.last_name}
              </div>

              {/* Order Total Price */}
              <div className="col-span-1">
                <strong>Total Price:</strong>{" "}
                {convertPriceToBHD(String(order?.total_price))}
              </div>

              {/* Order Date */}
              <div className="col-span-1">
                <strong>Order Date:</strong>{" "}
                {formatDateTime(String(order?.created_at))}
              </div>

              {/* Order Updated Date */}
              <div className="col-span-1">
                <strong>Updated At:</strong>{" "}
                {formatDateTime(String(order?.updated_at))}
              </div>

              {/* Order Shipping Address */}
              <div className="col-span-2">
                <strong>Shipping Address:</strong>{" "}
                <span className="capitalize">{order?.shipping_address}</span>
              </div>
            </div>
          }
        />
      </div>

      {/* Order Management Content Container */}
      <div className="flex flex-row gap-4">
        {/* Left Side Contain Order Details Form */}
        <div className="w-1/2 flex-col">
          <Card
            CardTitle={`Edit Order Details`}
            CardContent={
              <form className="space-y-4">
                {/* Status field container */}
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Order Status:
                  </label>

                  <select
                    id="payment_method"
                    value={orderStatus ?? ""}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 p-2 rounded-lg text-base font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  >
                    <option value="" disabled>
                      Select order status
                    </option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>

                {/* Payment Method field container */}
                <div>
                  <label
                    htmlFor="payment_method"
                    className="block text-base font-medium text-gray-700 mb-2"
                  >
                    Payment Method:
                  </label>

                  <select
                    id="payment_method"
                    value={orderPaymentMethod ?? ""}
                    onChange={(e) => setOrderPaymentMethod(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 p-2 rounded-lg text-base font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  >
                    <option value="" disabled>
                      Select payment method
                    </option>
                    <option value="cash">Cash</option>
                    <option value="paypal">PayPal</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                  </select>
                </div>

                {/* Home Number Field */}
                <div>
                  <label
                    htmlFor="home_number"
                    className="block text-base font-medium text-gray-700 mb-2"
                  >
                    Home Number:
                  </label>

                  <input
                    type="text"
                    placeholder="Enter new home number if needed"
                    id="home_number"
                    value={address.homeNumber}
                    onChange={(e) =>
                      handleAddressChange("homeNumber", e.target.value)
                    }
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50 p-2"
                  />
                </div>

                {/* Street Address Field */}
                <div>
                  <label
                    htmlFor="street"
                    className="block text-base font-medium text-gray-700 mb-2"
                  >
                    Street Address:
                  </label>

                  <input
                    type="text"
                    placeholder="Enter new street address if needed"
                    id="street"
                    value={address.streetNumber}
                    onChange={(e) =>
                      handleAddressChange("street", e.target.value)
                    }
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50 p-2"
                  />
                </div>

                {/* Block Number Field */}
                <div>
                  <label
                    htmlFor="block"
                    className="block text-base font-medium text-gray-700 mb-2"
                  >
                    Block Number:
                  </label>

                  <input
                    type="text"
                    placeholder="Enter new block number if needed"
                    id="block"
                    value={address.blockNumber}
                    onChange={(e) =>
                      handleAddressChange("block", e.target.value)
                    }
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50 p-2"
                  />
                </div>

                {/* City Field */}
                <div>
                  <label
                    htmlFor="city"
                    className="block text-base font-medium text-gray-700 mb-2"
                  >
                    City:
                  </label>

                  <select
                    id="city"
                    value={address.city}
                    onChange={(e) =>
                      handleAddressChange("city", e.target.value)
                    }
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 p-2 rounded-lg text-base font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            }
          />
        </div>

        {/* Right Side Contain Order Items with products */}
        <div className="w-1/2 flex-col">
          <Card
            CardTitle={`Edit Order Items`}
            CardContent={
              <div className="flex flex-col gap-4">
                {/* Search Bar Container */}
                <div className="relative">
                  {/* Search Bar Text Field Container */}
                  <div>
                    {/* Input Field */}
                    <input
                      type="text"
                      id="search"
                      name="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search for products..."
                      className="pl-9 pr-4 py-2 w-full rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />

                    {/* TODO: Search Icon in SVG */}
                    <span className="absolute left-3 top-2.5 text-gray-400">
                      {/* Search icon would go here */}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </span>
                  </div>

                  {/* Search Results Container */}
                  <div className="mt-4">
                    {/* Handle loading */}
                    {productsLoading && (
                      <div className="w-full bg-gray-50 border border-gray-200 rounded-lg animate-pulse">
                        <div className="h-[42px] bg-gray-200 rounded-lg" />
                      </div>
                    )}

                    {/* Handle 0 products */}
                    {!productsLoading &&
                      products?.length === 0 &&
                      searchTerm && (
                        <div className="w-full bg-gray-100 border border-gray-200 p-2 rounded-lg">
                          <p className="text-gray-500 text-base">
                            {productsCount} products found
                          </p>
                        </div>
                      )}

                    {/* Handle many products */}
                    {!productsLoading && products?.length > 0 && (
                      <select
                        value={selectedProduct?.id || ""}
                        onChange={(e) =>
                          handleSelectProduct(parseInt(e.target.value))
                        } // pass the selected product id to the function to set the selected product state
                        className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 p-2 rounded-lg text-base font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      >
                        {/* Default Option */}
                        <option value="" disabled>
                          {`${productsCount} ${
                            productsCount > 1 ? "products" : "product"
                          } found`}
                        </option>

                        {products.map((product) => (
                          <option
                            key={product.id}
                            value={product.id}
                            disabled={
                              product.product_stock <= 5 || !product.is_active
                            }
                          >
                            {product.product_name} -{" "}
                            {product.onSale
                              ? convertPriceToBHD(
                                  String(product.product_price_after_discount)
                                )
                              : convertPriceToBHD(
                                  String(product.product_price)
                                )}{" "}
                            - {product.is_active ? "Active" : "Inactive"} -{" "}
                            {`${product.product_stock} ${
                              product.product_stock > 1 ? "Stocks" : "Stock"
                            } left`}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Add new Item Section Container*/}
                  {selectedProduct && (
                    <div className="flex items-center gap-2 mt-2">
                      {/* Quantity Field Container */}
                      <div className="flex-1">
                        <label className="block text-base font-medium text-gray-700 mb-1">
                          Quantity:
                        </label>

                        <input
                          type="number"
                          min="1"
                          max={selectedProduct.product_stock}
                          value={quantityToAdd}
                          onChange={(e) =>
                            setQuantityToAdd(parseInt(e.target.value))
                          }
                          className="w-full p-2 border rounded-lg"
                        />
                      </div>

                      <button
                        onClick={handleAddProduct}
                        className="h-10 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors mt-6"
                      >
                        Add to Order
                      </button>
                    </div>
                  )}
                </div>

                {/* Products Table */}
                <div className="w-full overflow-auto mt-4">
                  {/* Table Title */}
                  <h3 className="font-medium text-lg mb-2">Order Items</h3>

                  {/* Table */}
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[100px]">
                          Product
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Name
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                          Quantity
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                          Unit Price
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                          Total Price
                        </th>
                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                          New Quantity
                        </th>
                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="[&_tr:last-child]:border-0">
                      {/* Handle no items */}
                      {editedOrderItems.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center py-4 text-gray-500"
                          >
                            No items in the order.
                          </td>
                        </tr>
                      )}

                      {/* Note: orderItems from order and the editedOrderItems is the same but can be edited */}
                      {orderItems?.map((item) => {
                        // Get the edited item from the
                        const editedItem = editedOrderItems.find(
                          (editItem) => editItem.product_id === item.product.id // return the product that its id is equal to the product id of the order item
                        );

                        // Skip showing items that have been removed
                        if (!editedItem) return null;

                        // Get the current quantity of the product that is being edited
                        const currentQuantity =
                          editedItem?.quantity || item.quantity;

                        // Get the unit price of the product based on whether it is on sale or not
                        const unitPrice = item.product.onSale
                          ? item.product.product_price_after_discount
                          : item.product.product_price;

                        // Get the total price of the product based on the quantity and unit price
                        const totalPrice =
                          Number(unitPrice) * Number(currentQuantity);

                        return (
                          <tr
                            key={item.id}
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                          >
                            {/* Product Image */}
                            <td className="p-4 align-middle">
                              <Image
                                src={
                                  item.product.images[0] || "/placeholder.svg"
                                }
                                alt={item.product.product_name}
                                width={80}
                                height={80}
                                className="rounded-md object-cover"
                              />
                            </td>

                            {/* Product Name */}
                            <td className="p-4 align-middle text-left">
                              {item.product.product_name}
                            </td>

                            {/* Order Item Quantity */}
                            <td className="p-4 align-middle text-right">
                              {item.quantity}
                            </td>

                            {/* Product Unit Price */}
                            <td className="p-4 align-middle text-right">
                              {item.product.onSale
                                ? convertPriceToBHD(
                                    item.product.product_price_after_discount
                                  )
                                : convertPriceToBHD(item.product.product_price)}
                            </td>

                            {/* Order Item Total Price */}
                            <td className="p-4 align-middle text-right">
                              {convertPriceToBHD(String(totalPrice))}
                            </td>

                            {/* Quantity Selector */}
                            <td className="p-4 align-middle">
                              <input
                                type="number"
                                min="1"
                                max={item.product.product_stock + item.quantity} // Allow for the original quantity plus available stock
                                value={currentQuantity}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    item.product.id,
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-20 p-2 border rounded"
                              />
                            </td>

                            {/* Remove Button */}
                            <td className="p-4 align-middle">
                              <button
                                onClick={() =>
                                  handleRemoveItem(item.product.id)
                                }
                                className="p-2 text-red-500 hover:text-red-700"
                                title="Remove item"
                              >
                                <Image
                                  src={icons.delete100.src}
                                  alt="delete Icon"
                                  width={27}
                                  height={27}
                                  loading="lazy"
                                />
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                      {/* Show newly added products that weren't in the original order */}
                      {editedOrderItems
                        .filter(
                          // Bring the items that are not in the order items (available in the edited array ONLY)
                          (item) =>
                            !orderItems?.some(
                              (orderItem) =>
                                orderItem.product.id === item.product_id // From the (edited array) return true if the product id is equal to the product id of the order item
                            )
                        )
                        .map((newItem) => {
                          // Get the product details from the search results
                          const product = products.find(
                            (product) => product.id === newItem.product_id // Return the product that his id is equal to the product id of the edited order item
                          );

                          // Skip if product not found
                          if (!product) return null;

                          // Get the unit price of the product based on whether it is on sale or not
                          const unitPrice = product.onSale
                            ? product.product_price_after_discount
                            : product.product_price;

                          // Get the total price of the product based on the quantity and unit price
                          const totalPrice =
                            Number(unitPrice) * Number(newItem.quantity);

                          return (
                            <tr
                              key={product.id}
                              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            >
                              {/* Product Image */}
                              <td className="p-4 align-middle">
                                <Image
                                  src={product.images[0] || "/placeholder.svg"}
                                  alt={product.product_name}
                                  width={80}
                                  height={80}
                                  className="rounded-md object-cover"
                                />
                              </td>

                              {/* Product Name */}
                              <td className="p-4 align-middle text-left">
                                {product.product_name}
                              </td>

                              {/* Order Item Quantity */}
                              <td className="p-4 align-middle text-right">
                                {newItem.quantity}
                              </td>

                              {/* Product Unit Price */}
                              <td className="p-4 align-middle text-right">
                                {convertPriceToBHD(unitPrice)}
                              </td>

                              {/* Order Item Total Price */}
                              <td className="p-4 align-middle text-right">
                                {convertPriceToBHD(String(totalPrice))}
                              </td>

                              {/* Quantity Selector */}
                              <td className="p-4 align-middle">
                                <input
                                  type="number"
                                  min="1"
                                  max={product.product_stock}
                                  value={newItem.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      newItem.product_id,
                                      parseInt(e.target.value)
                                    )
                                  }
                                  className="w-20 p-2 border rounded"
                                />
                              </td>

                              {/* Remove Button */}
                              <td className="p-4 align-middle">
                                <button
                                  onClick={() =>
                                    handleRemoveItem(newItem.product_id)
                                  }
                                  className="p-2 text-red-500 hover:text-red-700"
                                  title="Remove item"
                                >
                                  <Image
                                    src={icons.delete100.src}
                                    alt="delete Icon"
                                    width={27}
                                    height={27}
                                    loading="lazy"
                                  />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* Save Button Container */}
      <div className="mt-4">
        <Button
          onClick={() => handleSubmit()}
          type="submit"
          text="Save Changes"
          buttonClassName="w-full hover:bg-green-50"
          disabled={isSubmitting || !editedOrderItems.length} // Disable button if submitting or no items in the order
        />
      </div>
    </div>
  );
}
