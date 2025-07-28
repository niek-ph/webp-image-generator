import { generateWebpFiles, WebPOptions } from './generator';

type ViteHookPatterns = {
  buildStart?: string[];
  buildEnd?: string[];
};

type PatternsType = string[] | ViteHookPatterns;

export interface WebPPluginOptions extends WebPOptions {
  patterns?: PatternsType;
}

/**
 * Vite plugin for generating WebP files from PNG & JPG images.
 */
export function webpGenerator(options: WebPPluginOptions = {}) {
  const { patterns = ['assets/images/**/*.{png,jpg,jpeg}'], ...webpOptions } =
    options;

  // Helper function to check if patterns is a hook configuration object
  function isHookPatterns(p: PatternsType): p is ViteHookPatterns {
    return p !== null && typeof p === 'object' && !Array.isArray(p);
  }

  // Determine patterns for each hook
  const buildStartPatterns = isHookPatterns(patterns)
    ? patterns.buildStart
    : patterns;

  const buildEndPatterns = isHookPatterns(patterns)
    ? patterns.buildEnd
    : undefined;

  return {
    name: 'webp-generator',
    async buildStart() {
      if (buildStartPatterns && buildStartPatterns.length > 0) {
        await generateWebpFiles(buildStartPatterns, 'Build Start', webpOptions);
      }
    },
    async closeBundle() {
      if (buildEndPatterns && buildEndPatterns.length > 0) {
        await generateWebpFiles(buildEndPatterns, 'Build End', webpOptions);
      }
    },
  };
}
