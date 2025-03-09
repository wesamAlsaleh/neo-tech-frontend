import React from "react";

// server response props
interface ServerResponseProps {
  condition: boolean;
  message: string;
}

export default function ServerResponse({
  condition,
  message,
}: ServerResponseProps) {
  // If there is a message, display it
  if (message && condition) {
    return (
      <div
        className={`px-4 py-3 rounded relative mb-4 ${
          condition
            ? "bg-green-100 border border-green-400 text-green-700"
            : "bg-red-100 border border-red-400 text-red-700 "
        }`}
        role="alert"
      >
        {condition ? (
          <strong className="font-bold">Success! </strong>
        ) : (
          <strong className="font-bold">Error! </strong>
        )}
        <span className="block sm:inline">{message}</span>
      </div>
    );
  }

  // Default return
  return null;
}
