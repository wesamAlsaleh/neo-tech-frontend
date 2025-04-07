import { useRouter } from "next/navigation";
import React from "react";

// Breadcrumb component props
interface BreadcrumbProps {
  firstTitle: string;
  firstLink: string;
  firstTitleCN?: string;
  secondTitle?: string;
  secondLink?: string;
  secondTitleCN?: string;
  thirdTitle?: string;
  thirdLink?: string;
  thirdTitleCN?: string;
  fourthTitle?: string;
  fourthLink?: string;
  fourthTitleCN?: string;
  fifthTitle?: string;
  fifthLink?: string;
  fifthTitleCN?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  firstTitle,
  firstLink,
  firstTitleCN: firstTitleColor,
  secondTitle,
  secondLink,
  secondTitleCN: secondTitleColor,
  thirdTitle,
  thirdLink,
  thirdTitleCN: thirdTitleColor,
  fourthTitle,
  fourthLink,
  fourthTitleCN: fourthTitleColor,
  fifthTitle,
  fifthLink,
  fifthTitleCN: fifthTitleColor,
}) => {
  const router = useRouter();

  // Function to create breadcrumb items dynamically
  const createBreadcrumbItem = (
    title: string,
    link: string,
    customColor?: string
  ) => (
    <span
      className={`cursor-pointer hover:text-orange-500 ${
        customColor && `${customColor}`
      }`}
      onClick={() => router.push(link)}
    >
      {title}
    </span>
  );

  return (
    <div className="flex items-center mb-8 mt-2 text-base text-gray-500">
      {/* Go back button */}
      {/* <button
        onClick={() => router.back()}
        className="flex items-center font-bold mr-2 border border-gray-200 px-3 py-1 rounded-md hover:bg-gray-100"
      >
        Back{" "}
      </button> */}

      {/* First link */}
      {createBreadcrumbItem("Home", "/home")}

      {firstTitle && (
        <>
          <span className="mx-2">/</span>
          {createBreadcrumbItem(
            firstTitle,
            firstLink || "/",
            firstTitleColor || undefined
          )}
        </>
      )}

      {secondTitle && (
        <>
          <span className="mx-2">/</span>
          {createBreadcrumbItem(
            secondTitle,
            secondLink || "/",
            secondTitleColor || undefined
          )}
        </>
      )}

      {thirdTitle && (
        <>
          <span className="mx-2">/</span>
          {createBreadcrumbItem(
            thirdTitle,
            thirdLink || "/",
            thirdTitleColor || undefined
          )}
        </>
      )}

      {fourthTitle && (
        <>
          <span className="mx-2">/</span>
          {createBreadcrumbItem(
            fourthTitle,
            fourthLink || "/",
            fourthTitleColor || undefined
          )}
        </>
      )}

      {fifthTitle && (
        <>
          <span className="mx-2">/</span>
          {createBreadcrumbItem(
            fifthTitle,
            fifthLink || "/",
            fifthTitleColor || undefined
          )}
        </>
      )}
    </div>
  );
};

export default Breadcrumb;
