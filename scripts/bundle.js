#!/usr/bin/env node

/**
 * Bundle Script
 * Bundles all JavaScript modules into single files for production
 */

import * as esbuild from 'esbuild';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const outDir = 'dist/bundle';

console.log(`📦 Bundling project...`);
console.log(`   Output: ${outDir}`);
console.log('');

/**
 * Bundle configurations
 * Each entry point creates a separate bundle
 */
const bundles = [
  {
    name: 'core',
    entry: 'src/js/component.js',
    description: 'Core component system',
  },
  {
    name: 'reactive',
    entry: 'src/js/reactive-component.js',
    description: 'Reactive components with directives',
  },
  {
    name: 'forms',
    entry: 'src/js/forms.js',
    description: 'Form validation and reactive forms',
  },
  {
    name: 'http',
    entry: 'src/js/http-client.js',
    description: 'HTTP client with RxJS',
  },
  {
    name: 'i18n',
    entry: 'src/js/i18n.js',
    description: 'Internationalization system',
  },
  {
    name: 'theme',
    entry: 'src/js/theme-manager.js',
    description: 'Theme management',
  },
  {
    name: 'breakpoint',
    entry: 'src/js/breakpoint-observer.js',
    description: 'Responsive breakpoint observer',
  },
];

/**
 * Bundle a single entry point
 */
async function bundleEntry(config, minify = false) {
  const suffix = minify ? '.min' : '';
  const outputFile = join(rootDir, outDir, 'js', `${config.name}.bundle${suffix}.js`);

  try {
    const result = await esbuild.build({
      entryPoints: [join(rootDir, config.entry)],
      bundle: true,
      format: 'esm',
      target: 'es2021',
      minify: minify,
      sourcemap: true,
      splitting: false,
      treeShaking: true,
      outfile: outputFile,
      logLevel: 'info',
      metafile: true,
      external: [], // Bundle everything
    });

    // Calculate bundle size
    const meta = result.metafile;
    const output = Object.keys(meta.outputs)[0];
    const sizeKb = (meta.outputs[output].bytes / 1024).toFixed(1);

    console.log(`  ✓ ${config.name.padEnd(15)} ${sizeKb}KB - ${config.description}`);

    return result;
  } catch (error) {
    console.error(`  ✗ ${config.name.padEnd(15)} Failed: ${error.message}`);
    throw error;
  }
}

/**
 * Bundle all CSS files into one
 */
async function bundleCss(minify = false) {
  const suffix = minify ? '.min' : '';
  const outputFile = join(rootDir, outDir, 'css', `styles.bundle${suffix}.css`);

  try {
    const result = await esbuild.build({
      entryPoints: [join(rootDir, 'src/css/all.css')],
      bundle: true,
      minify: minify,
      sourcemap: true,
      outfile: outputFile,
      logLevel: 'info',
      loader: { '.css': 'css' },
    });

    console.log(`  ✓ styles.bundle${suffix}.css - Complete CSS bundle`);

    return result;
  } catch (error) {
    console.error(`  ✗ CSS bundle failed: ${error.message}`);
    throw error;
  }
}

/**
 * Create a complete all-in-one bundle
 */
async function bundleAll(minify = false) {
  const suffix = minify ? '.min' : '';
  const outputFile = join(rootDir, outDir, 'js', `vanillajs.bundle${suffix}.js`);

  try {
    const result = await esbuild.build({
      entryPoints: [join(rootDir, 'src/js/component.js')],
      bundle: true,
      format: 'esm',
      target: 'es2021',
      minify: minify,
      sourcemap: true,
      splitting: false,
      treeShaking: true,
      outfile: outputFile,
      logLevel: 'info',
      metafile: true,
    });

    const meta = result.metafile;
    const output = Object.keys(meta.outputs)[0];
    const sizeKb = (meta.outputs[output].bytes / 1024).toFixed(1);

    console.log(`  ✓ vanillajs.bundle${suffix}.js ${sizeKb}KB - Complete framework bundle`);

    return result;
  } catch (error) {
    console.error(`  ✗ All-in-one bundle failed: ${error.message}`);
    throw error;
  }
}

/**
 * Main bundle function
 */
async function bundle() {
  try {
    // Create output directories
    await mkdir(join(rootDir, outDir, 'js'), { recursive: true });
    await mkdir(join(rootDir, outDir, 'css'), { recursive: true });

    console.log('📦 Building individual bundles...\n');
    for (const config of bundles) {
      await bundleEntry(config, false);
    }

    console.log('\n📦 Building individual bundles (minified)...\n');
    for (const config of bundles) {
      await bundleEntry(config, true);
    }

    console.log('\n📦 Building all-in-one bundle...\n');
    await bundleAll(false);

    console.log('\n📦 Building all-in-one bundle (minified)...\n');
    await bundleAll(true);

    console.log('\n🎨 Building CSS bundle...\n');
    await bundleCss(false);

    console.log('\n🎨 Building CSS bundle (minified)...\n');
    await bundleCss(true);

    console.log('\n🎉 Bundling complete!\n');
    console.log(`📁 Output directory: ${outDir}/`);
    console.log(`   - Individual bundles: ${outDir}/js/*.bundle.js`);
    console.log(`   - Individual bundles (min): ${outDir}/js/*.bundle.min.js`);
    console.log(`   - Complete bundle: ${outDir}/js/vanillajs.bundle.js`);
    console.log(`   - Complete bundle (min): ${outDir}/js/vanillajs.bundle.min.js`);
    console.log(`   - CSS bundle: ${outDir}/css/styles.bundle.css`);
    console.log(`   - CSS bundle (min): ${outDir}/css/styles.bundle.min.css`);
  } catch (error) {
    console.error('\n❌ Bundling failed:', error);
    process.exit(1);
  }
}

bundle();
