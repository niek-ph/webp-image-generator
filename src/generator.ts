import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { dirname, extname } from 'path';
import sharp from 'sharp';
import { stat } from 'node:fs/promises';

export interface WebPOptions {
  quality?: number;
  skipExisting?: boolean;
}

// Supported image formats for WebP conversion
const SUPPORTED_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

function isSupportedImageFormat(filePath: string): boolean {
  const ext = extname(filePath).toLowerCase();
  return SUPPORTED_EXTENSIONS.includes(ext);
}

async function isFile(filePath: string): Promise<boolean> {
  try {
    const stats = await stat(filePath);
    return stats.isFile();
  } catch (error) {
    console.warn('Error running fs.stat of file', error);
    return false;
  }
}

export async function generateWebpFiles(
  patterns: string | string[],
  mode: string = 'Default',
  options: WebPOptions = {}
) {
  const { quality = 80, skipExisting = true } = options;
  const patternArray = Array.isArray(patterns) ? patterns : [patterns];

  let totalFiles = 0;
  let processedFiles = 0;

  for (const pattern of patternArray) {
    const imageFiles = glob.sync(pattern, {
      ignore: ['**/*.webp', '**/*.webp.*'],
      // Only return files, not directories
      nodir: true,
      // Follow symbolic links to files but not directories
      follow: true,
      // Ignore case for file extensions
      nocase: true,
    });

    const supportedImageFiles = imageFiles.filter(isSupportedImageFormat);

    totalFiles += supportedImageFiles.length;

    console.log(
      `🖼️ [${mode}] Found ${supportedImageFiles.length} supported images in pattern: ${pattern}`
    );

    for (const filePath of supportedImageFiles) {
      try {
        // Check if path is a file (not a directory)
        if (!(await isFile(filePath))) {
          continue;
        }

        const webpPath = `${filePath}.webp`;

        // Check if WebP file already exists and is newer than original
        if (skipExisting && existsSync(webpPath)) {
          const originalStats = await import('fs').then((fs) =>
            fs.promises.stat(filePath)
          );
          const webpStats = await import('fs').then((fs) =>
            fs.promises.stat(webpPath)
          );

          if (webpStats.mtime > originalStats.mtime) {
            console.log(
              `⏭️ [${mode}] Skipping ${filePath} (WebP is up to date)`
            );
            continue;
          }
        }

        // Ensure directory exists
        mkdirSync(dirname(webpPath), { recursive: true });

        // Read original file and convert to WebP
        const imageBuffer = readFileSync(filePath);
        const webpBuffer = await sharp(imageBuffer)
          .webp({ quality })
          .toBuffer();

        // Write WebP file
        writeFileSync(webpPath, webpBuffer);

        console.log(`✅ [${mode}] Generated: ${webpPath}`);
        processedFiles++;
      } catch (error) {
        console.error(`❌ [${mode}] Error processing ${filePath}:`, error);
      }
    }
  }

  console.log(
    `🎉 [${mode}] WebP generation completed! Processed ${processedFiles}/${totalFiles} files.`
  );
}
