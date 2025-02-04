/**
 * Bump semantic version
 * @param version The version to bump
 * @param release The release type ("major", "minor", or "patch") to bump
 * @returns The bumped version
 *
 * @example Usage
 * ```ts ignore
 * import { bumpSemver } from "@p1n2o/utils";
 *
 * const version = 1.0.0
 * console.log(bumpSemver(version, "major")) // Outputs: 2.0.0
 * console.log(bumpSemver(version, "minor")) // Outputs: 1.1.0
 * console.log(bumpSemver(version, "patch")) // Outputs: 1.0.1
 * console.log(bumpSemver(version)) // Outputs: 1.0.1
 * ```
 */
function bumpSemVer(
  version: string,
  release: "major" | "minor" | "patch" = "patch",
): string {
  const semverRegex = /^(\d+)\.(\d+)\.(\d+)$/;
  const match = version.match(semverRegex);

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

export { bumpSemVer };
