const file: string = "deno.json";
const fileContents: string = await Deno.readTextFile(file);
const version = JSON.parse(fileContents).version;

console.log(`Publishing v${version}\n`);

if (!version) {
  console.error(`Version not found in ${file}`);
  Deno.exit(1);
}

// Generate Tag
const tagCmd = new Deno.Command("git", {
  args: [
    "tag",
    "-a",
    `v${version}`,
    "-m",
    `Release v${version}`,
  ],
});
const { code, stdout, stderr } = await tagCmd.output();
console.log(new TextDecoder().decode(code === 0 ? stdout : stderr) + "\n");

// Push Tag
if (code === 0) {
  const pushCmd = new Deno.Command("git", {
    args: [
      "push",
      "origin",
      `v${version}`,
    ],
  });
  const { code, stdout, stderr } = await pushCmd.output();
  console.log(new TextDecoder().decode(code === 0 ? stdout : stderr) + "\n");

  if (code === 0) {
    console.log(`Successfully Published v${version}!`);
  } else {
    console.error(`Failed to publish v${version}`);
    Deno.exit(1);
  }
}
