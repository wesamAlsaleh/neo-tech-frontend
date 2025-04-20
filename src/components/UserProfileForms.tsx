"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// import types
import { User, UserAddress } from "@/types/User";

// import the auth context to get the user data
import { useAuth } from "@/contexts/AuthContext";

// import services
import { putAddress } from "@/services/user-address-services";
import {
  changePassword,
  handleLogout,
  updateProfile,
} from "@/services/auth-services";

// interface for the form component props
interface UserProfileFormsProps {
  user: User;
  userAddress: UserAddress | null;
}

// import the cities
import { cities } from "@/types/cities";

export default function UserProfileForms(props: UserProfileFormsProps) {
  // Get the user from props
  const { user, userAddress } = props;

  // Get the user setter from the auth context
  const {
    setUser,
    setUserAddress,
    setUserCartItemsCount,
    setUserWishlistCount,
  } = useAuth();

  // Router instance
  const router = useRouter();

  // State to store the user profile data
  const [firstName, setFirstName] = useState<string>(user.first_name);
  const [lastName, setLastName] = useState<string>(user.last_name);
  const [email, setEmail] = useState<string>(user.email);
  const [phone, setPhone] = useState<string>(user.phone_number);
  const [role, setRole] = useState<string>(user.role);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // State to store the user address data
  const [homeNumber, setHomeNumber] = useState<string | null>(
    userAddress?.home_number ?? null
  );
  const [blockNumber, setBlockNumber] = useState<string | null>(
    userAddress?.block_number ?? null
  );
  const [streetNumber, setStreetNumber] = useState<string | null>(
    userAddress?.street_number ?? null
  );
  const [city, setCity] = useState<string | null>(userAddress?.city ?? null);

  // TODO: State to store the user payment data
  //   const [cardHolderName, setCardHolderName] = useState<string>("");
  //   const [cardNumber, setCardNumber] = useState<string>("");
  //   const [expiryDate, setExpiryDate] = useState<string>("");
  //   const [cvv, setCvv] = useState<string>("");

  // State to store the server response after updating the profile
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

  const [showPersonalDataForm, setShowPersonalDataForm] = useState(true);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // State to store the form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to handle the personal data form submission
  const handlePersonalDataSubmit = async (e: React.FormEvent) => {
    // Prevent the default form submission
    e.preventDefault();

    // Set the form submission status to true to disable the submit button
    setIsSubmitting(true);

    // Prepare form data
    const formData = new FormData();

    // Check no values are empty
    if (!firstName || !lastName || !email || !phone) {
      setServerResponse({
        status: false,
        message: `${firstName ? "" : "First Name"}${
          lastName ? "" : "Last Name"
        }${email ? "" : "Email"}${
          phone ? "" : "Phone Number"
        } cannot be empty!`,
      });
      return;
    }

    // Append the form data
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("phone_number", phone);

    try {
      setIsSubmitting(true);

      // Submit the form data using the service
      const result = await updateProfile(formData);

      // Update UI with the response
      setServerResponse({
        status: result.status,
        message: result.message,
      });
    } finally {
      setIsSubmitting(false); // Set the form submission status to false to enable the submit button
    }
  };

  // Function to handle the password change form submission
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    // Prevent the default form submission
    e.preventDefault();

    // Set the form submission status to true to disable the submit button
    setIsSubmitting(true);

    // Prepare form data
    const formData = new FormData();

    // Append the form data
    formData.append("current_password", currentPassword);
    formData.append("new_password", newPassword);
    formData.append("confirm_password", confirmPassword);

    try {
      setIsSubmitting(true);

      // Submit the form data using the service
      const result = await changePassword(formData);

      // Update UI with the response
      setServerResponse({
        status: result.status,
        message: result.message,
      });
    } finally {
      // Set the form submission status to false to enable the submit button
      setIsSubmitting(false);
    }
  };

  // Function to handle the address form submission
  const handleAddressSubmit = async (e: React.FormEvent) => {
    // Prevent the default form submission
    e.preventDefault();

    // Set the form submission status to true to disable the submit button
    setIsSubmitting(true);

    // Prepare form data
    const formData = new FormData();

    // Append the form data if not null (it cannot be null to send the form data to the database, in updating it will overwrite the null value to the old value)
    if (homeNumber) formData.append("home_number", homeNumber);
    if (blockNumber) formData.append("block_number", blockNumber);
    if (streetNumber) formData.append("street_number", streetNumber);
    if (city) formData.append("city", city);

    try {
      setIsSubmitting(true);

      if (userAddress === null) {
        // Submit the address form data using the service for creating a new address
        const result = await putAddress(formData, true);

        // Update UI with the response
        setServerResponse({
          status: result.status,
          message: result.message,
        });
      } else {
        // Submit the address form data using the service for updating an existing address
        const result = await putAddress(formData, true);

        // Update UI with the response
        setServerResponse({
          status: result.status,
          message: result.message,
        });
      }
    } finally {
      // Set the form submission status to false to enable the submit button
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* TODO: Convert this to Toast Message */}
      {/* Form Status Message */}
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

      {/* Personal Data Button */}
      <button
        type="button"
        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed ${
          showPersonalDataForm
            ? "bg-orange-600 hover:bg-orange-700"
            : "bg-orange-600 hover:bg-orange-700"
        }`}
        onClick={() => setShowPersonalDataForm(!showPersonalDataForm)}
      >
        Modify Your Personal Data ({user.first_name} {user.last_name})
      </button>

      {/* Personal Data Section */}
      {showPersonalDataForm && (
        <div>
          {/* Update Personal Data Form  */}
          <form
            onSubmit={(e) => handlePersonalDataSubmit(e)}
            className="space-y-4"
          >
            {/* First Name field container */}
            <div className="space-y-2">
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>

              <input
                type="text"
                id="first_name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
              />
            </div>

            {/* Last Name field container */}
            <div className="space-y-2">
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>

              <input
                type="text"
                id="last_name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
              />
            </div>

            {/* Email field container */}
            <div className="space-y-2">
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
              />
            </div>

            {/* Phone Number field container */}
            <div className="space-y-2">
              <label
                htmlFor="phone_number"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>

              <input
                type="tel"
                // Pattern for Bahrain phone number format (e.g., 37234155)
                pattern="^(?:[0-9]{8})$"
                id="phone_number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
              />
            </div>

            {/* Action buttons container */}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating" : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Change Password Button */}
      <button
        type="button"
        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed ${
          showPersonalDataForm
            ? "bg-orange-600 hover:bg-orange-700"
            : "bg-orange-600 hover:bg-orange-700"
        }`}
        onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}
      >
        Change Your Password
      </button>

      {/* Change Password Section */}
      {showChangePasswordForm && (
        <div>
          {/* Change Password Form */}
          <form
            onSubmit={(e) => handleChangePasswordSubmit(e)}
            className="space-y-4"
          >
            {/* Change Password Section */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Change Password
              </label>

              <input
                type="password"
                id="current_password"
                value={currentPassword}
                placeholder="Current Password"
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
              />

              <input
                type="password"
                id="new_password"
                value={newPassword}
                placeholder="New Password"
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
              />

              <input
                type="password"
                id="confirm_password"
                value={confirmPassword}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
              />
            </div>

            {/* Action buttons container */}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating" : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address Button */}
      <button
        type="button"
        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed ${
          showAddressForm
            ? "bg-orange-600 hover:bg-orange-700"
            : "bg-orange-600 hover:bg-orange-700"
        }`}
        onClick={() => setShowAddressForm(!showAddressForm)}
      >
        Modify Your Address
      </button>

      {/* Address Section */}
      {showAddressForm && (
        <div>
          {/* Address Form */}
          <form onSubmit={(e) => handleAddressSubmit(e)} className="space-y-4">
            {/* Home Number field container */}
            <div className="space-y-2">
              <label
                htmlFor="home_number"
                className="block text-sm font-medium text-gray-700"
              >
                Home Number
                {homeNumber === null ? (
                  <span className="text-red-600">*</span>
                ) : null}
              </label>

              <input
                type="number"
                min="0"
                id="home_number"
                value={homeNumber || ""}
                required={homeNumber === null}
                onChange={(e) => setHomeNumber(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
              />
            </div>

            {/* Block Number field container */}
            <div className="space-y-2">
              <label
                htmlFor="block_number"
                className="block text-sm font-medium text-gray-700"
              >
                Block Number
                {blockNumber === null ? (
                  <span className="text-red-600">*</span>
                ) : null}
              </label>

              <input
                type="number"
                id="block_number"
                value={blockNumber || ""}
                min="0"
                required={blockNumber === null}
                onChange={(e) => setBlockNumber(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
              />
            </div>

            {/* Street Number field container */}
            <div className="space-y-2">
              <label
                htmlFor="street_number"
                className="block text-sm font-medium text-gray-700"
              >
                Street Number
                {streetNumber === null ? (
                  <span className="text-red-600">*</span>
                ) : null}
              </label>

              <input
                type="number"
                id="street_number"
                value={streetNumber || ""}
                min="0"
                required={streetNumber === null}
                onChange={(e) => setStreetNumber(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
              />
            </div>

            {/* City field container */}
            <div className="space-y-2">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
                {city === null ? <span className="text-red-600">*</span> : null}
              </label>

              <select
                id="city"
                value={city || ""}
                required={city === null}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
              >
                {/* Default */}
                <option value="" disabled>
                  Select City
                </option>

                {/* Map through the cities array and create an option for each city */}
                {cities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Action buttons container */}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating" : "Update Address"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
