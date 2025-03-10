import Link from "next/link";
import React from "react";

interface ActionButtonProps {
  text: string;
  buttonTitle?: string;
  href: string;
  className?: string;
  color?: string;
  textColor?: string;
  isIconButton?: boolean;
  iconSrc?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  buttonTitle,
  href,
  className,
  color,
  textColor,
  isIconButton,
  iconSrc,
}: ActionButtonProps) => {
  const defaultClassName =
    "px-4 py-2 bg-primary text-white rounded hover:bg-primary/50 transition duration-300";

  const buttonStyle = {
    backgroundColor: color,
    color: textColor,
  };

  if (isIconButton && iconSrc) {
    return (
      <Link href={href}>
        <button
          // If the icon button class is provided use it, otherwise use the default class
          className={className || defaultClassName}
          // If the icon button color is provided, use it, otherwise use the text color and button color
          style={color || textColor ? buttonStyle : undefined}
          title={buttonTitle || text}
          aria-label={buttonTitle || text}
          about="Restore deleted products"
        >
          <img src={iconSrc} alt={buttonTitle || text} className="w-6 h-6" />
        </button>
      </Link>
    );
  } else if (isIconButton && !iconSrc) {
    return <p>"Icon source is required for icon button."</p>;
  }

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
