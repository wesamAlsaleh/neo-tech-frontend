"use client";
import React from "react";

// import custom components
import CategoryList from "@/components/CategoriesList";
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function ManageCategoriesPage() {
  // Router Instance
  const router = useRouter();

  return (
    <>
      <PageTitle
        title="Categories"
        subtitle="Manage NeoTech categories"
        actionButton={
          <Button
            text="Add Category"
            onClick={() => {
              router.push("/admin/categories/create-category");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        }
      />

      <CategoryList />
    </>
  );
}
