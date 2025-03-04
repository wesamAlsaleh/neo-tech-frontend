import React from "react";

// import custom components
import HomeComponentTitle from "./HomeComponentTitle";

export default function AdBannerSection() {
  return (
    <div className="my-4">
      {/* black Banner */}
      <div className="bg-black text-white p-4">
        <p className="text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at
          dolor nec purus auctor fringilla. Integer nec ex auctor, fermentum
          eros nec, ultricies nunc.{" "}
        </p>
      </div>
    </div>
  );
}
