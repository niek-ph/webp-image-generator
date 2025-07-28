#!/usr/bin/env node
import { Command } from 'commander';
import { generateWebpFiles } from './generator';

const program = new Command();

program
  .name('webp-gen')
  .description('Generate WebP images from PNG/JPG files')
  .version('1.0.0');

program
  .argument('[paths...]', 'Image file patterns (glob patterns supported)')
  .option('-q, --quality <number>', 'WebP quality (0-100)', '80')
  .option('--no-skip-existing', 'Regenerate existing WebP files')
  .option('-v, --verbose', 'Verbose output')
  .action(async (paths: string[], options) => {
    console.log('🚀 Starting WebP generation...');

    if (paths.length <= 0) {
      throw new Error('No image file patterns provided');
    }

    if (options.verbose) {
      console.log('📝 Configuration:');
      console.log(`  Paths: ${paths.join(', ')}`);
      console.log(`  Quality: ${options.quality}`);
      console.log(`  Skip existing: ${options.skipExisting}`);
      console.log(`  Working directory: ${process.cwd()}`);
    }

    try {
      const quality = parseInt(options.quality);
      if (isNaN(quality) || quality < 0 || quality > 100) {
        throw new Error('Quality must be a number between 0 and 100');
      }

      await generateWebpFiles(paths, 'CLI', {
        quality,
        skipExisting: options.skipExisting,
      });
      console.log('✨ All WebP generation tasks completed!');
    } catch (error) {
      console.error('❌ WebP generation failed:', error);
      process.exit(1);
    }
  });

// Add some example commands to help
program.addHelpText(
  'after',
  `

Examples:
  $ npx webp-gen                              # Process all images in current directory
  $ npx webp-gen "src/images/**/*.{png,jpg}"  # Process images in src/images
  $ npx webp-gen "assets/**/*.png" "public/**/*.jpg" # Multiple patterns
  $ npx webp-gen --quality 90 "images/**/*"  # Custom quality
  $ npx webp-gen --no-skip-existing          # Regenerate all files
`
);

program.parse();
