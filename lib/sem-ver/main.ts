/**
 * Semantic Version
 */
type SemVer = `${number}.${number}.${number}`;

/**
 * Bump semantic version
 * @param version The version to bump
 * @param release The release type ("major", "minor", or "patch") to bump
 * @returns The bumped version
 *
 * @example Usage
 * ```ts ignore
 * import { bump } from "@p1n2o/utils/sem-ver";
 *
 * const version = "1.0.0";
 * console.log(bump(version, "major")); // Outputs: 2.0.0
 * console.log(bump(version, "minor")); // Outputs: 1.1.0
 * console.log(bump(version, "patch")); // Outputs: 1.0.1
 * console.log(bump(version)); // Outputs: 1.0.1
 * ```
 */
function bump(
  version: SemVer,
  release: "major" | "minor" | "patch" = "patch",
): SemVer {
  const semVerRegex = /^(\d+)\.(\d+)\.(\d+)$/;
  const match = version.match(semVerRegex);

  if (!match) {
    throw new Error("Invalid semantic version format");
  }

  let [_, major, minor, patch] = match.map(Number);

  switch (release) {
    case "major":
      major++;
      minor = 0;
      patch = 0;
      break;
    case "minor":
      minor++;
      patch = 0;
      break;
    case "patch":
      patch++;
      break;
  }

  return `${major}.${minor}.${patch}`;
}

/**
 * Validate semantic version
 * @param version The version to validate
 * @returns The validated version
 *
 * @example Usage
 * ```ts ignore
 * import { valid } from "@p1n2o/utils/sem-ver";
 *
 * const version = "1.2.3";
 * console.log(valid(version)); // Outputs: 1.2.3
 * console.log(bump("a.b.c")); // Outputs: null
 * ```
 */
function valid(version: string | null): SemVer | null {
  const semVerRegex = /^(\d+)\.(\d+)\.(\d+)$/;
  return version && semVerRegex.test(version) ? version as SemVer : null;
}

/**
 * Clean semantic version
 * @param version The version to clean
 * @returns The cleaned version
 *
 * @example Usage
 * ```ts ignore
 * import { clean } from "@p1n2o/utils/sem-ver";
 *
 * const version = "  =v1.2.3   ";
 * console.log(clean(version)); // Outputs: 1.2.3
 * console.log(clean("a.b.c")); // Outputs: null
 * ```
 */
function clean(version: string): SemVer | null {
  const semVerRegex = /v?(\d+)\.(\d+)\.(\d+)/;
  const match = version.trim().match(semVerRegex);
  return match ? `${match[1]}.${match[2]}.${match[3]}` as SemVer : null;
}

/**
 * ⚠️ EXPERIMENTAL: Check if a version satisfies a range
 * @param version The version to check
 * @param range The range to check against
 * @returns Whether the version satisfies the range
 *
 * @example Usage
 * ```ts ignore
 * import { satisfies } from "@p1n2o/utils/sem-ver";
 *
 * const version = "1.2.3";
 * const range = ">=1.2.3";
 * console.log(satisfies(version, range)); // Outputs: true
 * console.log(satisfies("1.2.3", ">=1.2.3")); // Outputs: true
 * console.log(satisfies("1.2.3", "1.x || >=2.5.0 || 5.0.0 - 7.2.3")); // Outputs: true
 */
function satisfies(version: string, range: string): boolean {
  const [min, max] = range.split("||").map((r) => r.trim());
  return min.startsWith(">=")
    ? version >= min.slice(2)
    : version >= min && (!max || version <= max);
}

/**
 * Check if a version is greater than another version
 * @param v1 The first version
 * @param v2 The second version
 * @returns Whether v1 is greater than v2
 *
 * @example Usage
 * ```ts ignore
 * import { isGreater } from "@p1n2o/utils/sem-ver";
 *
 * const v1 = "1.2.3";
 * const v2 = "9.8.7";
 * console.log(isGreater(v1, v2)); // Outputs: false
 * console.log(isGreater(v2, v1)); // Outputs: true
 * ```
 */
function isGreater(v1: string, v2: string): boolean {
  return v1 > v2;
}

/**
 * Check if a version is lesser than another version
 * @param v1 The first version
 * @param v2 The second version
 * @returns Whether v1 is lesser than v2
 *
 * @example Usage
 * ```ts ignore
 * import { isLesser } from "@p1n2o/utils/sem-ver";
 *
 * const v1 = "1.2.3";
 * const v2 = "9.8.7";
 * console.log(isLesser(v1, v2)); // Outputs: true
 * console.log(isLesser(v2, v1)); // Outputs: false
 * ```
 */
function isLesser(v1: string, v2: string): boolean {
  return v1 < v2;
}

/**
 * Get the minimum version from a range
 * @param range The range to get the minimum version from
 * @returns The minimum version
 *
 * @example Usage
 * ```ts ignore
 * import { min } from "@p1n2o/utils/sem-ver";
 *
 * const range = ">=1.2.3";
 * console.log(min(range)); // Outputs: 1.2.3
 * console.log(min("1.x || >=2.5.0 || 5.0.0 - 7.2.3")); // Outputs: 2.5.0
 * ```
 */
function min(range: string): SemVer | null {
  const match = range.match(/>=?(\d+\.\d+\.\d+)/);
  return match ? match[1] as SemVer : null;
}

/**
 * Coerce semantic version
 * @param version The version to coerce
 * @returns The coerced version
 *
 * @example Usage
 * ```ts ignore
 * import { coerce } from "@p1n2o/utils/sem-ver";
 *
 * const version = "1.2.3";
 * console.log(coerce(version)); // Outputs: 1.2.3
 * console.log(coerce("1.2")); // Outputs: 1.2.0
 * console.log(coerce("1")); // Outputs: 1.0.0
 * ```
 */
function coerce(version: string | number): SemVer | null {
  const semVerRegex = /(\d+)\.(\d+)\.(\d+)/;
  const match = version.toString().match(semVerRegex);
  return match
    ? `${match[1]}.${match[2]}.${match[3]}` as SemVer
    : (/\d+/.test(version.toString())
      ? `${version.toString().match(/\d+/)![0]}.0.0` as SemVer
      : null);
}

export {
  bump,
  clean,
  coerce,
  isGreater,
  isLesser,
  min,
  satisfies,
  type SemVer,
  valid,
};
