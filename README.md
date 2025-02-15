# Utils

A collection of utilities for common JavaScript/TypeScript tasks

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

Check out on [JSR](https://jsr.io/@p1n2o/utils) for more details.

## Example

```ts ignore
import { bump } from "@p1n2o/utils/sem-ver";

const version = "1.0.0";
console.log(bump(version, "major")); // Outputs: 2.0.0
console.log(bump(version, "minor")); // Outputs: 1.1.0
console.log(bump(version, "patch")); // Outputs: 1.0.1
console.log(bump(version)); // Outputs: 1.0.1
```

## License

MIT License
