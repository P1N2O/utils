// Copyright (c) 2025 Manuel Pinto
// This code is licensed under MIT license (see LICENSE for details)

/**
 * This module contains utility functions related to {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent | user agent}.
 *
 *  * @example Usage
 * ```ts ignore
 * import { parse, random } from "@p1n2o/utils/user-agent";
 *
 * console.log(parse(random))
 * // Outputs:
 * // {
 * //   browser: { name: "Chrome", version: "58.0.3029.110", version_major: 58 },
 * //   device: { brand: null, model: null, name: "Other" },
 * //   os: { name: "Windows NT", version: "10.0", version_major: 10 },
 * //   type: {
 * //     bot: false,
 * //     mobile: false,
 * //     pc: true,
 * //     tablet: false,
 * //     touch_capable: false
 * //   },
 * //   ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
 * // }
 * ```
 * @module
 */

/**
 * User Agent Info
 */
type UserAgentInfo = {
  browser: {
    name: string | null;
    version: string | null;
    version_major: number | null;
  };
  device: {
    brand: string | null;
    model: string | null;
    name: string | null;
  };
  os: {
    name: string | null;
    version: string | null;
    version_major: number | null;
  };
  type: {
    bot: boolean;
    mobile: boolean;
    pc: boolean;
    tablet: boolean;
    touch_capable: boolean;
  };
  ua: string;
};

/**
 * Parse a user agent string into {@link UserAgentInfo}.
 *
 * @param userAgent The user agent (string) value to parse.
 * @returns {UserAgentInfo} Returns the parsed user agent object (UserAgentInfo).
 *
 * @example Usage
 * ```ts ignore
 * import { parse } from "@p1n2o/utils/user-agent";
 *
 * const ua = parse("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36")
 * console.log(ua)
 * // Outputs:
 * // {
 * //   browser: { name: "Chrome", version: "58.0.3029.110", version_major: 58 },
 * //   device: { brand: null, model: null, name: "Other" },
 * //   os: { name: "Windows NT", version: "10.0", version_major: 10 },
 * //   type: {
 * //     bot: false,
 * //     mobile: false,
 * //     pc: true,
 * //     tablet: false,
 * //     touch_capable: false
 * //   },
 * //   ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
 * // }
 * ```
 */
function parseUserAgent(userAgent: string): UserAgentInfo {
  const browserRegex =
    /(Chrome|Firefox|Safari|Opera|Edge|MSIE|Trident)\/([\d.]+)/;
  const osRegex = /(Windows NT|Mac OS X|Android|Linux|iOS)\s*([\d._]*)/;
  const deviceRegex = /(Mobile|Tablet)/;

  const browserMatch = userAgent.match(browserRegex);
  const osMatch = userAgent.match(osRegex);
  const deviceMatch = userAgent.match(deviceRegex);

  let browserName = browserMatch ? browserMatch[1] : null;
  const browserVersion = browserMatch ? browserMatch[2] : null;
  const browserMajor = browserVersion
    ? parseInt(browserVersion.split(".")[0], 10)
    : null;

  if (browserName === "Trident" || browserName === "MSIE") {
    browserName = "Internet Explorer";
  }

  const osName = osMatch ? osMatch[1].replace(/_/g, ".") : null;
  const osVersion = osMatch ? osMatch[2] : null;
  const osMajor = osVersion ? parseInt(osVersion.split(".")[0], 10) : null;

  return {
    browser: {
      name: browserName,
      version: browserVersion,
      version_major: browserMajor,
    },
    device: {
      brand: null,
      model: null,
      name: deviceMatch ? deviceMatch[1] : "Other",
    },
    os: {
      name: osName,
      version: osVersion,
      version_major: osMajor,
    },
    type: {
      bot: /bot|spider|crawl/i.test(userAgent),
      mobile: /Mobile/i.test(userAgent),
      pc: !/Mobile|Tablet/i.test(userAgent),
      tablet: /Tablet/i.test(userAgent),
      touch_capable: /Touch/i.test(userAgent),
    },
    ua: userAgent,
  };
}

/**
 * Generate a random user agent.
 * @returns {string} Returns a random user agent string.
 *
 * @example Usage
 * ```ts ignore
 * import { random } from "@p1n2o/utils/user-agent";
 *
 * console.log(random())
 * // Outputs:
 * // {
 * //   browser: { name: "Chrome", version: "58.0.3029.110", version_major: 58 },
 * //   device: { brand: null, model: null, name: "Other" },
 * //   os: { name: "Windows NT", version: "10.0", version_major: 10 },
 * //   type: {
 * //     bot: false,
 * //     mobile: false,
 * //     pc: true,
 * //     tablet: false,
 * //     touch_capable: false
 * //   },
 * //   ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
 * // }
 * ```
 */
function randomUserAgent(): string {
  return navigator.userAgent;
}

export {
  parseUserAgent as parse,
  randomUserAgent as random,
  type UserAgentInfo,
};
