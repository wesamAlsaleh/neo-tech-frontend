"use client";

import React from "react";

export default function TableStatusColumn({
  condition,
  onYes,
  onNo,
}: {
  condition: boolean;
  onYes: string;
  onNo: string;
}) {
  return condition ? (
    <span className="text-green-600 bg-green-100 px-2 py-1 rounded-md font-bold">
      {onYes}
    </span>
  ) : (
    <span className="text-red-600 bg-red-100 px-2 py-1 rounded-md font-bold">
      {onNo}
    </span>
  );
}
