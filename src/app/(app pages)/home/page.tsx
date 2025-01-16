"use client";

import Link from "next/link";
import React from "react";

// import the auth context to get the user data
import { useAuth } from "@/contexts/AuthContext";

// Import custom components TODO: Enhance the component to be more reusable and flexible
import LoadingSpinner from "@/components/LoadingSpinner";

export default function homePage() {
  // get user data
  const { user, loading } = useAuth();

  return (
    <>
      {/* Navbar container */}
      <div className="flex p-4 items-center justify-between">
        {/* Shop name */}
        <div className="flex items-center ml-10">
          <h1 className="text-3xl font-bold text-primary">neoTech</h1>
        </div>

        {/* pages links */}
        <div className="flex space-x-4">
          <button>
            <Link href="/" className="font-bold">
              <h1>Home</h1>
            </Link>
          </button>

          <button>
            <Link href="/contact" className="font-bold">
              <h1>Contact</h1>
            </Link>
          </button>

          <button>
            <Link href="/about" className="font-bold">
              <h1>About</h1>
            </Link>
          </button>

          {/* if not authenticated show signup button */}
          {!user ? (
            loading ? null : (
              <Link href="/register" className="font-bold">
                <h1>Sign up</h1>
              </Link>
            )
          ) : null}

          {/* TODO: remove this button */}
          <button>
            <Link href="/dashboard" className="font-bold">
              <h1>Dashboard</h1>
            </Link>
          </button>
        </div>

        {/* Search bar and icons */}
        <div className="flex items-center space-x-4">
          <div className="flex">
            <input
              type="text"
              placeholder="Search"
              className="border-2 border-gray-300 p-1"
            />
            <button className="bg-orange-500 text-white p-1">Search</button>
          </div>

          <button>
            <Link href="#">
              <h1>Wish list icon</h1>
            </Link>
          </button>

          <button>
            <Link href="#">
              <h1>Cart icon</h1>
            </Link>
          </button>

          {/* if logged in show the profile icon here */}
          {user ? (
            loading ? null : (
              <button>
                <Link href="#">
                  <h1>Profile DropDown Menu</h1>{" "}
                </Link>
              </button>
            )
          ) : null}
        </div>
      </div>
    </>
  );
}
