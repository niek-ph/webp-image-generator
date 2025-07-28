import {execSync} from 'child_process';
import {existsSync} from 'fs';
import {join} from 'path';
import {cleanupTestEnvironment, setupTestEnvironment, TEST_IMAGES_DIR} from './setup';

describe('CLI Command', () => {
    const CLI_PATH = join(__dirname, '../dist/cli.js');

    beforeEach(async () => {
        await setupTestEnvironment();
    });

    afterEach(() => {
        cleanupTestEnvironment();
    });

    test('should show help message', () => {
        const output = execSync(`node ${CLI_PATH} --help`, {encoding: 'utf8'});
        expect(output).toContain('Generate WebP images from PNG/JPG files');
        expect(output).toContain('Examples:');
    });

    test('should show version', () => {
        const output = execSync(`node ${CLI_PATH} --version`, {encoding: 'utf8'});
        expect(output.trim()).toBe('1.0.0');
    });

    test('should generate WebP files with default options', () => {
        const pattern = join(TEST_IMAGES_DIR, '**/*.{png,jpg}');

        const output = execSync(`node ${CLI_PATH} "${pattern}"`, {
            encoding: 'utf8',
            stdio: 'pipe'
        });

        expect(output).toContain('🚀 Starting WebP generation...');
        expect(output).toContain('✨ All WebP generation tasks completed!');
        expect(existsSync(join(TEST_IMAGES_DIR, 'test1.png.webp'))).toBe(true);
        expect(existsSync(join(TEST_IMAGES_DIR, 'test2.jpg.webp'))).toBe(true);
    });

    test('should respect quality option', () => {
        const pattern = join(TEST_IMAGES_DIR, 'test1.png');

        const output = execSync(`node ${CLI_PATH} "${pattern}" --quality 90`, {
            encoding: 'utf8',
            stdio: 'pipe'
        });

        expect(output).toContain('✨ All WebP generation tasks completed!');
        expect(existsSync(join(TEST_IMAGES_DIR, 'test1.png.webp'))).toBe(true);
    });

    test('should handle verbose output', () => {
        const pattern = join(TEST_IMAGES_DIR, 'test1.png');

        const output = execSync(`node ${CLI_PATH} "${pattern}" --verbose`, {
            encoding: 'utf8',
            stdio: 'pipe'
        });

        expect(output).toContain('📝 Configuration:');
        expect(output).toContain('Quality: 80');
        expect(output).toContain('Skip existing: true');
    });

    test('should handle no-skip-existing option', () => {
        const pattern = join(TEST_IMAGES_DIR, 'test1.png');

        // First run
        execSync(`node ${CLI_PATH} "${pattern}"`, {
            stdio: 'pipe'
        });

        expect(existsSync(join(TEST_IMAGES_DIR, 'test1.png.webp'))).toBe(true);

        // Second run with --no-skip-existing
        const output = execSync(`node ${CLI_PATH} "${pattern}" --no-skip-existing --verbose`, {
            encoding: 'utf8',
            stdio: 'pipe'
        });

        expect(output).toContain('Skip existing: false');
    });

    test('should handle multiple patterns', () => {
        const pattern1 = join(TEST_IMAGES_DIR, '*.png');
        const pattern2 = join(TEST_IMAGES_DIR, '*.jpg');

        const output = execSync(`node ${CLI_PATH} "${pattern1}" "${pattern2}"`, {
            encoding: 'utf8',
            stdio: 'pipe'
        });

        expect(output).toContain('✨ All WebP generation tasks completed!');
        expect(existsSync(join(TEST_IMAGES_DIR, 'test1.png.webp'))).toBe(true);
        expect(existsSync(join(TEST_IMAGES_DIR, 'test2.jpg.webp'))).toBe(true);
    });

    test('should handle empty pattern gracefully', () => {
        const pattern = join(TEST_IMAGES_DIR, 'nonexistent/*.png');

        const output = execSync(`node ${CLI_PATH} "${pattern}"`, {
            encoding: 'utf8',
            stdio: 'pipe'
        });

        expect(output).toContain('Found 0 images in pattern');
        expect(output).toContain('✨ All WebP generation tasks completed!');
    });
});