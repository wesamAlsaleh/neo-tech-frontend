"use client";

import React, { useState, useEffect } from "react";

// Importing types
import { Category } from "@/types/category";

interface CategoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
}

export default function EditModalComponent({
  isOpen,
  onClose,
  category,
}: CategoryEditModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Edit Category: {category?.category_name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>
        <p>Modal Content</p>
      </div>
    </div>
  );
}
