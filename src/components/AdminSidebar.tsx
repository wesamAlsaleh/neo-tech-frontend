"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

// import icons
import { icons } from "../../public/icons";
import Image from "next/image";

// Custom LI element
const LI = ({
  href,
  name,
  iconSrc,
}: {
  href: string;
  name: string;
  iconSrc?: string;
}) => {
  // Get the url of the current page and highlight the corresponding link
  const pathname = usePathname();

  // Check if the current pathname matches the href
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out ${
          isActive
            ? "bg-orange-600 text-white font-medium shadow-md"
            : "text-gray-300 hover:bg-gray-800/70 hover:text-white"
        }`}
      >
        {/* Display Icon on the left if there is one */}
        {iconSrc && (
          <Image src={iconSrc} alt="SideBar Icon" width={23} height={23} />
        )}

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
        {/* Shop Management */}
        <GroupTitle title="Shop Management" />
        <ul className="space-y-1.5">
          <LI
            href="/admin/dashboard"
            name="Dashboard"
            iconSrc={icons.dashboardIcon96.src}
          />
          <LI
            href="/admin/categories"
            name="Categories"
            iconSrc={icons.categoryIcon96.src}
          />
          <LI
            href="/admin/products"
            name="Products"
            iconSrc={icons.productsIcon96.src}
          />
          <LI
            href="/admin/orders"
            name="Orders"
            iconSrc={icons.ordersIcon96.src}
          />
          <LI
            href="/admin/customize/sales"
            name="Flash Sales"
            iconSrc={icons.flashSaleIcon96.src}
          />
          <LI
            href="/admin/users"
            name="Users"
            iconSrc={icons.customerInsightsIcon96.src}
          />
        </ul>

        {/* Group 2 */}
        <GroupTitle title="Customize Shop" mt />
        <ul className="space-y-1.5">
          {/* <LI href="#" name="Banner" iconSrc={icons.bannerIcon96.src} /> */}
          <LI
            href="/admin/customize/slider"
            name="Image Carousel"
            iconSrc={icons.carouselImageIcon96.src}
          />
          <LI
            href="/admin/customize/features"
            name="Trust Badges"
            iconSrc={icons.trustBadgeIcon96.src}
          />
        </ul>

        {/* Analytics & Reports */}
        <GroupTitle title="Analytics" mt />
        <ul className="space-y-1.5">
          <LI
            href="/admin/analytics"
            name="Sales Reports"
            iconSrc={icons.analyticsIcon96.src}
          />
          <LI
            href="/admin/products-statistics"
            name="Products Statistics"
            iconSrc={icons.statisticsIcon96.src}
          />
        </ul>

        {/* System */}
        <GroupTitle title="System" mt />
        <ul className="space-y-1.5">
          <LI
            href="/admin/staff"
            name="Staff Accounts"
            iconSrc={icons.adminIcon96.src}
          />
          <LI
            href="/profile"
            name="User Settings"
            iconSrc={icons.settingsIcon96.src}
          />
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
