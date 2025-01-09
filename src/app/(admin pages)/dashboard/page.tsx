"use client";

import Link from "next/link";
import React from "react";

export default function dashboardPage() {
  return (
    <div>
      <h1 className="text-red-500">dashboard page</h1>
      <br />
      <button>
        <Link href={"/"}> Go to Home page</Link>
      </button>
    </div>
  );
}
