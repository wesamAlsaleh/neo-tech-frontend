"use client";

import { createContext, Dispatch, SetStateAction, useContext } from "react";

// import the User type
import { User } from "@/types/user";

// create an interface for the AuthContext
interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

// create a context to store the user data and the setUser function
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

/**
 * Custom hook to access the authentication context.
 *
 * This hook provides access to the authentication context, allowing components
 * to access authentication-related data and functions.
 *
 * @throws {Error} If the hook is used outside of an `AuthProvider`.
 *
 * @returns {AuthContextType} The authentication context value.
 */
export const useAuth = (): AuthContextType => {
  // Get the authentication context value from the context.
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
