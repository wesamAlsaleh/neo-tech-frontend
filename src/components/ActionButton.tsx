import Link from "next/link";
import React from "react";

interface ActionButtonProps {
  text: string;
  buttonTitle?: string;
  href?: string; // URL for the button link
  className?: string; // Custom CSS classes
  color?: string; // Background color
  textColor?: string; // Text color
  isIconButton?: boolean; // Determines if the button should display an icon
  iconSrc?: string; // Icon source (required if isIconButton is true)
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
}) => {
  // Default button styling
  const defaultClassName =
    "px-4 py-2 bg-primary text-white rounded hover:bg-primary/50 transition duration-300";

  // Apply custom background and text color if provided
  const buttonStyle =
    color || textColor
      ? { backgroundColor: color, color: textColor }
      : undefined;

  // Set the title attribute (for accessibility and tooltips)
  const title = buttonTitle || text;

  // Ensure an icon button has an icon source
  if (isIconButton && !iconSrc) {
    return "Error: You need to provide an iconSrc for the icon button!";
  }

  // Set button content (icon or text)
  const ButtonContent =
    isIconButton && iconSrc ? (
      <img src={iconSrc} alt={title} className="w-6 h-6" />
    ) : (
      text
    );

  // If href is provided, wrap the button inside a Next.js Link
  if (href) {
    return (
      <Link href={href}>
        <button
          className={className || defaultClassName}
          style={buttonStyle}
          title={title}
          aria-label={title}
        >
          {ButtonContent}
        </button>
      </Link>
    );
  } else return "href is required for the ActionButton component!";
};
