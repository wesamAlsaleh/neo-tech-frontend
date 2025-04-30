"use client";

import React from "react";

// import components
import PageTitle from "@/components/PageTitle";
import AddImageSliderForm from "@/components/AddImageSliderForm";
import Button from "@/components/Button";

export default function page() {
  return (
    <>
      <PageTitle
        title="Add Slider Image"
        subtitle="Add a new image to the slider"
        highlightText="The recommended image size is  1280x576 pixels"
        actionButton={
          <Button text="Back" onClick={() => window.history.back()} />
        }
      />

      {/* Form */}
      <AddImageSliderForm />
    </>
  );
}
