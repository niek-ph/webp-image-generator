import {generateWebpFiles, WebPOptions} from "./generator";

export interface WebPPluginOptions extends WebPOptions {
    patterns?: {
        development?: string | string[];
        production?: string | string[];
    };
}

/**
 * Vite plugin for generating WebP files from PNG & JPG images.
 */
export function webpGenerator(options: WebPPluginOptions = {}) {
    const {
        patterns = {
            development: "resources/images/**/*.{png,jpg,jpeg}",
            production: "public/**/*.{png,jpg,jpeg}",
        },
        ...webpOptions
    } = options;

    return {
        name: "webp-generator",
        async buildStart() {
            if (patterns.development) {
                await generateWebpFiles(
                    patterns.development,
                    "Development",
                    webpOptions
                );
            }
        },
        async closeBundle() {
            if (patterns.production) {
                await generateWebpFiles(
                    patterns.production,
                    "Production",
                    webpOptions
                );
            }
        },
    };
}