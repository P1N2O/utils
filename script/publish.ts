import { bumpSemVer } from "@p1n2o/utils";
import { parseArgs } from "@std/cli/parse-args";

const args = parseArgs(Deno.args);
const ver = args.ver;
const file = args.file || args.fileName || "deno.json";

const readConfigFile = await Deno.readTextFile(file);
const config = JSON.parse(readConfigFile);

let pubVersion: string;

// Get Latest Published Tag from GitHub
// const ghRepo = JSON.parse(readConfigFile).name.replace("@", "");
// const ghTags =
//   await (await fetch(`https://api.github.com/repos/${ghRepo}/tags`))
//     .json();
// const ghLatestTag = ghTags.map((tag: any) => tag.name).sort((a: any, b: any) =>
//   a.localeCompare(b, undefined, { numeric: true })
// ).pop();

// Update Publish Version
if (ver) {
  pubVersion = ver;
} else {
  // Get latest publish JSR version
  const jsrVersion =
    (await (await fetch(`https://jsr.io/${config.name}/meta.json`))
      .json())?.latest;
  pubVersion = bumpSemVer(jsrVersion);
}

console.log(`Trying to Publishing v${pubVersion}\n`);

if (pubVersion) {
  await updateConfigVer();
  await createTag();
} else {
  console.error(`No version specified!`);
  Deno.exit(1);
}

/**
 * Create Tag
 */
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
    // Bump Version and retry
    pubVersion = bumpSemVer(pubVersion);
    await updateConfigVer();
    await createTag();
  }
  return res;
}

/**
 * Push Tag
 */
async function pushTag(version: string = pubVersion) {
  const pushCmd = new Deno.Command("git", {
    args: [
      "push",
      "origin",
      `v${version}`,
    ],
  });
  const { code, stdout, stderr } = await pushCmd.output();
  console.log(new TextDecoder().decode(code === 0 ? stdout : stderr));

  if (code === 0) {
    console.log(`Successfully published v${version}!`);
  } else {
    console.error(`Failed to publish v${version}`);
    Deno.exit(1);
  }
}

/**
 * Update config file to specified version
 */
async function updateConfigVer(version: string = pubVersion) {
  if (config.version !== version) {
    config.version = version;
    console.log(`Bumping ${file} from v${config.version} to v${version}`);
    // Update the file
    await Deno.writeTextFile(
      file,
      JSON.stringify(config, null, 2) + "\n",
    );
    console.log(`Updated ${file} to v${version}`);
    // Commit the change
    await new Deno.Command("git", { args: ["add", file] })
      .output();
    await new Deno.Command("git", {
      args: [
        "commit",
        "-m",
        `chore(release): bump version number to v${pubVersion}`,
      ],
    }).output();
    // Push changes
    await new Deno.Command("git", { args: ["push"] }).output();
    console.log(`Successfully bumped to v${pubVersion}, committed and pushed!`);
  } else {
    console.log(`Ignoring file bump: ${file} is already at v${version}`);
  }
}
