"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";

// import the auth context to get the user data
import { useAuth } from "@/contexts/AuthContext";

// import custom components
import DropDownMenu from "./DropDownMenu";

// import the icons
import { icons } from "../../public/icons";
import LoadingSpinner from "./LoadingSpinner";

export default function NavBar() {
  // get user data
  const { user, loading } = useAuth();

  return (
    <div>
      {/* Navbar container */}
      <div className="flex p-4 items-center justify-between bg-gray-100/10 border-b-2 border-gray-300 sticky top-0 z-50">
        {/* Shop name */}
        <div className="flex items-center ml-10">
          <h1 className="text-3xl font-bold text-primary">neoTech</h1>
        </div>

        {/* pages links */}
        <div className="flex space-x-4">
          <button>
            <Link href="/home" className="font-bold">
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

          {user?.role === "admin" ? (
            loading ? null : (
              <button>
                <Link href="/admin/dashboard" className="font-bold">
                  <h1>Dashboard</h1>
                </Link>
              </button>
            )
          ) : null}
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
            <Link href={user ? "/wishlist" : "/login"}>
              <Image
                src={icons.outlineHeartIcon48}
                alt="Wishlist icon"
                width={33}
                height={33}
              />
            </Link>
          </button>

          <button>
            <Link href="/cart">
              <Image
                src={icons.outlineCartIcon48}
                alt="Cart icon"
                width={33}
                height={33}
              />
            </Link>
          </button>

          {/* if logged in show the profile icon */}
          {user ? (
            loading ? (
              <LoadingSpinner />
            ) : (
              <button>
                <Link href="#">
                  <Image
                    src={icons.userIcon48}
                    alt="Cart icon"
                    width={33}
                    height={33}
                  />
                </Link>
              </button>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
