import React from "react";

export default function ProductPage({ params }: { params: { slug: string } }) {
  // The slug is available in params.slug
  return <div>Product: {params.slug}</div>;
}
