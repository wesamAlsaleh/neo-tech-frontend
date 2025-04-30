"use client";

import React from "react";

// import custom components
import { ActionButton } from "@/components/ActionButton";
import AddFlashSaleForm from "@/components/AddFlashSaleForm";
import PageTitle from "@/components/PageTitle";
import Button from "@/components/Button";

export default function page() {
  return (
    <>
      <PageTitle
        title="Create Flash Sale"
        subtitle="Here you can create a new flash sale"
        actionButton={
          <Button
            text="Back"
            onClick={() => {
              window.history.back();
            }}
          />
        }
      />

      {/* Form */}
      <AddFlashSaleForm />
    </>
  );
}
