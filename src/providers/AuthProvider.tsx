"use client";

import React, { useState, useEffect } from "react";

// import the auth context to store the user data in it + to prepare it to wrap the whole application
import { AuthContext } from "@/contexts/AuthContext";

// import the getUser function from the auth services file
import { getUser } from "@/services/auth-services";

// import the User type
import { User } from "@/types/user";

// import the loading spinner component
import LoadingSpinner from "@/components/LoadingSpinner";

/**
 * AuthProvider component that provides authentication context for the application.
 *
 * This component is responsible for managing and providing the authentication state,
 * user data, and related states (e.g., cart items count, wishlist count) to the rest
 * of the application. It also handles fetching user data from the server and managing
 * the loading state during the fetch process.
 *
 * @component
 * @param {React.ReactNode} children - The child components that will have access to the authentication context.
 *
 * @remarks
 * - The `AuthContext` is used to share the authentication state across the application.
 * - The `useAuth` hook can be used to access the context values in child components.
 *
 * @state {User | null} user - Stores the authenticated user's data.
 * @state {number} userCartItemsCount - Stores the count of items in the user's cart.
 * @state {number} userWishlistCount - Stores the count of items in the user's wishlist.
 * @state {boolean} loading - Indicates whether the user data is being fetched.
 *
 * @function fetchUser - Fetches the user data from the server and updates the `user` state.
 *
 * @example
 * ```tsx
 * import { AuthProvider } from './AuthProvider';
 *
 * const App = () => (
 *   <AuthProvider>
 *     <YourAppComponents />
 *   </AuthProvider>
 * );
 * ```
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  /**
   * This component provides the authentication context for the application.
   * It fetches the user data from the server and provides it to the rest of the app.
   *
   * @note All the states will be available in the AuthContext and can be accessed using the useAuth hook.
   */
  // Set the user state to store the user data
  const [user, setUser] = useState<User | null>(null);

  // Set the user cart items count state to store the user cart items count
  const [userCartItemsCount, setUserCartItemsCount] = useState<number>(0);

  // Set the user wishlist count state to store the user wishlist count
  const [userWishlistCount, setUserWishlistCount] = useState<number>(0);

  // Set the loading state to show the loading spinner when fetching the user data
  const [loading, setLoading] = useState(true);

  // Function to fetch the user data from the server
  const fetchUser = async () => {
    try {
      // Fetch the user data from the server
      const result = await getUser();

      // If the request is successful set the user data
      if (result.success) {
        setUser(result.userData);
        setUserCartItemsCount(result.userCartItemsCount);
        setUserWishlistCount(result.userWishlistItemsCount);
      }
    } catch (error) {
      setUser(null); // Set the user to null if there is an error
    } finally {
      setLoading(false); // Set the loading to false after the request is done
    }
  };

  // Fetch the user data when the component mounts
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        userCartItemsCount,
        setUserCartItemsCount,
        userWishlistCount,
        setUserWishlistCount,
      }}
    >
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};

// Response from the server when a user is retrieved successfully
// {
//   "message": "User retrieved successfully",
//   "userData": {
//       "id": 1,
//       "first_name": "dev",
//       "last_name": "Wesam",
//       "email": "dev@d.com",
//       "email_verified_at": null,
//       "role": "admin",
//       "phone_number": "12345678",
//       "created_at": "2025-03-08T22:47:32.000000Z",
//       "updated_at": "2025-03-08T22:47:32.000000Z",
//       "cart_items": [],
//       "wishlist": [],
//   },
//   "userCartItemsCount": 1,
//   "userWishlistCount": 4
// }
