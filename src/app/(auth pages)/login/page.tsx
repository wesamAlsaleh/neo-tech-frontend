// import custom components
import LoginForm from "@/components/LoginForm";

export default function registerPage() {
  return (
    <div className="flex flex-col items-center mt-8">
      {/* page title */}
      <h1 className="font-bold text-4xl mb-4 text-primary">Login Page</h1>

      {/* registration form */}
      <LoginForm />
    </div>
  );
}
