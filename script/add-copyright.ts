// Copyright (c) 2025 Manuel Pinto
// This code is licensed under MIT license (see LICENSE for details)

import { expandGlob } from "jsr:@std/fs";

const COPYRIGHT_LINE =
  "// Copyright (c) 2025 Manuel Pinto\n// This code is licensed under MIT license (see LICENSE for details)\n\n";

const TARGET_GLOB = "lib/**/*.{js,cjs,mjs,ts,cts,mts,jsx,tsx}";

async function addCopyrightToFile(filePath: string) {
  const content = await Deno.readTextFile(filePath);

  // Check if the file already starts with the copyright line (case-insensitive and trimmed)
  if (
    !content.trimStart().toLowerCase().startsWith(
      COPYRIGHT_LINE.trim().toLowerCase(),
    )
  ) {
    const newContent = COPYRIGHT_LINE + content;
    await Deno.writeTextFile(filePath, newContent);
    console.log(`Added copyright to ${filePath}`);
  }
}

async function processFiles() {
  // Use expandGlob to find all files matching the pattern
  for await (const file of expandGlob(TARGET_GLOB)) {
    if (file.isFile) {
      await addCopyrightToFile(file.path);
    }
  }
}

processFiles().catch((error) => {
  console.error("Error processing files:", error);
  Deno.exit(1);
});
