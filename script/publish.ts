const ver = Deno.args[0];
const configFileName = Deno.args[1] || "deno.json";

const readConfigFile = await Deno.readTextFile(configFileName);
const config = JSON.parse(readConfigFile);
// let version = config.version;

// Get Latest Published Tag from GitHub
// const ghRepo = JSON.parse(readConfigFile).name.replace("@", "");
// const ghTags =
//   await (await fetch(`https://api.github.com/repos/${ghRepo}/tags`))
//     .json();
// const ghLatestTag = ghTags.map((tag: any) => tag.name).sort((a: any, b: any) =>
//   a.localeCompare(b, undefined, { numeric: true })
// ).pop();

// Get Latest Published Tag from JSR
const jsrMetaData =
  await (await fetch(`https://jsr.io/${config.name}/meta.json`))
    .json();
const jsrLatestVer = jsrMetaData?.latest;

let pubVersion = ver || bumpVersion(jsrLatestVer);

console.log(`Publishing v${pubVersion}\n`);

if (pubVersion) {
  await bumpAndPush();
  await createTag();
} else {
  console.error(`No version specified!`);
  Deno.exit(1);
}

async function createTag() {
  console.log(`Creating Tag v${pubVersion}`);

  const tagCmd = new Deno.Command("git", {
    args: [
      "tag",
      "-a",
      `v${pubVersion}`,
      "-m",
      `Release v${pubVersion}`,
    ],
  });
  const res = await tagCmd.output();
  const { code, stdout, stderr } = res;

  if (code === 0) {
    console.log(`Successfully Created Tag v${pubVersion}!`);
    await pushTag();
  } else {
    console.log(new TextDecoder().decode(code === 0 ? stdout : stderr));
    await bumpAndPush();
    await createTag();
  }
  return res;
}

async function pushTag() {
  const pushCmd = new Deno.Command("git", {
    args: [
      "push",
      "origin",
      `v${pubVersion}`,
    ],
  });
  const { code, stdout, stderr } = await pushCmd.output();
  console.log(new TextDecoder().decode(code === 0 ? stdout : stderr));

  if (code === 0) {
    console.log(`Successfully published v${pubVersion}!`);
  } else {
    console.error(`Failed to publish v${pubVersion}`);
    Deno.exit(1);
  }
}

// Function to increment the patch version (e.g., 1.0.0 → 1.0.1)
function bumpVersion(version: string): string {
  const parts = version.split(".");
  parts[2] = (parseInt(parts[2]) + 1).toString(); // Increment patch version
  return parts.join(".");
}

async function bumpAndPush() {
  // Bump version
  pubVersion = bumpVersion(pubVersion);
  config.version = pubVersion;
  console.log(`Bumping to v${pubVersion}`);

  // Update deno.json
  await Deno.writeTextFile(
    configFileName,
    JSON.stringify(config, null, 2) + "\n",
  );
  console.log(`Updated ${configFileName} to v${pubVersion}`);

  // Commit the change
  await new Deno.Command("git", { args: ["add", configFileName] })
    .output();
  await new Deno.Command("git", {
    args: [
      "commit",
      "-m",
      `chore(release): bump version number to v${pubVersion}`,
    ],
  }).output();
  await new Deno.Command("git", { args: ["push"] }).output();
  console.log(`Successfully bumped to v${pubVersion} and pushed!`);
}
