import Image from "next/image";
import React from "react";

// button interface
interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  darkMode?: boolean;
  buttonClassName?: string;
  iconSize?: number;
  iconClassName?: string;
  iconSrc?: string;
  text?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  onClick,
  disabled = false,
  darkMode = false,
  buttonClassName = "",
  iconClassName = "",
  iconSize = 20,
  iconSrc = "",
  text = "",
  type = "button",
}: ButtonProps) {
  return (
    <button
      className={` rounded-md border border-gray-300 border-input bg-transparent hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        text ? "px-3 py-2" : "p-2 "
      } ${disabled && "opacity-50 cursor-not-allowed"} ${buttonClassName} `}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {/* Button Icon */}
      {iconSrc && (
        <Image
          src={iconSrc}
          alt="button icon"
          width={iconSize}
          height={iconSize}
          className={`${text ? "mr-2" : ""} ${iconClassName}`}
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
      )}

      {/* Button Text */}
      {text && (
        <span
          className={`${darkMode ? "text-gray-500" : "text-black"} font-medium`}
        >
          {text}
        </span>
      )}
    </button>
  );
}
