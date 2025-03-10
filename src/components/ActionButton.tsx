import Link from "next/link";
import React from "react";

interface ActionButtonProps {
  text: string;
  buttonTitle?: string;
  href: string;
  className?: string;
  color?: string;
  textColor?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  buttonTitle,
  href,
  className,
  color,
  textColor,
}: ActionButtonProps) => {
  const defaultClassName =
    "px-4 py-2 bg-primary text-white rounded hover:bg-primary/50 transition duration-300";

  const buttonStyle = {
    backgroundColor: color,
    color: textColor,
  };

  return (
    <Link href={href}>
      <button
        className={className || defaultClassName}
        style={color || textColor ? buttonStyle : undefined}
        title={buttonTitle || text}
        aria-label={buttonTitle || text}
      >
        {text}
      </button>
    </Link>
  );
};
