"use client";

import React, { useState, useEffect } from "react";

// import the auth context to store the user data in it + to prepare it to wrap the whole application
import { AuthContext, useAuth } from "@/contexts/AuthContext";

// import axios
import axios from "axios";

// import router
import { useRouter } from "next/navigation";

// import the getUser function from the auth services file
import { getUser } from "@/services/auth-services";

// import the User type
import { User } from "@/types/user";

// Auth provider to wrap the application with the user data
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null); // user state
  const [loading, setLoading] = useState(true); // loading state

  // Fetch the user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getUser();

        if (result.success) {
          setUser(result.userData);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
