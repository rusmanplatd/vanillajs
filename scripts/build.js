#!/usr/bin/env node

/**
 * Build Script
 * Compiles and processes JavaScript and CSS files
 */

import * as esbuild from 'esbuild';
import { readdir, readFile, writeFile } from 'fs/promises';
import { join, dirname, relative, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { mkdir } from 'fs/promises';
import { minify as terserMinify } from 'terser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const args = process.argv.slice(2);
const isWatch = args.includes('--watch');

console.log(`🔨 Building project...`);
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
async function buildJs(outDir, suffix = '') {
  const srcDir = join(rootDir, 'src/js');
  const jsFiles = await getJsFiles(srcDir);

  console.log(`📦 Building ${jsFiles.length} JavaScript files${suffix ? ' (' + suffix.replace('.', '') + ')' : ''}...`);

  const buildOptions = {
    entryPoints: jsFiles,
    outdir: join(rootDir, outDir, 'js'),
    outbase: 'src/js',
    format: 'esm',
    target: 'es2021',
    minify: false,
    sourcemap: true,
    splitting: false,
    bundle: false,
    preserveSymlinks: false,
    logLevel: 'info',
    loader: { '.js': 'js' },
    outExtension: suffix ? { '.js': `${suffix}.js` } : undefined,
  };

  if (isWatch) {
    const context = await esbuild.context(buildOptions);
    await context.watch();
    console.log('✅ Initial build complete');
    console.log('👀 Watching for changes...\n');
    return context;
  } else {
    const result = await esbuild.build(buildOptions);
    console.log(`✅ JavaScript build complete${suffix ? ' (' + suffix.replace('.', '') + ')' : ''}\n`);
    return result;
  }
}

/**
 * Minify JavaScript files in place
 */
async function minifyJsFiles(dir) {
  const allJsFiles = await getJsFiles(join(rootDir, dir, 'js'));

  // Filter out already minified files
  const jsFiles = allJsFiles.filter(file => !file.endsWith('.min.js'));

  console.log(`🗜️  Minifying ${jsFiles.length} JavaScript files...\n`);

  for (const filePath of jsFiles) {
    const code = await readFile(filePath, 'utf8');
    const result = await terserMinify(code, {
      ecma: 2021,
      module: true,
      compress: {
        drop_console: false,
        drop_debugger: true,
        passes: 2,
      },
      mangle: {
        toplevel: false,
      },
      format: {
        comments: false,
      },
      sourceMap: {
        filename: basename(filePath),
        url: `${basename(filePath)}.map`,
      },
    });

    // Rename to .min.js
    const dir = dirname(filePath);
    const name = basename(filePath, '.js');
    const minPath = join(dir, `${name}.min.js`);

    await writeFile(minPath, result.code, 'utf8');
    if (result.map) {
      await writeFile(`${minPath}.map`, result.map, 'utf8');
    }
  }

  console.log(`✅ Minification complete\n`);
}

/**
 * Main build function
 */
async function build() {
  try {
    const outDir = 'dist';
    await mkdir(join(rootDir, outDir, 'js'), { recursive: true });

    // Build regular version
    await buildJs(outDir);

    if (!isWatch) {
      // Create minified versions (.min.js)
      await minifyJsFiles(outDir);
    }

    if (isWatch) {
      console.log('👀 Watching for changes...\n');
    } else {
      console.log('🎉 Build complete!\n');
      console.log(`📁 Output directory: ${outDir}/`);
      console.log(`   - Regular files: ${outDir}/js/**/*.js`);
      console.log(`   - Minified files: ${outDir}/js/**/*.min.js\n`);
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
