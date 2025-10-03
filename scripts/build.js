#!/usr/bin/env node

/**
 * Build Script
 * Compiles and processes JavaScript and CSS files
 */

import * as esbuild from 'esbuild';
import { readdir } from 'fs/promises';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { mkdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const args = process.argv.slice(2);
const isProd = args.includes('--prod');
const isWatch = args.includes('--watch');

const outDir = isProd ? 'dist/prod' : 'dist/dev';

console.log(`🔨 Building project...`);
console.log(`   Mode: ${isProd ? 'PRODUCTION' : 'DEVELOPMENT'}`);
console.log(`   Output: ${outDir}`);
console.log('');

/**
 * Get all JS files from src directory recursively
 */
async function getJsFiles(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      await getJsFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Build JavaScript files
 */
async function buildJs() {
  const srcDir = join(rootDir, 'src/js');
  const jsFiles = await getJsFiles(srcDir);

  console.log(`📦 Building ${jsFiles.length} JavaScript files...`);

  const buildOptions = {
    entryPoints: jsFiles,
    outdir: join(rootDir, outDir, 'js'),
    outbase: 'src/js',
    format: 'esm',
    target: 'es2021',
    minify: false, // We'll use terser separately for better minification
    sourcemap: true,
    splitting: false,
    bundle: false, // Keep files separate
    preserveSymlinks: false,
    logLevel: 'info',
    loader: { '.js': 'copy' }, // Just copy JS files
  };

  if (isWatch) {
    // Use context API for watch mode
    const context = await esbuild.context(buildOptions);
    await context.watch();
    console.log('✅ Initial build complete');
    console.log('👀 Watching for changes...\n');
    return context;
  } else {
    // Use build API for one-time build
    const result = await esbuild.build(buildOptions);
    console.log('✅ JavaScript build complete\n');
    return result;
  }
}

/**
 * Main build function
 */
async function build() {
  try {
    // Create output directory
    await mkdir(join(rootDir, outDir), { recursive: true });

    // Build JavaScript
    const result = await buildJs();

    if (isWatch) {
      console.log('👀 Watching for changes...\n');
    } else {
      console.log('🎉 Build complete!\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
