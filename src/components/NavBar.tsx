"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

// import the auth context to get the user data
import { useAuth } from "@/contexts/AuthContext";

// import custom components
import DropDownMenu from "./DropDownMenu";
import LoadingSpinner from "./LoadingSpinner";

// import the icons
import { icons } from "../../public/icons";

export default function NavBar() {
  // get user data
  const { user, loading, userCartItemsCount, userWishlistCount } = useAuth();

  // Get the url of the current page and highlight the corresponding link
  const pathname = usePathname();

  // Prepare NavBar links
  const navItems = [
    { href: "/home", label: "Home" },
    { href: "/contact", label: "Contact" },
    { href: "/about", label: "About" },
  ];

  return (
    <div>
      {/* Navbar container */}
      <div className="h-[70px] flex p-4 items-center justify-between bg-white border-b-2 border-gray-100 sticky top-0 z-50">
        {/* Shop Logo & Name */}
        <div className="flex items-center ml-3">
          <Link
            href="/home"
            className="group flex items-center py-2 transition-transform hover:scale-[1.02] active:scale-95"
          >
            {/* Logo Container */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-32 h-11 rounded-lg flex items-center justify-center mr-3 shadow-lg transition-all duration-300 group-hover:shadow-orange-500/30">
              {/* Logo Text */}
              <span className="text-white text-2xl font-bold tracking-tight">
                NeoTech
              </span>
            </div>
          </Link>
        </div>

        {/* pages links */}
        <div className="flex space-x-4">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`font-bold hover:text-orange-500 transition ${
                pathname === href ? "text-orange-600" : "text-gray-800"
              }`}
            >
              {label}
            </Link>
          ))}

          {/* if not authenticated show signup button */}
          {!user ? (
            loading ? null : (
              <Link
                href="/register"
                className="font-bold text-gray-800 hover:text-orange-500 transition"
              >
                <h1>Sign up</h1>
              </Link>
            )
          ) : null}

          {user?.role === "admin" ? (
            loading ? null : (
              <button>
                <Link
                  href="/admin/dashboard"
                  className="font-bold text-gray-800 hover:text-orange-500 transition"
                >
                  <h1>Dashboard</h1>
                </Link>
              </button>
            )
          ) : null}
        </div>

        {/* Search bar and icons */}
        <div className="flex items-center space-x-4">
          {/* Search Bar Container */}
          <div className="relative mr-5">
            {/* Text Field */}
            <input
              type="text"
              name="search"
              id="search"
              value={""}
              onChange={(e) => {}}
              placeholder="What are you looking for?"
              className="pl-9 pr-4 py-2 w-80 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />

            {/* Search Icon in SVG */}
            <span className="absolute left-2 top-2 text-gray-400">
              {/* Search icon would go here */}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </div>

          {/* Wishlist Button Container */}
          <Link href="/wishlist" className="relative inline-block">
            <Image
              src={icons.outlineHeartIcon48}
              alt="Wishlist icon"
              width={33}
              height={33}
            />

            {/* wishlist items count badge */}
            {userWishlistCount > 0 && (
              <span className="absolute w-4 h-4 -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {userWishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Button Container */}
          <Link href="/cart" className="relative inline-block">
            <Image
              src={icons.outlineCartIcon48}
              alt="Cart icon"
              width={33}
              height={33}
            />

            {/* Cart items count badge */}
            {userCartItemsCount > 0 && (
              <span className="absolute w-4 h-4 -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {userCartItemsCount}
              </span>
            )}
          </Link>

          {/* Profile Button */}
          <Link href="/profile" className="relative inline-block">
            <Image
              src={icons.userIcon48}
              alt="Cart icon"
              width={33}
              height={33}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
