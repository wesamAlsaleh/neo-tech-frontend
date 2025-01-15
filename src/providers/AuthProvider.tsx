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
  });

  // Skip loading if user exists in cache
  const [loading, setLoading] = useState(!user);

  // Fetch the user if it doesn't exist in the local storage
  useEffect(() => {
    const fetchUser = async () => {
      // If the user doesn't exist in the local storage try to fetch it from the server
      if (!user) {
        try {
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
