/**
 * Build Configuration
 * Defines entry points and build settings for the project
 */

export const buildConfig = {
  // JavaScript entry points
  entryPoints: [
    // Core modules
    'src/js/reactive-component.js',
    'src/js/directives.js',
    'src/js/injector.js',
    'src/js/forms.js',
    'src/js/i18n.js',
    'src/js/i18n-helpers.js',
    'src/js/http-client.js',
    'src/js/breakpoint-observer.js',
    'src/js/theme-manager.js',
    'src/js/manifest-loader.js',

    // Component examples
    'src/js/counter.component.js',
  ],

  // CSS files to process
  cssFiles: [
    'src/css/all.css',
    'src/css/design-system.css',
    'src/css/ui-components.css',
    'src/css/grid-system.css',
    'src/css/typography-utilities.css',
    'src/css/utility-classes.css',
    'src/css/animations.css',

    // Component styles
    'src/js/counter.component.css',
  ],

  // Output directories
  outDir: 'dist',
  outDirDev: 'dist/dev',
  outDirProd: 'dist/prod',

  // Build options
  options: {
    bundle: false, // Keep modules separate for vanilla JS
    format: 'esm', // ES Module format
    target: 'es2021', // Target ES2021
    minify: false, // Minification handled separately by terser
    sourcemap: true,
    splitting: false,
    preserveSymlinks: false,
  },
};
