# WebP Image Generator

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
- 🎯 Vite plugin with flexible hook-based pattern configuration

## Installation

### As a global tool (recommended for CLI usage)

```bash
npm install -g @niekph/webp-image-generator
```

### As a project dependency

```bash
npm install @niekph/webp-image-generator
# or
yarn add @niekph/webp-image-generator
```

## CLI Usage

### Basic usage

```bash
# Process all images in current directory (recommended)
webp-gen 'resources/images/**/*'

# Process specific formats (use quotes to prevent shell expansion)
webp-gen 'resources/images/**/*.{png,jpg,jpeg}'

# Process images in specific directory
webp-gen 'src/images/**/*.png'

# Multiple patterns
webp-gen 'assets/**/*.png' 'public/**/*.jpg'
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
webp-gen --quality 90 'images/**/*'

# Regenerate all files
webp-gen --no-skip-existing 'resources/**/*'

# Verbose output
webp-gen --verbose 'src/**/*.png'

# Multiple directories
webp-gen 'src/assets/**/*' 'public/images/**/*'
```

## Shell Compatibility Notes

**Important**: Always use **single quotes** around glob patterns to prevent your shell from expanding them prematurely.

```bash
# ✅ Correct - prevents shell expansion
webp-gen 'resources/images/**/*.{png,jpg,jpeg}'

# ❌ Incorrect - may cause "no matches found" errors
webp-gen resources/images/**/*.{png,jpg,jpeg}
```

## Programmatic Usage

```typescript
import {generateWebpFiles} from '@niekph/webp-image-generator';

await generateWebpFiles(['src/**/*.{png,jpg}'], 'MyApp', {
    quality: 80,
    skipExisting: true
});
```

## Vite Plugin Usage

The Vite plugin supports flexible pattern configuration for different build hooks.

### Basic Usage (patterns run during buildStart)

```typescript
import {defineConfig} from 'vite';
import {webpGenerator} from '@niekph/webp-image-generator';

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

### Hook-specific Pattern Configuration

```typescript
import {defineConfig} from 'vite';
import {webpGenerator} from '@niekph/webp-image-generator';

export default defineConfig({
    plugins: [
        webpGenerator({
            patterns: {
                buildStart: ['src/assets/**/*.{png,jpg,jpeg}'],
                buildEnd: ['dist/images/**/*.{png,jpg,jpeg}']
            },
            quality: 90,
            skipExisting: true
        })
    ]
});
```

### Advanced Examples

```typescript
// Only process images at build end (e.g., for dist optimization)
webpGenerator({
    patterns: {
        buildEnd: ['dist/assets/**/*.{png,jpg,jpeg}']
    }
})

// Different patterns for different hooks
webpGenerator({
    patterns: {
        buildStart: ['src/assets/**/*.png'], // Source images
        buildEnd: ['dist/images/**/*.jpg']   // Built images
    },
    quality: 85
})

// Multiple patterns per hook
webpGenerator({
    patterns: {
        buildStart: [
            'src/assets/images/**/*.{png,jpg}',
            'src/components/**/assets/*.{png,jpg,jpeg}'
        ],
        buildEnd: ['dist/assets/**/*.{png,jpg,jpeg}']
    }
})
```

## API

### `generateWebpFiles(patterns, mode, options)`

- `patterns`: string | string[] - Glob patterns for image files
- `mode`: string - Mode identifier for logging
- `options`: WebPOptions
  - `quality?: number` - WebP quality (0-100, default: 80)
  - `skipExisting?: boolean` - Skip existing WebP files (default: true)

### `webpGenerator(options)` - Vite Plugin

- `options`: WebPPluginOptions
  - `patterns?: string[] | ViteHookPatterns` - Pattern configuration
    - **string[]**: Patterns to run during `buildStart` only
    - **ViteHookPatterns**: Object with `buildStart?` and `buildEnd?` arrays
  - `quality?: number` - WebP quality (0-100, default: 80)
  - `skipExisting?: boolean` - Skip existing WebP files (default: true)

#### ViteHookPatterns Type

```typescript
type ViteHookPatterns = {
  buildStart?: string[];  // Patterns to process when build starts
  buildEnd?: string[];    // Patterns to process when build ends
}
```

## Build Hook Usage

- **`buildStart`**: Ideal for processing source images before bundling
- **`buildEnd`**: Perfect for optimizing images in the final build output

## Requirements

- Node.js >= 16.0.0
- Images in PNG, JPG, or JPEG format

## License

MIT