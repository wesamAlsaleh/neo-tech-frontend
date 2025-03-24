import React from "react";

// import components
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";
import AddImageSliderForm from "@/components/AddImageSliderForm";

export default function page() {
  return (
    <>
      <PageTitle
        title="Add Slider Image"
        subtitle="Add a new image to the slider"
        highlightText="The recommended image size is 1920x1080 pixels"
        actionButton={
          <ActionButton
            href="/admin/customize/slider"
            text="Back"
            buttonTitle="Go back to Customize NeoTech Shop"
            color="white"
            textColor="black"
          />
        }
      />

      {/* Form */}
      <AddImageSliderForm />
    </>
  );
}
