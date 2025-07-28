import {existsSync, mkdirSync, readdirSync, rmdirSync, statSync, unlinkSync, writeFileSync} from 'fs';
import {rm} from 'fs/promises';
import {join} from 'path';
import sharp from 'sharp';

export const TEST_DIR = join(__dirname, 'temp');
export const TEST_IMAGES_DIR = join(TEST_DIR, 'images');

async function removeDirectoryRecursive(dirPath: string): Promise<void> {
    if (!existsSync(dirPath)) {
        return;
    }

    let retries = 3;
    while (retries > 0) {
        try {
            // Try the modern async approach first
            await rm(dirPath, {recursive: true, force: true, maxRetries: 3, retryDelay: 100});
            return;
        } catch (error) {
            retries--;
            if (retries === 0) {
                // Fallback to manual recursive removal
                try {
                    await manualRemoveDirectory(dirPath);
                    return;
                } catch (fallbackError) {
                    console.warn(`Warning: Could not clean up directory ${dirPath}:`, fallbackError);
                }
            } else {
                // Wait a bit before retrying
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
    }
}

async function manualRemoveDirectory(dirPath: string): Promise<void> {
    if (!existsSync(dirPath)) {
        return;
    }

    const files = readdirSync(dirPath);

    for (const file of files) {
        const filePath = join(dirPath, file);
        const stat = statSync(filePath);

        if (stat.isDirectory()) {
            await manualRemoveDirectory(filePath);
        } else {
            unlinkSync(filePath);
        }
    }

    rmdirSync(dirPath);
}

function ensureDirectoryExists(dirPath: string): void {
    if (!existsSync(dirPath)) {
        mkdirSync(dirPath, {recursive: true});
    }

    // Double-check the directory was created
    if (!existsSync(dirPath)) {
        throw new Error(`Failed to create directory: ${dirPath}`);
    }
}

export async function setupTestEnvironment(): Promise<void> {
    // Clean up any existing test directory with retries
    await removeDirectoryRecursive(TEST_DIR);

    // Wait a bit to ensure cleanup is complete
    await new Promise(resolve => setTimeout(resolve, 50));

    // Create test directories with verification
    ensureDirectoryExists(TEST_DIR);
    ensureDirectoryExists(TEST_IMAGES_DIR);

    // Create test images sequentially to avoid race conditions
    await createTestImage('test1.png', 'png');
    await createTestImage('test2.jpg', 'jpeg');

    // Create subfolder and its image
    const subfolderPath = join(TEST_IMAGES_DIR, 'subfolder');
    ensureDirectoryExists(subfolderPath);
    await createTestImage('subfolder/test3.png', 'png');

    // Verify all test files were created
    const expectedFiles = [
        join(TEST_IMAGES_DIR, 'test1.png'),
        join(TEST_IMAGES_DIR, 'test2.jpg'),
        join(TEST_IMAGES_DIR, 'subfolder/test3.png')
    ];

    for (const file of expectedFiles) {
        if (!existsSync(file)) {
            throw new Error(`Test setup failed: ${file} was not created`);
        }
    }
}

export async function createTestImage(relativePath: string, format: 'png' | 'jpeg'): Promise<string> {
    const fullPath = join(TEST_IMAGES_DIR, relativePath);
    const dir = join(fullPath, '..');

    // Ensure directory exists with verification
    ensureDirectoryExists(dir);

    try {
        // Create a simple colored square image
        const buffer = await sharp({
            create: {
                width: 100,
                height: 100,
                channels: 3,
                background: format === 'png' ? {r: 255, g: 0, b: 0} : {r: 0, g: 255, b: 0}
            }
        })
            .png()
            .toBuffer();

        writeFileSync(fullPath, buffer);

        // Verify file was created and is readable
        if (!existsSync(fullPath)) {
            throw new Error(`File was not created: ${fullPath}`);
        }

        // Verify file has content
        const stat = statSync(fullPath);
        if (stat.size === 0) {
            throw new Error(`Created file is empty: ${fullPath}`);
        }

        return fullPath;
    } catch (error) {
        throw new Error(`Failed to create test image ${relativePath}: ${error}`);
    }
}

export async function cleanupTestEnvironment(): Promise<void> {
    await removeDirectoryRecursive(TEST_DIR);

    // Wait a bit to ensure cleanup is complete
    await new Promise(resolve => setTimeout(resolve, 50));
}