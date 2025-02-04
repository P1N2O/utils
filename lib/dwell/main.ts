// Copyright (c) 2025 Manuel Pinto
// This code is licensed under MIT license (see LICENSE for details)

/**
 * ⚠️ DO NOT USE THIS MODULE UNLESS YOU KNOW WHAT IT IS!
 *
 * @example Usage
 * ```ts ignore
 * import { sortArray, getPreviewData } from "@p1n2o/utils/dwell";
 *
 * const arr = [...]
 * console.log(sortArray(arr, "name", "asc"))
 * console.log(getPreviewData(arr, "name", "asc"))
 * ```
 * @module
 */

/**
 * Sort an array by a given key.
 *
 * @param array The array to sort.
 * @param key The key to sort by.
 * @param order The order of the sort ("asc" or "des").
 * @returns {Array<T>} Returns the sorted array.
 *
 * @example Usage
 * ```ts ignore
 * import { sortArray } from "@p1n2o/utils/dwell";
 *
 * const arr = [...]
 * console.log(sortArray(arr, "name", "asc"))
 * ```
 */
function sortArray<T>(
  array: Array<T>,
  key: keyof T,
  order: "asc" | "des" = "asc",
): Array<T> {
  return array.sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    if (valueA === valueB) return 0;

    return (valueA < valueB ? -1 : 1) * (order ? 1 : -1);
  });
}

/**
 * Get preview data from an array.
 *
 * @param array The array to get preview data from.
 * @param key The key to sort preview data by.
 * @param order The order of the sort ("asc" or "des").
 * @returns {Array<T>} Returns the preview data array.
 *
 * @example Usage
 * ```ts ignore
 * import { getPreviewData } from "@p1n2o/utils/dwell";
 *
 * const arr = [...]
 * console.log(getPreviewData(arr, "name", "asc"))
 * ```
 */
function getPreviewData<T>(
  array: Array<T>,
  key: keyof T,
  order: "asc" | "des" = "asc",
): Array<T> {
  // First, sort the array based on the key as you did in sortArray
  const sortedArray = sortArray(array, key, order);

  // Filter out items with "None" in the position ke
  const filteredArray = sortedArray.filter((item: any) =>
    !!item[key] && item[key] !== "None"
  );

  // Extract the positions of the filtered items
  const positions = filteredArray.map((item: any) => parseInt(item[key], 10));
  const isNumberType = typeof filteredArray[0]?.[key] === "number";

  // Create the final result array
  const result: Array<T> = [];
  let currentPosition = 1; // Start from position 1

  for (let i = 0; i < positions.length; i++) {
    // Add missing positions
    while (currentPosition < positions[i]) {
      result.push(
        {
          [key]: isNumberType ? currentPosition : currentPosition.toString(),
        } as T,
      );
      currentPosition++;
    }

    // Add the actual item at its position
    result.push(filteredArray[i]);
    currentPosition++;
  }

  // Handle any missing positions after the last item
  const maxPosition = Math.max(...positions);
  while (currentPosition <= maxPosition) {
    result.push({ [key]: currentPosition.toString() } as T);
    currentPosition++;
  }

  return result;
}

export { getPreviewData, sortArray };
