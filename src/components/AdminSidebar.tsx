"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

// Custom LI element
const LI = ({
  href,
  name,
  icon,
}: {
  href: string;
  name: string;
  icon?: React.ReactNode;
}) => {
  // Get the url of the current page and highlight the corresponding link
  const pathname = usePathname();

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 ${
          pathname === href ? "bg-gray-800" : ""
        }`}
      >
        {/* <Package size={20} /> */}
        <span>{name}</span>
      </Link>
    </li>
  );
};

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-gray-300 p-4">
      {/* nav title container */}
      <div className="mb-8">
        <Link href={"/home"}>
          <h1 className="text-xl font-bold text-white">NeoTech Admin Panel</h1>
        </Link>
      </div>

      {/* content container */}
      <nav>
        <ul className="space-y-2">
          <LI href="/admin/dashboard" name="Dashboard" />
          <LI href="/admin/categories" name="Categories" />
          <LI href="/admin/products" name="Products" />
          <LI href="/admin/customize" name="Customize Shop" />
        </ul>
      </nav>
    </aside>
  );
}
