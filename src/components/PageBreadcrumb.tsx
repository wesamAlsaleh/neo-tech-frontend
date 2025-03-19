import { useRouter } from "next/navigation";
import React from "react";

// Breadcrumb component props
interface BreadcrumbProps {
  firstTitle: string;
  firstLink: string;
  secondTitle?: string;
  secondLink?: string;
  thirdTitle?: string;
  thirdLink?: string;
  fourthTitle?: string;
  fourthLink?: string;
  fifthTitle?: string;
  fifthLink?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  firstTitle,
  firstLink,
  secondTitle,
  secondLink,
  thirdTitle,
  thirdLink,
  fourthTitle,
  fourthLink,
  fifthTitle,
  fifthLink,
}) => {
  const router = useRouter();

  // Function to create breadcrumb items dynamically
  const createBreadcrumbItem = (title: string, link: string) => (
    <span
      className="cursor-pointer hover:text-orange-500"
      onClick={() => router.push(link)}
    >
      {title}
    </span>
  );

  return (
    <div className="flex items-center my-4 text-sm">
      {/* Go back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center font-bold mr-2 border border-gray-200 px-3 py-1 rounded-md hover:bg-gray-100"
      >
        Back{" "}
      </button>

      {/* First link */}
      {createBreadcrumbItem("Home", "/home")}

      {firstTitle && (
        <>
          <span className="mx-2">/</span>
          {createBreadcrumbItem(firstTitle, firstLink || "/")}
        </>
      )}

      {secondTitle && (
        <>
          <span className="mx-2">/</span>
          {createBreadcrumbItem(secondTitle, secondLink || "/")}
        </>
      )}

      {thirdTitle && (
        <>
          <span className="mx-2">/</span>
          {createBreadcrumbItem(thirdTitle, thirdLink || "/")}
        </>
      )}

      {fourthTitle && (
        <>
          <span className="mx-2">/</span>
          {createBreadcrumbItem(fourthTitle, fourthLink || "/")}
        </>
      )}

      {fifthTitle && (
        <>
          <span className="mx-2">/</span>
          {createBreadcrumbItem(fifthTitle, fifthLink || "/")}
        </>
      )}
    </div>
  );
};

export default Breadcrumb;
