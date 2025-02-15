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
 * Sort
 */
type Sort = "asc" | "des";

/**
 * User
 */
type User = {
  email: string;
  email_verified: boolean;
  name: string;
  family_name: string;
  given_name: string;
  previous_login: Date | number | string;
  sub: string;
  user_id: string;
  username: string;
};

/**
 * Sort an array by a given key.
 *
 * @param array The array to sort.
 * @param extractor The key (string) or extractor (function) to sort by.
 * @param sort Type of sort to apply ("asc" or "des").
 * @returns {Array<T>} Returns the sorted array.
 *
 * @example Usage
 * ```ts ignore
 * import { sortArray } from "@p1n2o/utils/dwell";
 *
 * const arr = [...];
 * console.log(sortArray(arr, "name", "asc")); // Key
 * console.log(sortArray(arr, "name.value", "asc")); // Key (Nested)
 * console.log(sortArray(arr, (i) => i.name.value, "asc")); // Extractor Function
 * ```
 */
function sortArray<T>(
  array: Array<T>,
  extractor: string | ((item: T) => any),
  sort: Sort = "asc",
): Array<T> {
  return array.sort((a, b) => {
    let valueA = typeof extractor === "function"
      ? extractor(a)
      : getNestedValue(a, extractor);
    let valueB = typeof extractor === "function"
      ? extractor(b)
      : getNestedValue(b, extractor);

    valueA = normalizeValue(valueA, sort);
    valueB = normalizeValue(valueB, sort);

    if (valueA === valueB) return 0;
    return (valueA < valueB ? -1 : 1) * (sort === "asc" ? 1 : -1);
  });
}

/**
 * Get preview data from an array.
 *
 * @param array The array to get preview data from.
 * @param key The key to sort preview data by.
 * @param sort Type of sort to apply ("asc" or "des").
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
  extractor: string | ((item: T) => any),
  sort: Sort = "asc",
): Array<T> {
  // First, sort the array
  const sortedArray = sortArray(array, extractor, sort);

  // Extract and normalize values for filtering
  const filteredArray = sortedArray.filter((item: any) => {
    const value = typeof extractor === "function"
      ? extractor(item)
      : getNestedValue(item, extractor);
    return value !== "None" && value !== null && value !== undefined;
  });

  // Extract the positions of the filtered items
  const positions = filteredArray.map((item: any) => {
    const value = typeof extractor === "function"
      ? extractor(item)
      : getNestedValue(item, extractor);
    return parseInt(value, 10);
  });

  const isNumberType = !isNaN(positions[0]);

  // Create the final result array
  const result: Array<T> = [];
  let currentPosition = 1; // Start from position 1

  for (let i = 0; i < positions.length; i++) {
    // Add missing positions
    while (currentPosition < positions[i]) {
      result.push(
        {
          [extractor as string]: isNumberType
            ? currentPosition
            : currentPosition.toString(),
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
    result.push(
      {
        [extractor as string]: isNumberType
          ? currentPosition
          : currentPosition.toString(),
      } as T,
    );
    currentPosition++;
  }

  return result;
}

/**
 * Deep copy an object
 * @param obj The object to deep copy
 * @returns The deep copied object
 *
 * @example Usage
 * ```ts ignore
 * import { deepCopy } from "@p1n2o/utils/dwell";
 *
 * const obj = { a: 1, b: 2 };
 * const copiedObj = deepCopy(obj);
 * console.log(copiedObj); // Outputs: { a: 1, b: 2 }
 * ```
 */
const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

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
 * Get user info
 * @param serviceUrl The service URL
 * @param token The access token
 * @returns The user info
 *
 * @example Usage
 * ```ts ignore
 * import { userInfo } from "@p1n2o/utils/dwell";
 *
 * userInfo("https://YOUR_SERVICE_URL", "YOUR_ACCESS_TOKEN").then((user) => {
 *   console.log(user);
 * });
 * // or
 * const user = await userInfo("https://YOUR_SERVICE_URL", "YOUR_ACCESS_TOKEN");
 * console.log(user);
 * ```
 */
const userInfo = async (serviceUrl: string, token?: string): Promise<User> => {
  const api = `${serviceUrl}/userinfo`;
  try {
    const res = await fetch(api, {
      headers: {
        Authorization: `Bearer ${
          token || localStorage.getItem("access_token")
        }`,
      },
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP error ${res.status}: ${errorText}`);
    }
    return await res.json();
  } catch (e) {
    console.error(e);
    return await Promise.reject(e);
  }
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

// Get Nested Value - Helper Function
function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

// Normalize Value - Helper Function
function normalizeValue(value: any, sort: Sort = "asc"): number {
  if (value === "None" || value === null || value === undefined) {
    return sort === "asc" ? Infinity : -Infinity;
  }
  if (!isNaN(value)) return Number(value); // Convert numeric strings to numbers
  return value; // Return as-is for string comparison
}

export {
  accessToken,
  auth,
  deepCopy,
  getFragment,
  getPreviewData,
  login,
  logout,
  parseToken,
  type Sort,
  sortArray,
  type User,
  userInfo,
};
