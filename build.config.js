/**
 * Build Configuration
 * Defines entry points and build settings for the project
 */

export const buildConfig = {
  // JavaScript entry points
  entryPoints: [
    // Core modules
    'src/component.js',
    'src/reactive-component.js',
    'src/directives.js',
    'src/injector.js',
    'src/forms.js',
    'src/i18n.js',
    'src/i18n-helpers.js',
    'src/http-client.js',
    'src/breakpoint-observer.js',
    'src/theme-manager.js',

    // Demo files
    'src/design-system-demo.js',
    'src/i18n-demo.js',

    // Examples
    'src/examples/counter.component.js',
    'src/examples/todo.component.js',
    'src/examples/todo.service.js',
  ],

  // CSS files to process
  cssFiles: [
    'src/design-system.css',
    'src/ui-components.css',
    'src/grid-system.css',
    'src/typography-utilities.css',
    'src/utility-classes.css',
    'src/animations.css',
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
