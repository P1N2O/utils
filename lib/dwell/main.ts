// Copyright (c) 2025 Manuel Pinto
// This code is licensed under MIT license (see LICENSE for details)

/**
 * ⚠️ DO NOT USE THIS MODULE UNLESS YOU KNOW WHAT IT IS!
 *
 * @example Usage
 * ```ts ignore
 * import { sortArray, getPreviewData } from "@p1n2o/utils/dwell";
 *
 * const arr = [...];
 * console.log(sortArray(arr, "name", "asc"));
 * console.log(getPreviewData(arr, "name", "asc"));
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
 * const arr = [...];
 * console.log(sortArray(arr, "name", "asc"));
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
 * const arr = [...];
 * console.log(getPreviewData(arr, "name", "asc"));
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

/**
 * Handle login
 * @param param Login option parameters
 *
 * @example Usage
 * ```ts ignore
 * import { login } from "@p1n2o/utils/dwell";
 *
 * login({
 *   clientId: "YOUR_CLIENT_ID",
 *   serviceUrl: "https://YOUR_SERVICE_URL",
 *   redirectUrl: "https://YOUR_REDIRECT_URL",
 *   callbackFn: () => {
 *     // Your callback function
 *   },
 * });
 * ```
 */
const login = ({ clientId, serviceUrl, redirectUrl, callbackFn }: {
  clientId: string;
  serviceUrl: string;
  redirectUrl?: string;
  callbackFn?: () => void;
}): void => {
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "token+id_token",
    redirect_uri: redirectUrl ?? globalThis.location.href,
  });
  globalThis.location.href =
    `${serviceUrl}/oauth/authorize?${params.toString()}`;
  if (callbackFn) callbackFn();
};

/**
 * Get fragment value from URL
 * @param key The fragment key
 * @returns The fragment string
 *
 * @example Usage
 * ```ts ignore
 * import { getFragment } from "@p1n2o/utils/dwell";
 * console.log(getFragment("access_token"));
 * ```
 */
const getFragment = (key?: string): string | null => {
  const url = new URL(globalThis.location.href);
  const fragment = new URLSearchParams(url.hash.slice(1)); // Removes the '#' character
  return fragment.get(key || "access_token") || null;
};

/**
 * Handle logout
 * @param param Logout option parameters
 *
 * @example Usage
 * ```ts ignore
 * import { logout } from "@p1n2o/utils/dwell";
 *
 * logout({
 *   clientId: "YOUR_CLIENT_ID",
 *   serviceUrl: "https://YOUR_SERVICE_URL",
 *   redirectUrl: "https://YOUR_REDIRECT_URL",
 *   callbackFn: () => {
 *     // Your callback function
 *   },
 * });
 * ```
 */
const logout = ({
  clientId,
  serviceUrl,
  redirectUrl,
  callbackFn,
}: {
  clientId: string;
  serviceUrl: string;
  redirectUrl?: string;
  callbackFn?: () => any;
}): void => {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUrl ?? globalThis.location.href,
  });
  globalThis.location.href = `${serviceUrl}/logout.do?${params.toString()}`;
  if (callbackFn) callbackFn();
};

/**
 * Handle authentication
 * @param param Authentication callbacks
 * @returns {Promise<void>} A promise that resolves when authentication is complete
 *
 * @example Usage
 * ```ts ignore
 * import { auth } from "@p1n2o/utils/dwell";
 *
 * auth({
 *   onAuth: () => {
 *     // Your callback function
 *   },
 *   onUnauth: () => {
 *     // Your callback function
 *   },
 *   afterAuth: () => {
 *     // Your callback function
 *   },
 * });
 * ```
 */
const auth = ({
  onAuth,
  onUnauth,
  afterAuth,
}: {
  onAuth?: () => any;
  onUnauth?: () => any;
  afterAuth?: () => any;
}): any => {
  return new Promise<void>((resolve, reject) => {
    const processAuth = async () => {
      try {
        if (globalThis.location.href.includes("access_token")) {
          await (afterAuth ? afterAuth() : defaultAfterAuth());
        }
        if (!sessionExpired()) {
          if (onAuth) await onAuth();
          resolve();
        } else {
          onUnauth ? await onUnauth() : reject(new Error("Session expired"));
        }
      } catch (error) {
        console.error("Authentication Error: ", error);
        reject(error);
      }
    };

    processAuth();
  });
};

const defaultAfterAuth = (): any => {
  console.log("Default after auth");
  try {
    // Set access token
    localStorage.setItem("access_token", getFragment() as string);
    // Cleanup URL
    const w = globalThis as any;
    w.history.replaceState(null, "", w.location.href.split("#")[0]);
  } catch (error) {
    console.error(error);
  }
};

const sessionExpired = (): boolean =>
  !localStorage.getItem("access_token") ||
  parseToken(localStorage.getItem("access_token") || "")?.exp <=
    Date.now() / 1000;

/**
 * Parse token
 * @param token Token to parse
 * @returns The parsed token
 *
 * @example Usage
 * ```ts ignore
 * import { parseToken } from "@p1n2o/utils/dwell";
 *
 * console.log(parseToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"));
 * ```
 */
const parseToken = (token: string): any => {
  return JSON.parse(atob(token.split(".")[1]));
};

/**
 * Get access token
 * @param key The access token key
 * @returns The access token
 *
 * @example Usage
 * ```ts ignore
 * import { accessToken } from "@p1n2o/utils/dwell";
 *
 * console.log(accessToken());
 * ```
 */
const accessToken = (key?: string): any => {
  return parseToken(localStorage.getItem(key || "access_token") || "");
};

export {
  accessToken,
  auth,
  getFragment,
  getPreviewData,
  login,
  logout,
  parseToken,
  sortArray,
};
