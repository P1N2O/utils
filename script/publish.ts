const file = "deno.json";

const fileContentString = await Deno.readTextFile(file);
const fileContentJson = JSON.parse(fileContentString);
let version = JSON.parse(fileContentString).version;

console.log(`Publishing v${version}\n`);

if (version) {
  await createTag();
} else {
  console.error(`Version not found in ${file}`);
  Deno.exit(1);
}

async function createTag() {
  console.log(`Creating Tag v${version}`);

  const tagCmd = new Deno.Command("git", {
    args: [
      "tag",
      "-a",
      `v${version}`,
      "-m",
      `Release v${version}`,
    ],
  });
  const res = await tagCmd.output();
  const { code, stdout, stderr } = res;

  if (code === 0) {
    console.log(`Successfully Created Tag v${version}!`);
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

// Function to increment the patch version (e.g., 1.0.0 → 1.0.1)
function bumpVersion(version: string): string {
  const parts = version.split(".");
  parts[2] = (parseInt(parts[2]) + 1).toString(); // Increment patch version
  return parts.join(".");
}

async function bumpAndPush() {
  // Bump version
  version = bumpVersion(version);
  fileContentJson.version = version;
  console.log(`Bumping to v${version}`);

  // Update deno.json
  await Deno.writeTextFile(
    file,
    JSON.stringify(fileContentJson, null, 2) + "\n",
  );
  console.log(`Updated ${file} to v${version}`);

  // Commit the change
  await new Deno.Command("git", { args: ["add", file] })
    .output();
  await new Deno.Command("git", {
    args: [
      "commit",
      "-m",
      `chore(release): bump version number to v${version}`,
    ],
  }).output();
  await new Deno.Command("git", { args: ["push"] }).output();
  console.log(`Successfully bumped to v${version} and pushed!`);
}
