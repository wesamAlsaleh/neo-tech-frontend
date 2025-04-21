"use client";

import React, { useEffect, useState } from "react";

/**
 * Custom React hook that debounces a given value by a specified delay.
 *
 * This hook is useful for scenarios where you want to limit the rate at which
 * a value is updated, such as handling user input or API calls.
 *
 * @param value - The input value to debounce.
 * @param delay - The debounce delay in milliseconds.
 * @returns The debounced value, which updates only after the specified delay.
 *
 * @remarks This hook will make the requested API call only after the user has stopped typing for the specified delay.
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     // Perform API call or other actions with the debounced value
 *     console.log('Debounced value:', debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 * ```
 */
export function useDebounce(value: string, delay: number) {
  // Enter Value -> wait (milliseconds before returning the value) --> return the value after the delay

  // State to store the debounced value eg: the value that will be used to make the API call
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Set a timeout to update the debounced value after the specified delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
