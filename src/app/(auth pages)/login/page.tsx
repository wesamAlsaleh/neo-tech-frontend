import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div>
      <h1>login page</h1>
      <br />
      <button>
        <Link href={"/"}>Home</Link>
      </button>
    </div>
  );
}
