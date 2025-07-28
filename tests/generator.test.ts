import { existsSync, statSync } from 'fs';
import { join } from 'path';
import { generateWebpFiles } from '../src/generator';
import {
  cleanupTestEnvironment,
  setupTestEnvironment,
  TEST_IMAGES_DIR,
} from './setup';

describe('generateWebpFiles', () => {
  beforeEach(async () => {
    await setupTestEnvironment();
  });

  afterEach(async () => {
    await cleanupTestEnvironment();
  });

  test('should generate WebP files from PNG and JPG', async () => {
    const pattern = join(TEST_IMAGES_DIR, '**/*.{png,jpg}');

    await generateWebpFiles([pattern], 'Test', {
      quality: 80,
      skipExisting: false,
    });

    // Verify all expected WebP files were created
    const expectedWebpFiles = [
      join(TEST_IMAGES_DIR, 'test1.png.webp'),
      join(TEST_IMAGES_DIR, 'test2.jpg.webp'),
      join(TEST_IMAGES_DIR, 'subfolder/test3.png.webp'),
    ];

    for (const webpFile of expectedWebpFiles) {
      expect(existsSync(webpFile)).toBe(true);
      // Verify file has content
      const stat = statSync(webpFile);
      expect(stat.size).toBeGreaterThan(0);
    }
  }, 10000);

  test('should skip existing WebP files when skipExisting is true', async () => {
    const pattern = join(TEST_IMAGES_DIR, '**/*.{png,jpg}');

    // First generation
    await generateWebpFiles([pattern], 'Test', {
      quality: 80,
      skipExisting: false,
    });

    const webpPath = join(TEST_IMAGES_DIR, 'test1.png.webp');
    expect(existsSync(webpPath)).toBe(true);
    const firstGenTime = statSync(webpPath).mtime;

    // Wait to ensure different timestamps
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Second generation with skipExisting: true
    await generateWebpFiles([pattern], 'Test', {
      quality: 80,
      skipExisting: true,
    });

    const secondGenTime = statSync(webpPath).mtime;
    expect(firstGenTime.getTime()).toBe(secondGenTime.getTime());
  }, 15000);

  test('should regenerate WebP files when skipExisting is false', async () => {
    const pattern = join(TEST_IMAGES_DIR, '**/*.{png,jpg}');

    // First generation
    await generateWebpFiles([pattern], 'Test', {
      quality: 50,
      skipExisting: false,
    });

    const webpPath = join(TEST_IMAGES_DIR, 'test1.png.webp');
    expect(existsSync(webpPath)).toBe(true);
    const firstSize = statSync(webpPath).size;

    // Wait to ensure different timestamps
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Second generation with different quality
    await generateWebpFiles([pattern], 'Test', {
      quality: 90,
      skipExisting: false,
    });

    const secondSize = statSync(webpPath).size;
    expect(firstSize).not.toBe(secondSize);
  }, 15000);

  test('should handle single pattern string', async () => {
    const pattern = join(TEST_IMAGES_DIR, '*.png');

    await generateWebpFiles(pattern, 'Test', {
      quality: 80,
      skipExisting: false,
    });

    expect(existsSync(join(TEST_IMAGES_DIR, 'test1.png.webp'))).toBe(true);
  }, 10000);

  test('should handle custom quality settings', async () => {
    const pattern = join(TEST_IMAGES_DIR, 'test1.png');

    await generateWebpFiles([pattern], 'Test', {
      quality: 10, // Very low quality
      skipExisting: false,
    });

    const webpPath = join(TEST_IMAGES_DIR, 'test1.png.webp');
    expect(existsSync(webpPath)).toBe(true);

    // Verify file has content
    const webpSize = statSync(webpPath).size;
    expect(webpSize).toBeGreaterThan(0);
  }, 10000);
});
