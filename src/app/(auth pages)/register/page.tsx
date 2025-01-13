import Link from "next/link";

// import custom components
import LoginForm from "@/components/LoginForm";

export default function Page() {
  return (
    <div className="flex flex-col items-center mt-8">
      {/* page title */}
      <h1 className="font-bold text-4xl mb-4 text-primary">Register Page</h1>

      {/* registration form */}
      <LoginForm />

      {/* home page button */}
      <Link href="/">
        <button className="border p-2 font-bold text-red-500 mt-4 shadow-md">
          Cancel and go back
        </button>
      </Link>
    </div>
  );
}
