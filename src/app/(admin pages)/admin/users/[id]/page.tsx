"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// import types
import { User } from "@/types/User";

// import backend services
import { getUserDetails, updateUser } from "@/services/user-services";

// import helpers
import { convertPriceToBHD, formatDateTime } from "@/lib/helpers";

// import constants
import { cities } from "@/types/cities";

// import components
import PageTitle from "@/components/PageTitle";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { TwoColumnLayout } from "@/components/(layouts)/TwoColumnLayout";
import Table from "@/components/Table";

export default function page({ params }: { params: Promise<{ id: string }> }) {
  // Router instance
  const router = useRouter();

  // Get the order ID from the URL parameters then extract the order ID from the promise
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  // State to store the loading status
  const [loading, setLoading] = useState<boolean>(true);

  // State to store submission status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // State to store the order details
  const [UserDetails, setUserDetails] = useState<User>();

  // State to store the server response
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

  // State to store form data
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    role: "",
    home_number: "",
    street_number: "",
    block_number: "",
    city: "",
  });

  // Fetch data from server
  const fetchData = async () => {
    // Call the server API to get the order details
    const response = await getUserDetails(id);

    // Update the UI
    setServerResponse({
      status: response.status,
      message: !response.status && response.message, // Show the error message if the status is false
    });

    if (response.status) {
      setUserDetails(response.user);

      // Set the form data with the user details
      setFormData({
        first_name: response.user.first_name,
        last_name: response.user.last_name,
        email: response.user.email,
        phone_number: response.user.phone_number,
        password: "",
        role: response.user.role,
        home_number: response.user.address?.home_number || "",
        street_number: response.user.address?.street_number || "",
        block_number: response.user.address?.block_number || "",
        city: response.user.address?.city || "",
      });
    } else {
      setServerResponse({
        status: response.status,
        message: response.message,
      });
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

  // Handle form submission
  const handleSubmit = async () => {
    // Set loading to true while submitting data
    setIsSubmitting(true);

    // Call the server API to update the user details
    const response = await updateUser(id, formData);

    // Update the UI
    setServerResponse({
      status: response.status,
      message: response.message, // Show the error message if the status is false
    });

    // Set loading to false after submitting data
    setIsSubmitting(false);

    // Scroll to the top of the page after submission
    window.scrollTo({ top: 0, behavior: "smooth" }); // 'smooth' or 'auto'
  };

  // Prepare the columns for the table
  const columns: {
    key: string;
    label: string;
    align?: "left" | "center" | "right";
  }[] = [
    { key: "id", label: "Order Id", align: "center" },
    { key: "status", label: "Order Status", align: "center" },
    { key: "created_at", label: "Order Date", align: "center" },
    { key: "total_price", label: "Order Total", align: "center" },
  ];

  return (
    <>
      {/* Page Header */}
      <PageTitle
        title="User Details"
        subtitle={`View ${UserDetails?.first_name} ${UserDetails?.last_name} Details`}
        actionButton={
          <Button text="Back" onClick={() => window.history.back()} />
        }
      />

      {/* Content Layout */}
      <div className="flex flex-col gap-4">
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

        <TwoColumnLayout>
          {/* User Details */}
          <Card
            CardTitle="User Details"
            CardDescription={`${
              UserDetails?.first_name
            } Joined NeoTech on ${formatDateTime(
              String(UserDetails?.created_at)
            )}`}
            CardContent={
              <>
                {/* User Details Form */}
                <form className="flex flex-col gap-3">
                  {/* First Name Field */}
                  <div className="flex flex-col">
                    <label className="block text-base font-medium text-gray-700 mb-2">
                      First Name
                    </label>

                    <input
                      className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          first_name: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Last Name Field */}
                  <div className="flex flex-col">
                    <label className="block text-base font-medium text-gray-700 mb-2">
                      Last Name
                    </label>

                    <input
                      className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          last_name: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Email Field */}
                  <div className="flex flex-col">
                    <label className="block text-base font-medium text-gray-700 mb-2">
                      Email Address
                    </label>

                    <input
                      type="email"
                      className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Phone Number Field */}
                  <div className="flex flex-col">
                    <label className="block text-base font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>

                    <input
                      className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                      value={formData.phone_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone_number: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Password Field */}
                  <div className="flex flex-col">
                    <label className="block text-base font-medium text-gray-700 mb-2">
                      Password
                    </label>

                    <input
                      type="password"
                      className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                      value={formData.password}
                      placeholder="Leave blank to keep the same password"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Role field container */}
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">
                      User Role
                    </label>

                    <select
                      id="payment_method"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 p-2 rounded-lg text-base font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    >
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  </div>

                  {/* Address Fields Container */}
                  <div className="grid grid-cols-2 gap-4">
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
                        id="home_number"
                        value={formData.home_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            home_number: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
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
                        id="street"
                        value={formData.street_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            street_number: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
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
                        id="block"
                        value={formData.block_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            block_number: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
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
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            city: e.target.value,
                          })
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
                  </div>

                  <Button
                    text={`${
                      isSubmitting ? "Updating..." : "Update User Details"
                    }`}
                    buttonClassName="w-full"
                    disabled={isSubmitting}
                    onClick={() => handleSubmit()}
                  />
                </form>
              </>
            }
            loading={loading}
            CardHeight={"h-[800px]"}
            CardMaxContentHeight={"h-[800px]"}
          />

          {/* User Order History */}
          <Card
            CardTitle="User Orders History"
            CardDescription={`${UserDetails?.first_name} has ${UserDetails?.orders?.length} orders`}
            CardContent={
              <Table
                columns={columns}
                rows={UserDetails?.orders || []}
                noDataMessage="No Orders For This User."
                onRowClick={(row) => console.log("Row clicked:", row)}
                renderCell={(row, key) => {
                  // Format the order status
                  // Render Order Status
                  if (key === "status") {
                    // Get the order status
                    const status = row.status;

                    // Badge
                    const baseClass =
                      "px-3 py-1 rounded-md text-sm border capitalize"; // Define the base class for the role badge
                    let badgeClass =
                      "bg-gray-100 text-gray-700 border border-gray-400"; // Define the badge class based on the role

                    // Define the badge class based on the status
                    if (status === "pending") {
                      badgeClass =
                        "bg-yellow-100 text-yellow-700 border-yellow-400";
                    }
                    if (status === "canceled") {
                      badgeClass = "bg-red-100 text-red-700 border-red-400";
                    }
                    if (status === "completed") {
                      badgeClass =
                        "bg-green-100 text-green-700 border-green-400";
                    }

                    return (
                      <span className={`${baseClass} ${badgeClass}`}>
                        {status}
                      </span>
                    );
                  }

                  // Format the order date
                  if (key === "created_at") {
                    return <span>{formatDateTime(row.created_at)}</span>;
                  }

                  // Format the order total price
                  if (key === "total_price") {
                    return <span>{convertPriceToBHD(row.total_price)}</span>;
                  }

                  // No Formatting for the cell
                  return <span>{row[key]}</span>;
                }}
              />
            }
            loading={loading}
            CardHeight={"h-[800px]"}
            CardMaxContentHeight={"h-[800px]"}
          />
        </TwoColumnLayout>
      </div>
    </>
  );
}
