#!/usr/bin/env node

/**
 * Minification Script
 * Minifies JavaScript and CSS files using Terser and CSSO
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname, extname, relative } from 'path';
import { fileURLToPath } from 'url';
import { minify as terserMinify } from 'terser';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const srcDirJs = join(rootDir, 'dist/dev/js');
const outDirJs = join(rootDir, 'dist/prod/js');
const srcDirCss = join(rootDir, 'src/css');
const outDirCss = join(rootDir, 'dist/prod/css');

console.log('🗜️  Minifying files...\n');

/**
 * Get all files recursively
 */
async function getAllFiles(dir, ext, files = []) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        await getAllFiles(fullPath, ext, files);
      } else if (entry.isFile() && entry.name.endsWith(ext)) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Directory might not exist, ignore
  }

  return files;
}

/**
 * Minify JavaScript file with Terser
 */
async function minifyJs(inputPath, outputPath) {
  const code = await readFile(inputPath, 'utf8');

  const result = await terserMinify(code, {
    ecma: 2021,
    module: true,
    compress: {
      arrows: true,
      arguments: true,
      booleans: true,
      drop_console: false, // Keep console for debugging
      drop_debugger: true,
      evaluate: true,
      inline: 2,
      join_vars: true,
      loops: true,
      passes: 2,
      pure_getters: true,
      reduce_vars: true,
      sequences: true,
      unsafe: false,
      unsafe_arrows: false,
      unused: true,
    },
    mangle: {
      toplevel: false,
      eval: false,
      keep_classnames: false,
      keep_fnames: false,
      safari10: false,
    },
    format: {
      comments: false,
      ascii_only: false,
      beautify: false,
      braces: false,
    },
    sourceMap: {
      filename: relative(rootDir, inputPath),
      url: `${extname(outputPath).slice(1)}.map`,
    },
  });

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, result.code, 'utf8');

  if (result.map) {
    await writeFile(`${outputPath}.map`, result.map, 'utf8');
  }

  const originalSize = Buffer.byteLength(code);
  const minifiedSize = Buffer.byteLength(result.code);
  const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);

  return { originalSize, minifiedSize, savings };
}

/**
 * Minify CSS file with CSSO
 */
async function minifyCss(inputPath, outputPath) {
  const code = await readFile(inputPath, 'utf8');

  try {
    // Use CSSO CLI via execSync
    const result = execSync(`npx csso-cli "${inputPath}"`, {
      encoding: 'utf8',
      cwd: rootDir,
    });

    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, result, 'utf8');

    const originalSize = Buffer.byteLength(code);
    const minifiedSize = Buffer.byteLength(result);
    const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);

    return { originalSize, minifiedSize, savings };
  } catch (error) {
    console.error(`Error minifying ${inputPath}:`, error.message);
    throw error;
  }
}

/**
 * Format file size
 */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

/**
 * Main minification function
 */
async function minify() {
  try {
    // Create output directories
    await mkdir(outDirJs, { recursive: true });
    await mkdir(outDirCss, { recursive: true });

    // Get all JS and CSS files
    const jsFiles = await getAllFiles(srcDirJs, '.js');
    const cssFiles = await getAllFiles(srcDirCss, '.css');

    let totalOriginal = 0;
    let totalMinified = 0;

    // Minify JavaScript files
    console.log(`📦 Minifying ${jsFiles.length} JavaScript files...\n`);

    for (const filePath of jsFiles) {
      const relativePath = relative(srcDirJs, filePath);
      const outputPath = join(outDirJs, relativePath);

      try {
        const { originalSize, minifiedSize, savings } = await minifyJs(
          filePath,
          outputPath
        );

        totalOriginal += originalSize;
        totalMinified += minifiedSize;

        console.log(
          `  ✓ ${relativePath.padEnd(50)} ${formatSize(originalSize)} → ${formatSize(minifiedSize)} (${savings}% smaller)`
        );
      } catch (error) {
        console.error(`  ✗ ${relativePath}: ${error.message}`);
      }
    }

    // Minify CSS files
    if (cssFiles.length > 0) {
      console.log(`\n🎨 Minifying ${cssFiles.length} CSS files...\n`);

      for (const filePath of cssFiles) {
        const relativePath = relative(srcDirCss, filePath);
        const outputPath = join(outDirCss, relativePath);

        try {
          const { originalSize, minifiedSize, savings } = await minifyCss(
            filePath,
            outputPath
          );

          totalOriginal += originalSize;
          totalMinified += minifiedSize;

          console.log(
            `  ✓ ${relativePath.padEnd(50)} ${formatSize(originalSize)} → ${formatSize(minifiedSize)} (${savings}% smaller)`
          );
        } catch (error) {
          console.error(`  ✗ ${relativePath}: ${error.message}`);
        }
      }
    }

    const totalSavings = ((1 - totalMinified / totalOriginal) * 100).toFixed(
      1
    );

    console.log('\n📊 Summary:');
    console.log(`   Original:  ${formatSize(totalOriginal)}`);
    console.log(`   Minified:  ${formatSize(totalMinified)}`);
    console.log(`   Savings:   ${totalSavings}%`);
    console.log('\n🎉 Minification complete!\n');
  } catch (error) {
    console.error('❌ Minification failed:', error);
    process.exit(1);
  }
}

minify();
