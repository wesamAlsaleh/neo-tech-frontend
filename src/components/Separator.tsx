import React, { JSX } from "react";

interface SeparatorProps {
  color?: "border-gray-200" | "border-gray-400" | "border-gray-600"; // Limited color choices
  thickness?: "border-t" | "border-t-2" | "border-t-4"; // Limited thickness choices
  width?: "w-full" | "w-1/2" | "w-1/3"; // Limited width choices
  margin?: "my-2" | "my-4" | "my-6" | "my-8"; // Limited margin choices
  center?: boolean;
}

/**
 * A functional component that renders a horizontal rule (`<hr>`) element with customizable styles.
 *
 * @param {string} [props.color="border-gray-200"] - The color of the separator's border.
 * @param {string} [props.thickness="border-t"] - The thickness of the separator's border.
 * @param {string} [props.width="w-full"] - The width of the separator.
 * @param {string} [props.margin="my-4"] - The margin around the separator.
 * @param {boolean} [props.center=false] - Whether the separator should be centered.
 * @returns {JSX.Element} A styled horizontal rule element.
 */
export default function Separator({
  color = "border-gray-200",
  thickness = "border-t",
  width = "w-full",
  margin = "my-4",
  center = false,
}: SeparatorProps): JSX.Element {
  return (
    <hr
      className={`${thickness} ${color} ${width} ${margin} ${
        center ? "mx-auto block" : ""
      }`}
    />
  );
}
