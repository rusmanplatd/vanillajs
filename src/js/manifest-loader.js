/**
 * Manifest Loader
 * Loads scripts and styles with cache-busted filenames from manifest.json
 */

const manifestCache = {};

/**
 * Load manifest.json
 *
 * @param {string} [manifestPath='/dist/manifest.json'] - Path to manifest file
 * @returns {Promise<object>} Manifest object
 */
async function loadManifest(manifestPath = '/dist/manifest.json') {
  if (manifestCache[manifestPath]) {
    return manifestCache[manifestPath];
  }

  try {
    const response = await fetch(manifestPath);
    const manifest = await response.json();
    manifestCache[manifestPath] = manifest;
    return manifest;
  } catch (error) {
    console.error('Failed to load manifest:', error);
    return {};
  }
}

/**
 * Get versioned file path from manifest
 *
 * @param {string} originalPath - Original file path
 * @param {string} [manifestPath='/dist/manifest.json'] - Path to manifest file
 * @returns {Promise<string>} Versioned file path
 */
async function getVersionedPath(
  originalPath,
  manifestPath = '/dist/manifest.json'
) {
  const manifest = await loadManifest(manifestPath);
  return manifest[originalPath] || originalPath;
}

/**
 * Load a script module with versioning
 *
 * @param {string} originalPath - Original script path
 * @param {string} [manifestPath='/dist/manifest.json'] - Path to manifest file
 * @returns {Promise<*>} Loaded module
 */
export async function loadScript(
  originalPath,
  manifestPath = '/dist/manifest.json'
) {
  const versionedPath = await getVersionedPath(originalPath, manifestPath);
  const basePath = manifestPath.includes('bundle') ? '/dist/bundle/' : '/dist/';
  const fullPath = `${basePath}${versionedPath}`;

  try {
    const module = await import(fullPath);
    return module;
  } catch (error) {
    console.error(`Failed to load script: ${fullPath}`, error);
    throw error;
  }
}

/**
 * Load a CSS file with versioning
 *
 * @param {string} originalPath - Original CSS path
 * @param {string} [manifestPath='/dist/manifest.json'] - Path to manifest file
 * @returns {Promise<string>} Loaded style path
 */
export async function loadStyle(
  originalPath,
  manifestPath = '/dist/manifest.json'
) {
  const versionedPath = await getVersionedPath(originalPath, manifestPath);
  const basePath = manifestPath.includes('bundle') ? '/dist/bundle/' : '/dist/';
  const fullPath = `${basePath}${versionedPath}`;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = fullPath;
  document.head.appendChild(link);

  return new Promise((resolve, reject) => {
    link.onload = () => resolve(fullPath);
    link.onerror = () => reject(new Error(`Failed to load style: ${fullPath}`));
  });
}

/**
 * Get multiple versioned paths at once
 *
 * @param {string[]} paths - Array of original paths
 * @param {string} [manifestPath='/dist/manifest.json'] - Path to manifest file
 * @returns {Promise<string[]>} Array of versioned paths
 */
export async function getVersionedPaths(
  paths,
  manifestPath = '/dist/manifest.json'
) {
  const manifest = await loadManifest(manifestPath);
  return paths.map((path) => manifest[path] || path);
}
