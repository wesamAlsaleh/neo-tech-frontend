"use client";

import { createContext, Dispatch, SetStateAction, useContext } from "react";

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
};

// create an interface for the AuthContext
interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

// create a context to store the user data and the setUser function
const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  setLoading: () => {},
});

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

// {
//     "message": "User retrieved successfully",
//     "status": "success",
//     "data": {
//         "id": 7,
//         "first_name": "Ali",
//         "last_name": "Esa",
//         "email": "wesammuneerali800s@gmail.com",
//         "email_verified_at": null,
//         "role": "user",
//         "phone_number": "11111112",
//         "created_at": "2025-01-13T18:13:52.000000Z",
//         "updated_at": "2025-01-13T18:13:52.000000Z"
//     }
// }
