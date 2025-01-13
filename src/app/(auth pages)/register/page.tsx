// import custom components
import RegisterForm from "@/components/RegisterForm";

export default function Page() {
  return (
    <div className="flex flex-col items-center mt-8">
      {/* page title */}
      <h1 className="font-bold text-4xl mb-4 text-primary">Register Page</h1>

      {/* registration form */}
      <RegisterForm />
    </div>
  );
}
