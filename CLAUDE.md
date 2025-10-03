# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Project Overview

This is a vanilla JavaScript project for browser-based development with no framework dependencies.
The project uses modern ES2021+ JavaScript with module syntax and provides a comprehensive
component-based architecture for building web applications.

## Project Structure

```
/var/www/html/vanillajs/
├── src/                    # Source code (all development happens here)
│   ├── js/                 # JavaScript modules
│   │   ├── component.js              # Base component system
│   │   ├── directives.js             # DOM directives
│   │   ├── forms.js                  # Form validation framework
│   │   ├── http-client.js            # HTTP utilities with interceptors
│   │   ├── i18n.js                   # Internationalization core
│   │   ├── i18n-helpers.js           # i18n utilities
│   │   ├── injector.js               # Dependency injection
│   │   ├── breakpoint-observer.js    # Responsive utilities
│   │   ├── theme-manager.js          # Theme switching
│   │   └── manifest-loader.js        # Component manifest loading
│   └── css/                # Stylesheets
│       ├── all.css                   # Main CSS entry point
│       ├── design-system.css         # Design tokens and variables
│       ├── ui-components.css         # Component styles
│       ├── grid-system.css           # Flexbox grid system
│       ├── animations.css            # Animation utilities
│       ├── typography-utilities.css  # Text utilities
│       └── utility-classes.css       # Helper classes
├── dist/                   # Build output (generated)
├── scripts/                # Build automation
│   ├── build.js            # Main build script
│   ├── bundle.js           # esbuild bundler
│   └── minify.js           # Code minification
├── examples/               # Demo files and usage examples
├── docs/                   # JSDoc generated documentation
├── i18n/                   # Internationalization JSON files
├── packages/rxjs/          # Third-party: RxJS library (CommonJS)
├── index.html              # Main entry point
└── build.config.js         # Build configuration
```

## Development Commands

```bash
# Development server
npm start              # Opens index.html on port 8080 with live reload
npm run dev           # Starts server without opening browser

# Build & bundle
npm run build         # Run build script
npm run build:watch   # Watch mode for builds
npm run bundle        # Bundle with esbuild
npm run minify        # Minify code with terser/csso
npm run clean         # Remove dist directory

# Code quality
npm run validate      # Run all linters + format check
npm run lint          # Check all (JS, CSS, HTML, MD)
npm run lint:js       # ESLint only
npm run lint:css      # Stylelint only
npm run lint:html     # HTMLHint only
npm run lint:md       # Markdownlint only
npm run lint:fix      # Auto-fix JS, CSS, and format
npm run format        # Format code with Prettier
npm run format:check  # Check formatting without changes

# Documentation
npm run docs          # Generate JSDoc documentation to ./docs
npm run docs:watch    # Auto-regenerate docs when src/ changes
```

## Code Standards

- **JSDoc**: All functions must have JSDoc comments with descriptions, @param, @returns
- **ES Modules**: Use `import`/`export` syntax (sourceType: "module")
- **Browser environment**: Code runs in browser with ES2021+ features
- **Formatting**: Prettier enforces single quotes, semicolons, 2-space indentation
- **Linting**: ESLint validates code quality and JSDoc completeness
- **File organization**: All source code must be in `src/` directory
- **Entry point**: [index.html](index.html) references all modules and styles

## Architecture Features

### Component System

- Base component class in [src/js/component.js](src/js/component.js)
- DOM directives for declarative templates in [src/js/directives.js](src/js/directives.js)
- Manifest-based component loading in [src/js/manifest-loader.js](src/js/manifest-loader.js)

### Forms & Validation

- Comprehensive form validation framework in [src/js/forms.js](src/js/forms.js)
- Custom validators and error handling

### HTTP & Data

- HTTP client with interceptors in [src/js/http-client.js](src/js/http-client.js)
- Request/response transformation

### Internationalization (i18n)

- Core i18n engine in [src/js/i18n.js](src/js/i18n.js)
- Helper utilities in [src/js/i18n-helpers.js](src/js/i18n-helpers.js)
- Locale files in `i18n/` directory

### Dependency Injection

- DI container in [src/js/injector.js](src/js/injector.js)
- Service registration and resolution

### UI & Theming

- Theme manager for dark/light modes in [src/js/theme-manager.js](src/js/theme-manager.js)
- Breakpoint observer for responsive design in
  [src/js/breakpoint-observer.js](src/js/breakpoint-observer.js)
- Design system with CSS custom properties in [src/css/design-system.css](src/css/design-system.css)

## Third-Party Dependencies

- **RxJS**: Available in `packages/rxjs/` (CommonJS format) for reactive programming
- **Development tools**: esbuild, terser, csso-cli for bundling and minification

## Important Guidelines

- ALWAYS prefer editing existing files over creating new ones
- NEVER create documentation files unless explicitly requested
- Place all source code in `src/` directory
- Follow JSDoc standards for all functions
- Run `npm run validate` before committing changes
