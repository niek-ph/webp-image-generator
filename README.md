# WebP Image Generator

[![CI](https://github.com/niek-ph/webp-image-generator/workflows/CI/badge.svg)](https://github.com/niek-ph/webp-image-generator/actions)
[![npm version](https://badge.fury.io/js/%40niekph%2Fwebp-image-generator.svg)](https://badge.fury.io/js/%40niekph%2Fwebp-image-generator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


A simple CLI tool and Vite plugin to generate WebP images from PNG/JPG files with intelligent caching and flexible path
configuration.

## Features

- 🚀 Fast WebP generation using Sharp
- 📁 Support for multiple file patterns and directories
- ⚡ Intelligent caching (skips files that are already up-to-date)
- 🎛️ Configurable quality settings
- 📦 Both CLI tool and Vite plugin
- 🌐 Cross-platform support

## Installation

### As a global tool (recommended for CLI usage)

```bash
npm install -g webp-image-generator
```

### As a project dependency

```bash
npm install webp-image-generator
# or
yarn add webp-image-generator
```

## CLI Usage

### Basic usage

```bash
# Process all images in current directory
webp-gen "**/*.{png,jpg,jpeg}"

# Process images in specific directory
webp-gen "src/images/**/*.{png,jpg}"

# Multiple patterns
webp-gen "assets/**/*.png" "public/**/*.jpg"
```

### CLI Options

- `-q, --quality <number>`: WebP quality (0-100, default: 80)
- `--no-skip-existing`: Regenerate existing WebP files
- `-v, --verbose`: Verbose output
- `-h, --help`: Show help
- `--version`: Show version

### Examples

```bash
# Custom quality
webp-gen --quality 90 "images/**/*"

# Regenerate all files
webp-gen --no-skip-existing "**/*.{png,jpg}"

# Verbose output
webp-gen --verbose "src/**/*.png"
```

## Programmatic Usage

```typescript
import {generateWebpFiles} from 'webp-image-generator';

await generateWebpFiles(['src/**/*.{png,jpg}'], 'MyApp', {
    quality: 80,
    skipExisting: true
});
```

## Vite Plugin Usage

```typescript
import {defineConfig} from 'vite';
import {webpGenerator} from 'webp-image-generator';

export default defineConfig({
    plugins: [
        webpGenerator({
            patterns: ['src/assets/**/*.{png,jpg,jpeg}'],
            quality: 80,
            skipExisting: true
        })
    ]
});
```

## API

### `generateWebpFiles(patterns, mode, options)`

- `patterns`: string | string[] - Glob patterns for image files
- `mode`: string - Mode identifier for logging
- `options`: WebPOptions
    - `quality?: number` - WebP quality (0-100, default: 80)
    - `skipExisting?: boolean` - Skip existing WebP files (default: true)

## Requirements

- Node.js >= 16.0.0
- Images in PNG, JPG, or JPEG format

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Changelog

### 1.0.0

- Initial release
- CLI tool for WebP generation
- Vite plugin support
- Intelligent caching
- Configurable quality settings

```