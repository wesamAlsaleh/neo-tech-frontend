import Image from "next/image";
import React, { JSX } from "react";

// Import the icons
import { icons } from "../../public/icons";

interface Props {
  rating: number;
}

export default function RatingStars({ rating }: Props) {
  // Array to store the stars
  const stars: JSX.Element[] = [];

  // Split the rating into integer and decimal parts
  const integerPart = Math.floor(rating);
  const decimalPart = rating - integerPart;

  // Loop 5 times to create 5 stars
  for (let i = 0; i < 5; i++) {
    // If the current index is less than the integer part of the rating, add a full star
    if (i < integerPart) {
      stars.push(
        <Image
          key={i}
          src={icons.fullStar48}
          alt="Full Star"
          width={25}
          height={25}
        />
      );
    } else if (i === integerPart && decimalPart >= 0.25 && decimalPart < 0.75) {
      // If the current index is equal to the integer part and the decimal part is greater than or equal to 0.5, add a half star
      stars.push(
        <Image
          key={i}
          src={icons.halfStar48}
          alt="Half Star"
          width={25}
          height={25}
        />
      );
    } else if (i === integerPart && decimalPart >= 0.75) {
      // If the current index is equal to the integer part and the decimal part is greater than or equal to 0.5, add a half star
      stars.push(
        <Image
          key={i}
          src={icons.fullStar48}
          alt="Full Star"
          width={25}
          height={25}
        />
      );
    } else {
      // Otherwise, add an empty star
      stars.push(
        <Image
          key={i}
          src={icons.grayStar48}
          alt="Empty Star"
          width={25}
          height={25}
        />
      );
    }
  }

  // Return the stars array as JSX elements
  return <div className="flex ">{stars}</div>;
}
