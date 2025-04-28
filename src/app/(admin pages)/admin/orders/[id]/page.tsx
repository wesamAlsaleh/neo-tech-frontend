"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Import the OrderDetails type
import { OrderDetails } from "@/types/order";

// import backend services
import { getOrderById } from "@/services/order-services";

// import helpers
import {
  formatDateTime,
  convertPriceToBHD,
  getStatusColor,
} from "@/lib/helpers";

// import icons
import { icons } from "../../../../../../public/icons";

// import custom components
import LoadingSpinner from "@/components/LoadingSpinner";
import Card from "@/components/Card";
import Button from "@/components/Button";
import PageTitle from "@/components/PageTitle";

export default function page({ params }: { params: Promise<{ id: string }> }) {
  // Router instance
  const router = useRouter();

  // Get the order ID from the URL parameters then extract the order ID from the promise
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  // State to store the loading status
  const [loading, setLoading] = useState<boolean>(true);

  // State to store the order details
  const [order, setOrder] = useState<OrderDetails>();

  // State to store the server response
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

  // Fetch data from server
  const fetchData = async () => {
    // Call the server API to get the order details
    const response = await getOrderById(id);

    // Update the UI
    setServerResponse({
      status: response.status,
      message: response.message,
    });

    if (response.status) {
      setOrder(response.order);
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
  }, []);

  // If the loading state is true, show a loading message
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Header Container */}
      <PageTitle
        title={`Order #${id}`}
        actionButton={
          <Button iconSize={21} text="Back" onClick={() => router.back()} />
        }
        actionButton2={
          <Button
            text="Edit"
            onClick={() => router.push(`/admin/orders/${order?.id}/edit`)}
            iconSrc={icons.edit100.src}
          />
        }
        actionButton3={<Button text="Download" />}
        actionButton4={<Button text="Print" />}
      />

      {/* Content Container */}
      <div className="flex flex-col gap-4 w-full">
        {/* Top half Container */}
        <div className="flex flex-wrap md:flex-nowrap gap-4 w-full">
          {/* Order Items Container */}
          <div className="w-full md:w-[70%]">
            <Card
              CardTitle="Order Items"
              CardDescription={`Placed by ${order?.user.first_name} ${order?.user.last_name}`}
              CardContent={
                // Table Container
                <div className="w-full overflow-auto">
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
                      </tr>
                    </thead>

                    <tbody className="[&_tr:last-child]:border-0">
                      {order?.order_items.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          {/* Product Image */}
                          <td className="p-4 align-middle">
                            <Image
                              src={item.product.images[0] || "/placeholder.svg"}
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
                            {convertPriceToBHD(String(item.price))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              }
            />
          </div>

          {/* Order Summary Container */}
          <div className="w-full md:w-[30%]">
            <Card
              CardTitle="Order Summary"
              CardHeight={"h-[235px]"} // Set the Card height to 235px fixed height
              CardContent={
                <div className="flex flex-col gap-2">
                  {/* Order Summary Row Container */}
                  <div className="flex justify-between items-center">
                    <h1 className="text-gray-800 font-semibold">Subtotal:</h1>
                    <p className="font-medium text-gray-800">
                      {convertPriceToBHD(String(order?.total_price))}
                    </p>
                  </div>

                  {/* Order Summary Row Container */}
                  <div className="flex justify-between items-center">
                    <h1 className="text-gray-800 font-semibold">Shipping:</h1>
                    <p className="font-medium text-gray-800">Free Shipping</p>
                  </div>

                  {/* Separator */}
                  <div className="h-[1px] bg-gray-200 w-full" />

                  {/* Order Summary Row Container */}
                  <div className="flex justify-between items-center">
                    <h1 className="text-gray-800 font-semibold">Total:</h1>
                    <p className="font-medium text-gray-800">
                      {convertPriceToBHD(String(order?.total_price))}
                    </p>
                  </div>
                </div>
              }
            />
          </div>
        </div>

        {/* Bottom half Container */}
        <div className="flex flex-wrap md:flex-nowrap gap-4 w-full">
          {/* Shipping Information Container */}
          <div className="w-full md:w-[50%]">
            <Card
              CardTitle="Shipping Information"
              CardHeight={"h-[235px]"} // Set the Card height to 235px fixed height
              CardContent={
                <div className="flex flex-col gap-2">
                  {/* Shipping Address Row Container */}
                  <div className="flex flex-col gap-2">
                    <h1 className="text-gray-800 font-semibold">
                      Shipping Address:
                    </h1>

                    <p className="text-gray-500">{order?.shipping_address}</p>
                  </div>

                  {/* Shipping Status Row Container */}
                  <div className="flex flex-col gap-2">
                    <h1 className="text-gray-800 font-semibold">
                      Shipping Status:
                    </h1>

                    <div
                      className={`capitalize text-center w-1/6 px-2 py-1 rounded inline-block ${getStatusColor(
                        order?.status!
                      )}`}
                    >
                      {order?.status}
                    </div>
                  </div>
                </div>
              }
            />
          </div>

          {/* Payment Information Container */}
          <div className="w-full md:w-[50%]">
            <Card
              CardTitle="Payment Information"
              CardHeight={"h-[235px]"} // Set the Card height to 235px fixed height
              CardContent={
                <div className="flex flex-col gap-2">
                  {/* Payment Method Row Container */}
                  <div className="flex justify-between items-center">
                    <h1 className="text-gray-800 font-semibold">
                      Payment Method:{" "}
                    </h1>

                    <p className="font-medium text-gray-800">
                      {order?.payment_method}
                    </p>
                  </div>

                  {/* Payment Status Row Container */}
                  <div className="flex justify-between items-center">
                    <h1 className="text-gray-800 font-semibold">
                      Payment Status:{" "}
                    </h1>

                    <p className="font-medium text-gray-800">NAN</p>
                  </div>

                  {/* Payment Date Row Container */}
                  <div className="flex justify-between items-center">
                    <h1 className="text-gray-800 font-semibold">
                      Payment Date:{" "}
                    </h1>

                    <p className="font-medium text-gray-800">
                      {formatDateTime(String(order?.created_at))}
                    </p>
                  </div>
                </div>
              }
              CardFooter={
                <div className="p-1">
                  <Button text="Request Invoice" buttonClassName="w-full" />
                </div>
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
