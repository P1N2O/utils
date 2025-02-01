# Utils

A collection of utility functions for common JavaScript/TypeScript tasks

[![JSR](https://jsr.io/badges/@p1n2o/utils)](https://jsr.io/@p1n2o/utils)
[![JSR Score](https://jsr.io/badges/@p1n2o/utils/score)](https://jsr.io/@p1n2o/utils/score)
![GitHub License](https://img.shields.io/github/license/p1n2o/utils)

## Installation

### Deno

```bash
deno add jsr:@p1n2o/utils
```

### Node.js

```bash
npx jsr add @p1n2o/utils
```

### Bun

```bash
bunx jsr add @p1n2o/utils
```

### For other package managers

Check the [JSR page for more details](https://jsr.io/@p1n2o/utils).

## Example

```ts ignore
import { parseUserAgent } from "@p1n2o/utils/user-agent";

const ua = parseUserAgent(
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
);
console.log(ua);
// Outputs:
// {
//   browser: { name: "Chrome", version: "58.0.3029.110", version_major: 58 },
//   device: { brand: null, model: null, name: "Other" },
//   os: { name: "Windows NT", version: "10.0", version_major: 10 },
//   type: {
//     bot: false,
//     mobile: false,
//     pc: true,
//     tablet: false,
//     touch_capable: false
//   },
//   ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
// }
```

## License

This code is licensed under MIT license
