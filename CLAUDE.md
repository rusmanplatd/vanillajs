# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a vanilla JavaScript project for browser-based development with no framework dependencies. The project uses modern ES2021+ JavaScript with module syntax.

## Development Commands

```bash
# Start development server with live reload
npm start              # Opens index.html on port 8080
npm run dev           # Starts server without opening browser

# Code quality
npm run lint          # Check code with ESLint
npm run lint:fix      # Auto-fix ESLint issues
npm run format        # Format code with Prettier
npm run format:check  # Check formatting without changes

# Documentation
npm run docs          # Generate JSDoc documentation to ./docs
npm run docs:watch    # Auto-regenerate docs when src/ changes
```

## Code Structure

- Source code should be placed in `src/` directory
- JSDoc documentation is generated from `src/` to `./docs`
- Main entry point is `index.html` (referenced by live-server)

## Code Standards

- **JSDoc**: All functions should have JSDoc comments with descriptions
- **ES Modules**: Use `import`/`export` syntax (sourceType: "module")
- **Browser environment**: Code runs in browser with ES2021+ features
- **Formatting**: Prettier enforces single quotes, semicolons, 2-space indentation
- **Linting**: ESLint validates code quality and JSDoc completeness

## Third-Party Dependencies

- RxJS is available in `packages/rxjs/` (CommonJS format)
