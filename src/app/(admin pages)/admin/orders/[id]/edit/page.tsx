"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";

// import custom components
import Button from "@/components/Button";
import PageTitle from "@/components/PageTitle";
import EditOrderForm from "@/components/EditOrderForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default function page({ params }: Props) {
  // Get the order ID from the URL parameters then extract the order ID from the promise
  const resolvedParams = use(params); // the use hook resolves the promise
  const { id } = resolvedParams;

  // Initialize the router for navigation
  const router = useRouter();

  return (
    <>
      <PageTitle
        title={`Edit Order #${id}`}
        subtitle="Update order status, payment method, or items."
        actionButton={
          <Button iconSize={21} text="Back" onClick={() => router.back()} />
        }
      />

      {/* form */}
      <EditOrderForm orderId={id} />
    </>
  );
}
