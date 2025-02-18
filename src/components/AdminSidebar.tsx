"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  // Get the url of the current page and highlight the corresponding link
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-gray-300 p-4">
      {/* nav title container */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
      </div>

      {/* content container */}
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              href="/admin/dashboard"
              className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800  ${
                pathname === "/admin/dashboard" ? "bg-gray-800" : ""
              }`}
            >
              {/* <LayoutDashboard size={20} /> */}
              <span>Dashboard</span>
            </Link>
          </li>

          <li>
            <Link
              href="/admin/categories"
              className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 ${
                pathname === "/admin/categories" ? "bg-gray-800" : ""
              }`}
            >
              {/* <Grid size={20} /> */}
              <span>Categories</span>
            </Link>
          </li>

          <li>
            <Link
              href="/admin/products"
              className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 ${
                pathname === "/admin/products" ? "bg-gray-800" : ""
              }`}
            >
              {/* <Package size={20} /> */}
              <span>Products</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
