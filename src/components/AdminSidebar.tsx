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

  // Check if the current pathname matches the href
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out ${
          isActive
            ? "bg-orange-600 text-white font-medium shadow-md"
            : "text-gray-300 hover:bg-gray-800/70 hover:text-white"
        }`}
      >
        {/* Display Icon on the left if there is one */}
        {icon && <span className="text-lg">{icon}</span>}

        {/* Display the name of the link */}
        <span className="text-base font-medium">{name}</span>

        {/* Display the indicator if the link is active */}
        {isActive && (
          <div className="ml-auto w-1.5 h-5 bg-white/20 rounded-full" />
        )}
      </Link>
    </li>
  );
};

export default function AdminSidebar() {
  return (
    <aside className="flex flex-col w-64 min-h-screen bg-gray-900 text-gray-300 p-5 shadow-lg">
      {/* Side Bar LOGO Container */}
      <div className="mb-8 px-2">
        <Link href="/home" className="block py-2">
          <h1 className="text-xl font-bold text-white flex items-center">
            {/* Logo */}
            <span className="bg-orange-600 w-8 h-8 rounded-md flex items-center justify-center mr-3 shadow-md">
              <span className="text-white text-sm font-bold">NT</span>
            </span>
            {/* Title */}
            NeoTech Admin
          </h1>
        </Link>
      </div>

      {/* Content Container */}
      <nav className="flex-1">
        {/* Group 1 */}
        <GroupTitle title="Shop" />
        <ul className="space-y-1.5">
          <LI href="/admin/dashboard" name="Dashboard" />
          <LI href="/admin/categories" name="Categories" />
          <LI href="/admin/products" name="Products" />
          <LI href="/admin/orders" name="Orders" />
          <LI href="/admin/customize" name="Customize Shop" />
        </ul>

        {/* Group 2 */}
        {/* <GroupTitle title="Shop" mt /> */}
        <ul className="space-y-1.5">
          {/* <LI href="/admin/settings" name="Settings" /> */}
          {/* <LI href="/admin/help" name="Help & Support" /> */}
        </ul>
      </nav>
    </aside>
  );
}

const GroupTitle = ({ title, mt }: { title: string; mt?: boolean }) => {
  return (
    <div
      className={`text-xs uppercase text-gray-500 font-semibold tracking-wider mb-3 px-4 ${
        mt ? "mt-8" : ""
      }`}
    >
      {title}
    </div>
  );
};
