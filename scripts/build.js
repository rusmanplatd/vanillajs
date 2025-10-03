#!/usr/bin/env node

/**
 * Build Script
 * Compiles and processes JavaScript and CSS files
 * Supports both individual file builds and production bundling
 */

import * as esbuild from 'esbuild';
import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname, relative, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { minify as terserMinify } from 'terser';
import { createHash } from 'crypto';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const args = process.argv.slice(2);
const isWatch = args.includes('--watch');
// Detect mode from npm_lifecycle_event or explicit argument
const isBundleOnly =
  process.env.npm_lifecycle_event === 'bundle' || args.includes('--bundle');
const isBuildAll = process.env.npm_lifecycle_event === 'build' && !isWatch;

// Generate cache suffix with timestamp and hash
const timestamp = Date.now();
const hash = createHash('md5')
  .update(timestamp.toString())
  .digest('hex')
  .substring(0, 8);
const cacheSuffix = `.${timestamp}.${hash}`;

// Bundle configurations for production builds
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

if (isBuildAll) {
  console.log('🔨 Building project (all modes)...');
  if (cacheSuffix) {
    console.log(`   Cache suffix: ${cacheSuffix}`);
  }
  console.log('');
} else {
  console.log(`🔨 Building project${isBundleOnly ? ' (bundle mode)' : ''}...`);
  if (cacheSuffix) {
    console.log(`   Cache suffix: ${cacheSuffix}`);
  }
  console.log('');
}

/**
 * Get all JS files from src directory recursively
 *
 * @param {string} dir - Directory to search
 * @param {string[]} [files=[]] - Accumulated files array
 * @returns {Promise<string[]>} Array of JS file paths
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
 * Get all CSS files from src directory recursively
 *
 * @param {string} dir - Directory to search
 * @param {string[]} [files=[]] - Accumulated files array
 * @returns {Promise<string[]>} Array of CSS file paths
 */
async function getCssFiles(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      await getCssFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.css')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Build JavaScript files
 *
 * @param {string} outDir - Output directory for built files
 * @returns {Promise<*>} Build result or watch context
 */
async function buildJs(outDir) {
  const srcDir = join(rootDir, 'src/js');
  const jsFiles = await getJsFiles(srcDir);

  console.log(`📦 Building ${jsFiles.length} JavaScript files...`);

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
    outExtension: cacheSuffix ? { '.js': `${cacheSuffix}.js` } : undefined,
  };

  if (isWatch) {
    const context = await esbuild.context(buildOptions);
    await context.watch();
    console.log('✅ Initial build complete');
    console.log('👀 Watching for changes...\n');
    return context;
  }
  const result = await esbuild.build(buildOptions);
  console.log(`✅ JavaScript build complete\n`);
  return result;
}

/**
 * Build CSS files
 *
 * @param {string} outDir - Output directory for built files
 * @returns {Promise<*>} Build result or watch context
 */
async function buildCss(outDir) {
  const srcDir = join(rootDir, 'src/css');
  const cssFiles = await getCssFiles(srcDir);

  console.log(`🎨 Building ${cssFiles.length} CSS files...`);

  const buildOptions = {
    entryPoints: cssFiles,
    outdir: join(rootDir, outDir, 'css'),
    outbase: 'src/css',
    minify: false,
    sourcemap: true,
    logLevel: 'info',
    loader: { '.css': 'css' },
    outExtension: cacheSuffix ? { '.css': `${cacheSuffix}.css` } : undefined,
  };

  if (isWatch) {
    const context = await esbuild.context(buildOptions);
    await context.watch();
    console.log('✅ Initial CSS build complete\n');
    return context;
  }
  const result = await esbuild.build(buildOptions);
  console.log(`✅ CSS build complete\n`);
  return result;
}

/**
 * Minify JavaScript files in place
 *
 * @param {string} dir - Directory containing JS files
 * @returns {Promise<void>}
 */
async function minifyJsFiles(dir) {
  const allJsFiles = await getJsFiles(join(rootDir, dir, 'js'));

  // Filter out already minified files
  const jsFiles = allJsFiles.filter((file) => !file.endsWith('.min.js'));

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

    // Create .min.js with cache suffix if enabled
    const dir = dirname(filePath);
    const name = basename(filePath, '.js').replace(cacheSuffix, ''); // Remove cache suffix from name
    const minPath = join(dir, `${name}${cacheSuffix}.min.js`);

    await writeFile(minPath, result.code, 'utf8');
    if (result.map) {
      await writeFile(`${minPath}.map`, result.map, 'utf8');
    }
  }

  console.log(`✅ JavaScript minification complete\n`);
}

/**
 * Minify CSS files in place
 *
 * @param {string} dir - Directory containing CSS files
 * @returns {Promise<void>}
 */
async function minifyCssFiles(dir) {
  const allCssFiles = await getCssFiles(join(rootDir, dir, 'css'));

  // Filter out already minified files
  const cssFiles = allCssFiles.filter((file) => !file.endsWith('.min.css'));

  console.log(`🗜️  Minifying ${cssFiles.length} CSS files...\n`);

  for (const filePath of cssFiles) {
    const code = await readFile(filePath, 'utf8');

    try {
      const result = execSync(`npx csso-cli "${filePath}"`, {
        encoding: 'utf8',
        cwd: rootDir,
      });

      // Create .min.css with cache suffix if enabled
      const dir = dirname(filePath);
      const name = basename(filePath, '.css').replace(cacheSuffix, ''); // Remove cache suffix from name
      const minPath = join(dir, `${name}${cacheSuffix}.min.css`);

      await writeFile(minPath, result, 'utf8');
    } catch (error) {
      console.error(`  ✗ ${basename(filePath)}: ${error.message}`);
    }
  }

  console.log(`✅ CSS minification complete\n`);
}

/**
 * Bundle a single entry point
 *
 * @param {object} config - Bundle configuration
 * @param {string} outDir - Output directory
 * @param {boolean} [minify=false] - Whether to minify the bundle
 * @returns {Promise<*>} Build result
 */
async function bundleEntry(config, outDir, minify = false) {
  const suffix = minify ? '.min' : '';
  const outputFile = join(
    rootDir,
    outDir,
    'js',
    `${config.name}.bundle${cacheSuffix}${suffix}.js`
  );

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

    console.log(
      `  ✓ ${config.name.padEnd(15)} ${sizeKb}KB - ${config.description}`
    );

    return result;
  } catch (error) {
    console.error(`  ✗ ${config.name.padEnd(15)} Failed: ${error.message}`);
    throw error;
  }
}

/**
 * Bundle all CSS files into one
 *
 * @param {string} outDir - Output directory
 * @param {boolean} [minify=false] - Whether to minify the bundle
 * @returns {Promise<*>} Build result
 */
async function bundleCss(outDir, minify = false) {
  const suffix = minify ? '.min' : '';
  const outputFile = join(
    rootDir,
    outDir,
    'css',
    `styles.bundle${cacheSuffix}${suffix}.css`
  );

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
 *
 * @param {string} outDir - Output directory
 * @param {boolean} [minify=false] - Whether to minify the bundle
 * @returns {Promise<*>} Build result
 */
async function bundleAll(outDir, minify = false) {
  const suffix = minify ? '.min' : '';
  const outputFile = join(
    rootDir,
    outDir,
    'js',
    `vanillajs.bundle${cacheSuffix}${suffix}.js`
  );

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

    console.log(
      `  ✓ vanillajs.bundle${suffix}.js ${sizeKb}KB - Complete framework bundle`
    );

    return result;
  } catch (error) {
    console.error(`  ✗ All-in-one bundle failed: ${error.message}`);
    throw error;
  }
}

/**
 * Get all files recursively
 *
 * @param {string} dir - Directory to search
 * @param {string} ext - File extension to match
 * @param {string[]} [files=[]] - Accumulated files array
 * @returns {Promise<string[]>} Array of file paths
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
 * Minify JavaScript file with Terser (for minify mode)
 *
 * @param {string} inputPath - Path to input file
 * @param {string} outputPath - Path to output file
 * @returns {Promise<object>} Minification stats
 */
async function minifyJsFile(inputPath, outputPath) {
  const code = await readFile(inputPath, 'utf8');

  const result = await terserMinify(code, {
    ecma: 2021,
    module: true,
    compress: {
      arrows: true,
      arguments: true,
      booleans: true,
      drop_console: false,
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
 *
 * @param {string} inputPath - Path to input file
 * @param {string} outputPath - Path to output file
 * @returns {Promise<object>} Minification stats
 */
async function minifyCssFile(inputPath, outputPath) {
  const code = await readFile(inputPath, 'utf8');

  try {
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
 *
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size string
 */
function formatSize(bytes) {
  if (bytes < 1024) {
    return `${bytes}B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)}KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

/**
 * Generate manifest.json mapping original filenames to cache-busted versions
 *
 * @param {string} outDir - Output directory
 * @param {boolean} [forBundle=false] - Whether this is for bundle mode
 * @param {boolean} [includeBundle=false] - Whether to include bundle files
 * @returns {Promise<void>}
 */
async function generateManifest(
  outDir,
  forBundle = false,
  includeBundle = false
) {
  const manifest = {};

  if (forBundle) {
    // Add individual bundles
    for (const config of bundles) {
      manifest[`js/${config.name}.bundle.js`] =
        `js/${config.name}.bundle${cacheSuffix}.js`;
      manifest[`js/${config.name}.bundle.min.js`] =
        `js/${config.name}.bundle${cacheSuffix}.min.js`;
    }

    // Add all-in-one bundle
    manifest['js/vanillajs.bundle.js'] = `js/vanillajs.bundle${cacheSuffix}.js`;
    manifest['js/vanillajs.bundle.min.js'] =
      `js/vanillajs.bundle${cacheSuffix}.min.js`;

    // Add CSS bundle
    manifest['css/styles.bundle.css'] = `css/styles.bundle${cacheSuffix}.css`;
    manifest['css/styles.bundle.min.css'] =
      `css/styles.bundle${cacheSuffix}.min.css`;
  } else {
    // Individual file builds - JS files
    const jsFiles = await getJsFiles(join(rootDir, outDir, 'js'));

    for (const filePath of jsFiles) {
      const relativePath = relative(join(rootDir, outDir), filePath);
      const originalName = relativePath
        .replace(cacheSuffix, '')
        .replace('.min', '');

      if (filePath.includes('.min.js')) {
        const key = originalName.replace('.js', '.min.js');
        manifest[key] = relativePath;
      } else if (!filePath.includes('.map')) {
        manifest[originalName] = relativePath;
      }
    }

    // Individual file builds - CSS files
    const cssFiles = await getCssFiles(join(rootDir, outDir, 'css'));

    for (const filePath of cssFiles) {
      const relativePath = relative(join(rootDir, outDir), filePath);
      const originalName = relativePath
        .replace(cacheSuffix, '')
        .replace('.min', '');

      if (filePath.includes('.min.css')) {
        const key = originalName.replace('.css', '.min.css');
        manifest[key] = relativePath;
      } else if (!filePath.includes('.map')) {
        manifest[originalName] = relativePath;
      }
    }

    // Include bundle files if requested
    if (includeBundle) {
      // Add individual bundles
      for (const config of bundles) {
        manifest[`bundle/js/${config.name}.bundle.js`] =
          `bundle/js/${config.name}.bundle${cacheSuffix}.js`;
        manifest[`bundle/js/${config.name}.bundle.min.js`] =
          `bundle/js/${config.name}.bundle${cacheSuffix}.min.js`;
      }

      // Add all-in-one bundle
      manifest['bundle/js/vanillajs.bundle.js'] =
        `bundle/js/vanillajs.bundle${cacheSuffix}.js`;
      manifest['bundle/js/vanillajs.bundle.min.js'] =
        `bundle/js/vanillajs.bundle${cacheSuffix}.min.js`;

      // Add CSS bundle
      manifest['bundle/css/styles.bundle.css'] =
        `bundle/css/styles.bundle${cacheSuffix}.css`;
      manifest['bundle/css/styles.bundle.min.css'] =
        `bundle/css/styles.bundle${cacheSuffix}.min.css`;
    }
  }

  const manifestPath = join(rootDir, outDir, 'manifest.json');
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(
    `📋 Generated manifest.json with ${Object.keys(manifest).length} entries\n`
  );
}

/**
 * Run bundle mode build
 *
 * @returns {Promise<void>}
 */
async function runBundle() {
  const outDir = 'dist/bundle';

  // Create output directories
  await mkdir(join(rootDir, outDir, 'js'), { recursive: true });
  await mkdir(join(rootDir, outDir, 'css'), { recursive: true });

  console.log('📦 Building individual bundles...\n');
  for (const config of bundles) {
    await bundleEntry(config, outDir, false);
  }

  console.log('\n📦 Building individual bundles (minified)...\n');
  for (const config of bundles) {
    await bundleEntry(config, outDir, true);
  }

  console.log('\n📦 Building all-in-one bundle...\n');
  await bundleAll(outDir, false);

  console.log('\n📦 Building all-in-one bundle (minified)...\n');
  await bundleAll(outDir, true);

  console.log('\n🎨 Building CSS bundle...\n');
  await bundleCss(outDir, false);

  console.log('\n🎨 Building CSS bundle (minified)...\n');
  await bundleCss(outDir, true);

  // Generate manifest
  await generateManifest(outDir, true);

  console.log('\n🎉 Bundling complete!\n');
  console.log(`📁 Output directory: ${outDir}/`);
  if (cacheSuffix) {
    console.log(
      `   - Individual bundles: ${outDir}/js/*.bundle${cacheSuffix}.js`
    );
    console.log(
      `   - Individual bundles (min): ${outDir}/js/*.bundle${cacheSuffix}.min.js`
    );
    console.log(
      `   - Complete bundle: ${outDir}/js/vanillajs.bundle${cacheSuffix}.js`
    );
    console.log(
      `   - Complete bundle (min): ${outDir}/js/vanillajs.bundle${cacheSuffix}.min.js`
    );
    console.log(
      `   - CSS bundle: ${outDir}/css/styles.bundle${cacheSuffix}.css`
    );
    console.log(
      `   - CSS bundle (min): ${outDir}/css/styles.bundle${cacheSuffix}.min.css`
    );
    console.log(`   - Manifest: ${outDir}/manifest.json`);
  } else {
    console.log(`   - Individual bundles: ${outDir}/js/*.bundle.js`);
    console.log(`   - Individual bundles (min): ${outDir}/js/*.bundle.min.js`);
    console.log(`   - Complete bundle: ${outDir}/js/vanillajs.bundle.js`);
    console.log(
      `   - Complete bundle (min): ${outDir}/js/vanillajs.bundle.min.js`
    );
    console.log(`   - CSS bundle: ${outDir}/css/styles.bundle.css`);
    console.log(`   - CSS bundle (min): ${outDir}/css/styles.bundle.min.css`);
  }
}

/**
 * Run standard build
 *
 * @param {boolean} [includeBundle=false] - Whether to include bundle files
 * @returns {Promise<void>}
 */
async function runStandardBuild(includeBundle = false) {
  const outDir = 'dist';
  await mkdir(join(rootDir, outDir, 'js'), { recursive: true });
  await mkdir(join(rootDir, outDir, 'css'), { recursive: true });

  // Build JavaScript files
  await buildJs(outDir);

  // Build CSS files
  await buildCss(outDir);

  if (!isWatch) {
    // Create minified versions
    await minifyJsFiles(outDir);
    await minifyCssFiles(outDir);

    // Generate manifest.json
    await generateManifest(outDir, false, includeBundle);
  }

  if (isWatch) {
    console.log('👀 Watching for changes...\n');
  } else {
    console.log('🎉 Build complete!\n');
    console.log(`📁 Output directory: ${outDir}/`);
    if (cacheSuffix) {
      console.log(`   - JS files: ${outDir}/js/**/*${cacheSuffix}.js`);
      console.log(`   - JS minified: ${outDir}/js/**/*${cacheSuffix}.min.js`);
      console.log(`   - CSS files: ${outDir}/css/**/*${cacheSuffix}.css`);
      console.log(
        `   - CSS minified: ${outDir}/css/**/*${cacheSuffix}.min.css`
      );
      console.log(`   - Manifest: ${outDir}/manifest.json\n`);
    } else {
      console.log(`   - JS files: ${outDir}/js/**/*.js`);
      console.log(`   - JS minified: ${outDir}/js/**/*.min.js`);
      console.log(`   - CSS files: ${outDir}/css/**/*.css`);
      console.log(`   - CSS minified: ${outDir}/css/**/*.min.css\n`);
    }
  }
}

/**
 * Main build function
 *
 * @returns {Promise<void>}
 */
async function build() {
  try {
    if (isBundleOnly) {
      await runBundle();
    } else if (isBuildAll) {
      // Run all modes in sequence
      console.log(
        '══════════════════════════════════════════════════════════\n'
      );
      console.log('STEP 1: Standard Build\n');
      console.log(
        '══════════════════════════════════════════════════════════\n'
      );
      await runStandardBuild(true); // Include bundle files in manifest

      console.log(
        '\n══════════════════════════════════════════════════════════\n'
      );
      console.log('STEP 2: Bundle Build\n');
      console.log(
        '══════════════════════════════════════════════════════════\n'
      );
      await runBundle();

      console.log('\n🎉 All builds completed successfully!\n');
    } else {
      await runStandardBuild(false);
    }

    if (!isWatch) {
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
