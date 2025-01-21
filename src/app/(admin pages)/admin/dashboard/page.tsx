"use client";

import Link from "next/link";
import React from "react";

export default function dashboardPage() {
  return (
    <div>
      {/* page title  */}
      <h1 className="text-red-500">dashboard page</h1>

      <Link href={"/"}>
        <button>Go to Home page</button>
      </Link>
    </div>
  );
}
