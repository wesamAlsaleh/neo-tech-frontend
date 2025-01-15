"use client";

import React, { useState, useEffect } from "react";

// import the auth context to store the user data in it + to prepare it to wrap the whole application
import { AuthContext } from "@/contexts/AuthContext";

// import the getUser function from the auth services file
import { getUser } from "@/services/auth-services";

// import the User type
import { User } from "@/types/user";

// Auth provider to wrap the application with the user data
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize the user state with the user data from the local storage or null if it doesn't exist
  const [user, setUser] = useState<User | null>(() => {
    // Get the user from the local storage
    const cachedUser = localStorage.getItem("user");

    // Return the user if it exists from the local storage or return null if it doesn't exist
    return cachedUser ? JSON.parse(cachedUser) : null;
  }); // This state is a function to run only once when the component is mounted

  // Skip loading if user exists in cache
  const [loading, setLoading] = useState(!user);

  // Fetch the user if it doesn't exist in the local storage
  useEffect(() => {
    const fetchUser = async () => {
      /** @this Statement will trigger the user `function/state` to see
       *  if the user doesn't exist in the local storage try to fetch it from the server */
      if (!user) {
        try {
          // Fetch the user data from the server
          const result = await getUser();

          // If the request is successful set the user data in the local storage
          if (result.success) {
            // Set the user data in the state
            setUser(result.userData);

            // Set the user data in the local storage
            localStorage.setItem("user", JSON.stringify(result.userData));
          }
        } catch (error) {
          setUser(null); // Set the user to null if there is an error
        } finally {
          setLoading(false); // Set the loading to false after the request is done
        }
      }
    };

    fetchUser();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Fetching sample response
// {
//   "message": "User retrieved successfully",
//   "status": "success",
//   "data": {
//       "id": 5,
//       "first_name": "Wesam",
//       "last_name": "Muneer",
//       "email": "wesammuneer@gmail.com",
//       "email_verified_at": null,
//       "role": "user",
//       "phone_number": "37234155",
//       "created_at": "2025-01-13T17:45:12.000000Z",
//       "updated_at": "2025-01-13T17:45:12.000000Z"
//   }
// }
