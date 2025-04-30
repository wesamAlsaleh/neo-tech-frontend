import React from "react";

type BadgeProps = {
  text: string;
  conditionA: boolean;
  conditionB?: boolean;
  conditionC?: boolean;
  conditionD?: boolean;
  colorA: string;
  colorB?: string;
  colorC?: string;
  colorD?: string;
  backgroundColor?: string;
  size?: "small" | "medium" | "large";
  icon?: React.ReactNode;
};

export default function Badge(props: BadgeProps) {
  // Destructure all props
  const {
    text,
    conditionA,
    conditionB,
    conditionC,
    conditionD,
    colorA,
    colorB = "gray",
    colorC = "gray",
    colorD = "gray",
    backgroundColor,
    size = "medium",
    icon,
  } = props;

  // Size classes
  const sizeClasses = {
    small: "px-2 py-0.5 text-xs",
    medium: "px-3 py-1 text-sm",
    large: "px-4 py-1.5 text-base",
  };

  // Determine which color to use based on conditions
  let activeColor = "gray"; // Default fallback

  if (conditionA) activeColor = colorA;
  else if (conditionB) activeColor = colorB;
  else if (conditionC) activeColor = colorC;
  else if (conditionD) activeColor = colorD;

  // Safely construct Tailwind classes
  const badgeClasses = [
    "inline-flex items-center rounded-md border capitalize",
    sizeClasses[size],
    backgroundColor || `bg-${activeColor}-100`,
    `text-${activeColor}-700`,
    `border-${activeColor}-400`,
  ].join(" ");

  return (
    <span className={badgeClasses}>
      {icon && <span className="mr-1.5">{icon}</span>}
      {text}
    </span>
  );
}
