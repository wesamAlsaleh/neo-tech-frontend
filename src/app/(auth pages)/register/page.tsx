import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div>
      <h1 style={{ color: "blue" }} className="font-bold text-4xl mb-4">
        register page
      </h1>

      <br />

      {/* register form */}

      <button className="bg-green-500 text-white p-1">Register</button>

      <button>
        <Link href={"/login"} className="font-bold">
          <span style={{ color: "green" }}>Have an account? {""}</span>Login
          Here
        </Link>
      </button>

      <br />

      <button>
        <Link href={"/"} className="font-bold text-primary">
          Home
        </Link>
      </button>
    </div>
  );
}
