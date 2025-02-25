import Link from "next/link";
import React from "react";

// Importing icons
import { icons } from "../../public/icons";

interface RecycleButtonProps {
  href: string;
  className?: string;
  color?: string;
  textColor?: string;
}

export const RecycleButton: React.FC<RecycleButtonProps> = ({
  href,
  className,
}: RecycleButtonProps) => {
  const defaultClassName =
    "px-4 py-2 bg-green-500 rounded hover:bg-green-400 transition duration-300";

  return (
    <Link href={href}>
      <button
        className={defaultClassName}
        title="Recycle Bin"
        aria-label="Recycle Bin"
        about="Restore deleted products"
      >
        <img
          src={icons.recycleIcon48.src}
          alt="Recycle Icon"
          className="w-6 h-6"
        />
      </button>
    </Link>
  );
};
